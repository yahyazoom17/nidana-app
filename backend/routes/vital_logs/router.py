"""
Vital Logs routes — Nidana
Provides CRUD endpoints for patient vital-sign logs, a composite
dashboard endpoint, and a seed route for populating mock data.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta

from services.supabase import get_supabase_client
from routes.vital_logs.schemas import (
    VitalLogCreate,
    VitalLogOut,
    VitalSummaryItem,
    TrendPoint,
    AIInsight,
    VitalLogsDashboardOut,
)

vital_logs_router = APIRouter(
    prefix="/api/vital-logs",
    tags=["vital-logs"],
)


# ── helpers ────────────────────────────────────────────────────

def _supabase():
    return get_supabase_client()


def _compute_change_pct(current, previous):
    """Return % change rounded to 1 decimal, or None."""
    if previous is None or previous == 0 or current is None:
        return None
    return round((current - previous) / previous * 100, 1)


# ================================================================
#  Dashboard (composite)
# ================================================================

@vital_logs_router.get("/dashboard/{patient_id}")
def get_vital_logs_dashboard(patient_id: str):
    """
    Return everything the Vital Logs page needs:
    - summary cards (latest reading + % change)
    - 7-day BP trend
    - AI insight
    - recent log entries
    """
    sb = _supabase()

    # Fetch recent logs (latest 20)
    recent = (
        sb.table("vital_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(20)
        .execute()
    )
    logs = recent.data or []

    # ── summary cards ──────────────────────────────────────────
    summary_cards: list[VitalSummaryItem] = []
    if logs:
        latest = logs[0]
        prev = logs[1] if len(logs) > 1 else {}

        # Blood Pressure
        if latest.get("bp_systolic") is not None:
            bp_display = f"{latest['bp_systolic']}/{latest.get('bp_diastolic', '--')}"
            bp_change = _compute_change_pct(
                latest.get("bp_systolic"), prev.get("bp_systolic")
            )
            summary_cards.append(
                VitalSummaryItem(
                    metric="Blood Pressure",
                    display_value=bp_display,
                    unit="mmHg",
                    change_pct=bp_change,
                )
            )

        # Temperature
        if latest.get("temperature") is not None:
            temp_change = _compute_change_pct(
                latest.get("temperature"), prev.get("temperature")
            )
            summary_cards.append(
                VitalSummaryItem(
                    metric="Temperature",
                    display_value=str(latest["temperature"]),
                    unit="°F",
                    change_pct=temp_change,
                )
            )

        # SpO2
        if latest.get("spo2") is not None:
            spo2_change = _compute_change_pct(
                latest.get("spo2"), prev.get("spo2")
            )
            summary_cards.append(
                VitalSummaryItem(
                    metric="SpO2",
                    display_value=str(latest["spo2"]),
                    unit="%",
                    change_pct=spo2_change,
                )
            )

        # Respiratory Rate
        if latest.get("respiratory_rate") is not None:
            rr_change = _compute_change_pct(
                latest.get("respiratory_rate"), prev.get("respiratory_rate")
            )
            summary_cards.append(
                VitalSummaryItem(
                    metric="Respiratory Rate",
                    display_value=str(latest["respiratory_rate"]),
                    unit="bpm",
                    change_pct=rr_change,
                )
            )

    # ── 7-day BP trend ─────────────────────────────────────────
    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    trend_rows = (
        sb.table("vital_logs")
        .select("recorded_at, bp_systolic, bp_diastolic")
        .eq("patient_id", patient_id)
        .gte("recorded_at", seven_days_ago)
        .order("recorded_at", desc=False)
        .execute()
    )
    trend_7day = [
        TrendPoint(
            date=row["recorded_at"],
            bp_systolic=row.get("bp_systolic"),
            bp_diastolic=row.get("bp_diastolic"),
        )
        for row in (trend_rows.data or [])
        if row.get("bp_systolic") is not None
    ]

    # ── AI insight (latest) ────────────────────────────────────
    insight_row = (
        sb.table("vital_insights")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    ai_insight = None
    if insight_row.data:
        ai_insight = AIInsight(
            summary=insight_row.data[0]["summary"],
            generated_at=insight_row.data[0].get("created_at"),
        )

    return VitalLogsDashboardOut(
        summary_cards=summary_cards,
        trend_7day=trend_7day,
        ai_insight=ai_insight,
        recent_logs=logs,
    )


# ================================================================
#  Vital Logs CRUD
# ================================================================

@vital_logs_router.get("/logs/{patient_id}")
def list_vital_logs(patient_id: str, limit: int = 50):
    data = (
        _supabase()
        .table("vital_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@vital_logs_router.post("/logs")
def create_vital_log(payload: VitalLogCreate):
    row = payload.model_dump()
    if not row.get("recorded_at"):
        row["recorded_at"] = datetime.utcnow().isoformat()
    result = (
        _supabase()
        .table("vital_logs")
        .insert(row)
        .execute()
    )
    return {"status": "ok", "data": result.data}


@vital_logs_router.put("/logs/{log_id}")
def update_vital_log(log_id: str, payload: VitalLogCreate):
    result = (
        _supabase()
        .table("vital_logs")
        .update(payload.model_dump())
        .eq("id", log_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Vital log not found")
    return {"status": "ok", "data": result.data}


@vital_logs_router.delete("/logs/{log_id}")
def delete_vital_log(log_id: str):
    _supabase().table("vital_logs").delete().eq("id", log_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  AI Insights CRUD
# ================================================================

@vital_logs_router.get("/insights/{patient_id}")
def list_insights(patient_id: str):
    data = (
        _supabase()
        .table("vital_insights")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@vital_logs_router.post("/insights")
def create_insight(patient_id: str, summary: str):
    result = (
        _supabase()
        .table("vital_insights")
        .insert({"patient_id": patient_id, "summary": summary})
        .execute()
    )
    return {"status": "ok", "data": result.data}


# ================================================================
#  Seed Mock Data
# ================================================================

MOCK_PATIENT_ID = "00000000-0000-0000-0000-000000000001"


@vital_logs_router.post("/seed")
def seed_mock_vital_logs():
    """
    Populate the database with realistic mock vital-log data
    matching the Vital Logs UI.  Idempotent — cleans previous
    seeds for the mock patient first.
    """
    sb = _supabase()
    pid = MOCK_PATIENT_ID

    # ── clean previous seeds ───────────────────────────────────
    for table in ("vital_logs", "vital_insights"):
        sb.table(table).delete().eq("patient_id", pid).execute()

    now = datetime.utcnow()
    day = timedelta(days=1)
    half = timedelta(hours=12)

    # ── 7 days of vital logs (morning + evening) ──────────────
    vitals = [
        # Day -6 — Mon
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 118, "bp_diastolic": 78,
            "heart_rate": 72, "temperature": 98.2, "spo2": 97,
            "respiratory_rate": 15,
            "recorded_at": (now - 6 * day).replace(hour=8, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 122, "bp_diastolic": 82,
            "heart_rate": 74, "temperature": 98.5, "spo2": 97,
            "respiratory_rate": 16,
            "recorded_at": (now - 6 * day).replace(hour=20, minute=0).isoformat(),
        },
        # Day -5 — Tue
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 122, "bp_diastolic": 82,
            "heart_rate": 70, "temperature": 98.3, "spo2": 98,
            "respiratory_rate": 15,
            "recorded_at": (now - 5 * day).replace(hour=8, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 124, "bp_diastolic": 84,
            "heart_rate": 76, "temperature": 98.6, "spo2": 97,
            "respiratory_rate": 16,
            "recorded_at": (now - 5 * day).replace(hour=20, minute=0).isoformat(),
        },
        # Day -4 — Wed
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 120, "bp_diastolic": 80,
            "heart_rate": 71, "temperature": 98.4, "spo2": 98,
            "respiratory_rate": 16,
            "recorded_at": (now - 4 * day).replace(hour=8, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 121, "bp_diastolic": 79,
            "heart_rate": 73, "temperature": 98.5, "spo2": 97,
            "respiratory_rate": 15,
            "recorded_at": (now - 4 * day).replace(hour=20, minute=0).isoformat(),
        },
        # Day -3 — Thu
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 119, "bp_diastolic": 79,
            "heart_rate": 68, "temperature": 98.3, "spo2": 98,
            "respiratory_rate": 16,
            "recorded_at": (now - 3 * day).replace(hour=8, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 123, "bp_diastolic": 81,
            "heart_rate": 75, "temperature": 98.4, "spo2": 97,
            "respiratory_rate": 16,
            "recorded_at": (now - 3 * day).replace(hour=20, minute=0).isoformat(),
        },
        # Day -2 — Fri
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 120, "bp_diastolic": 80,
            "heart_rate": 70, "temperature": 98.4, "spo2": 98,
            "respiratory_rate": 16,
            "recorded_at": (now - 2 * day).replace(hour=8, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 118, "bp_diastolic": 76,
            "heart_rate": 68, "temperature": 98.2, "spo2": 97,
            "respiratory_rate": 15,
            "notes": "Not fatigue after exercise.",
            "recorded_at": (now - 2 * day).replace(hour=20, minute=0).isoformat(),
        },
        # Day -1 — Yesterday
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 122, "bp_diastolic": 82,
            "heart_rate": 74, "temperature": 98.6, "spo2": 97,
            "respiratory_rate": 16,
            "recorded_at": (now - 1 * day).replace(hour=7, minute=0).isoformat(),
        },
        {
            "patient_id": pid,
            "label": "Evening Check",
            "bp_systolic": 118, "bp_diastolic": 76,
            "heart_rate": 68, "temperature": 98.2, "spo2": 97,
            "respiratory_rate": 15,
            "notes": "Feeling well-rested.",
            "recorded_at": (now - 1 * day).replace(hour=19, minute=15).isoformat(),
        },
        # Day 0 — Today
        {
            "patient_id": pid,
            "label": "Morning Check",
            "bp_systolic": 120, "bp_diastolic": 80,
            "heart_rate": 72, "temperature": 98.4, "spo2": 98,
            "respiratory_rate": 16,
            "notes": "Good hydration today.",
            "recorded_at": now.replace(hour=8, minute=30).isoformat(),
        },
    ]
    sb.table("vital_logs").insert(vitals).execute()

    # ── AI insight ─────────────────────────────────────────────
    insight = {
        "patient_id": pid,
        "summary": (
            "Your blood pressure readings have been consistently within "
            "healthy range this week. The trend shows excellent stability, "
            "suggesting your current lifestyle and medication are well-balanced."
        ),
    }
    sb.table("vital_insights").insert(insight).execute()

    return {
        "status": "ok",
        "message": "Vital logs mock data seeded successfully",
        "patient_id": pid,
    }
