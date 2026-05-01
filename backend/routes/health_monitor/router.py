"""
Health Monitor routes — Nidana
Provides CRUD endpoints for prescriptions, health indicators,
AI trend analysis, and consultations.  Includes a combined
dashboard endpoint and a seed route for populating mock data.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta

from services.supabase import get_supabase_client
from routes.health_monitor.schemas import (
    PrescriptionCreate,
    PrescriptionOut,
    HealthIndicatorCreate,
    HealthIndicatorOut,
    AITrendCreate,
    AITrendOut,
    ConsultationCreate,
    ConsultationOut,
    HealthDashboardOut,
)

health_monitor_router = APIRouter(
    prefix="/api/health-monitor",
    tags=["health-monitor"],
)


# ── helpers ────────────────────────────────────────────────────

def _supabase():
    return get_supabase_client()


# ================================================================
#  Dashboard (composite)
# ================================================================

@health_monitor_router.get("/dashboard/{patient_id}")
def get_dashboard(patient_id: str):
    """Return everything the Health Sanctuary page needs in one call."""
    sb = _supabase()

    prescriptions = (
        sb.table("prescriptions")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )

    indicators = (
        sb.table("health_indicators")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .execute()
    )

    trends = (
        sb.table("ai_trends")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )

    consultations = (
        sb.table("consultations")
        .select("*")
        .eq("patient_id", patient_id)
        .order("scheduled_at", desc=True)
        .execute()
    )

    return HealthDashboardOut(
        prescriptions=prescriptions.data,
        health_indicators=indicators.data,
        ai_trends=trends.data,
        consultations=consultations.data,
        last_synced=datetime.utcnow().isoformat(),
    )


# ================================================================
#  Prescriptions
# ================================================================

@health_monitor_router.get("/prescriptions/{patient_id}")
def list_prescriptions(patient_id: str):
    data = (
        _supabase()
        .table("prescriptions")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@health_monitor_router.post("/prescriptions")
def create_prescription(payload: PrescriptionCreate):
    result = (
        _supabase()
        .table("prescriptions")
        .insert(payload.model_dump())
        .execute()
    )
    return {"status": "ok", "data": result.data}


@health_monitor_router.put("/prescriptions/{prescription_id}")
def update_prescription(prescription_id: str, payload: PrescriptionCreate):
    result = (
        _supabase()
        .table("prescriptions")
        .update(payload.model_dump())
        .eq("id", prescription_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return {"status": "ok", "data": result.data}


@health_monitor_router.delete("/prescriptions/{prescription_id}")
def delete_prescription(prescription_id: str):
    result = (
        _supabase()
        .table("prescriptions")
        .delete()
        .eq("id", prescription_id)
        .execute()
    )
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Health Indicators
# ================================================================

@health_monitor_router.get("/indicators/{patient_id}")
def list_indicators(patient_id: str):
    data = (
        _supabase()
        .table("health_indicators")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@health_monitor_router.post("/indicators")
def create_indicator(payload: HealthIndicatorCreate):
    result = (
        _supabase()
        .table("health_indicators")
        .insert(payload.model_dump())
        .execute()
    )
    return {"status": "ok", "data": result.data}


@health_monitor_router.delete("/indicators/{indicator_id}")
def delete_indicator(indicator_id: str):
    _supabase().table("health_indicators").delete().eq("id", indicator_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  AI Trends
# ================================================================

@health_monitor_router.get("/trends/{patient_id}")
def list_trends(patient_id: str):
    data = (
        _supabase()
        .table("ai_trends")
        .select("*")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@health_monitor_router.post("/trends")
def create_trend(payload: AITrendCreate):
    result = (
        _supabase()
        .table("ai_trends")
        .insert(payload.model_dump())
        .execute()
    )
    return {"status": "ok", "data": result.data}


@health_monitor_router.delete("/trends/{trend_id}")
def delete_trend(trend_id: str):
    _supabase().table("ai_trends").delete().eq("id", trend_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Consultations
# ================================================================

@health_monitor_router.get("/consultations/{patient_id}")
def list_consultations(patient_id: str):
    data = (
        _supabase()
        .table("consultations")
        .select("*")
        .eq("patient_id", patient_id)
        .order("scheduled_at", desc=True)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@health_monitor_router.post("/consultations")
def create_consultation(payload: ConsultationCreate):
    result = (
        _supabase()
        .table("consultations")
        .insert(payload.model_dump())
        .execute()
    )
    return {"status": "ok", "data": result.data}


@health_monitor_router.delete("/consultations/{consultation_id}")
def delete_consultation(consultation_id: str):
    _supabase().table("consultations").delete().eq("id", consultation_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Seed Mock Data
# ================================================================

MOCK_PATIENT_ID = "00000000-0000-0000-0000-000000000001"

@health_monitor_router.post("/seed")
def seed_mock_data():
    """
    Populate the database with realistic mock data that matches
    the Health Sanctuary UI.  Safe to call multiple times — it
    deletes existing mock rows first.
    """
    sb = _supabase()
    pid = MOCK_PATIENT_ID

    # ── clean previous seeds ───────────────────────────────────
    for table in ("prescriptions", "health_indicators", "ai_trends", "consultations"):
        sb.table(table).delete().eq("patient_id", pid).execute()

    now = datetime.utcnow()

    # ── prescriptions ──────────────────────────────────────────
    prescriptions = [
        {
            "patient_id": pid,
            "medication_name": "Metformin",
            "dosage": "500 mg",
            "frequency": "Twice daily",
            "status": "upcoming",
            "adherence_pct": 96,
            "ai_insight": "Optimized for post-meal absorption.",
            "next_dose_time": "Next: 08:00 PM",
        },
        {
            "patient_id": pid,
            "medication_name": "Atorvastatin",
            "dosage": "20 mg",
            "frequency": "Once daily",
            "status": "completed",
            "adherence_pct": 98,
            "ai_insight": "Evening dose recommended for efficacy.",
            "next_dose_time": "Next: Taken",
        },
        {
            "patient_id": pid,
            "medication_name": "Vitamin D3",
            "dosage": "2000 IU",
            "frequency": "Daily",
            "status": "scheduled",
            "adherence_pct": 98,
            "ai_insight": "Paired with morning light for synergy.",
            "next_dose_time": "Next: 08:00 AM",
        },
    ]
    sb.table("prescriptions").insert(prescriptions).execute()

    # ── health indicators ──────────────────────────────────────
    indicators = [
        {
            "patient_id": pid,
            "indicator_name": "Blood Sugar",
            "value": 98,
            "unit": "mg/dL",
            "recorded_at": now.isoformat(),
        },
        {
            "patient_id": pid,
            "indicator_name": "Sleep Quality",
            "value": 88,
            "unit": "%",
            "recorded_at": now.isoformat(),
        },
    ]
    sb.table("health_indicators").insert(indicators).execute()

    # ── AI trends ──────────────────────────────────────────────
    trends = [
        {
            "patient_id": pid,
            "trend_title": "Glycemic Stability",
            "trend_summary": (
                "Your glucose levels have stabilized by 12% since the "
                "AI-optimized Metformin schedule started."
            ),
            "category": "glycemic",
        },
        {
            "patient_id": pid,
            "trend_title": "Recovery Efficiency",
            "trend_summary": (
                "Sleep quality correlation suggests that Vitamin D3 intake "
                "in the morning is improving REM cycles."
            ),
            "category": "recovery",
        },
    ]
    sb.table("ai_trends").insert(trends).execute()

    # ── consultations ─────────────────────────────────────────
    tomorrow = (now + timedelta(days=1)).replace(hour=10, minute=30)
    consultations = [
        {
            "patient_id": pid,
            "doctor_name": "Dr. Emily Watson",
            "specialty": "Endocrinology",
            "scheduled_at": tomorrow.isoformat(),
            "label": "Tomorrow",
            "join_url": "https://meet.nidana.health/dr-watson",
        },
    ]
    sb.table("consultations").insert(consultations).execute()

    return {
        "status": "ok",
        "message": "Mock data seeded successfully",
        "patient_id": pid,
    }
