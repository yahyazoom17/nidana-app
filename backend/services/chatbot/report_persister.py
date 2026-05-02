"""
Report Data Persister — Nidana

Takes the structured JSON output from `report_extractor.extract_report_data()`
and inserts rows into the appropriate Supabase tables so that the Health
Monitor, Vital Logs, Lifestyle Tracker, and Conversation History pages
automatically display the extracted data.
"""

import json
from datetime import datetime
from typing import Any

from services.supabase import get_supabase_client

MOCK_PATIENT_ID = "00000000-0000-0000-0000-000000000001"


def persist_report_data(
    extracted: dict[str, Any],
    patient_id: str = MOCK_PATIENT_ID,
) -> dict[str, int]:
    """
    Insert extracted report data into Supabase.

    Returns a summary dict: { "health_indicators": N, "vital_logs": N, ... }
    with the count of rows inserted per table.
    """
    sb = get_supabase_client()
    now = datetime.utcnow().isoformat()
    counts: dict[str, int] = {}

    # ── Health Indicators ──────────────────────────────────────────
    indicators = extracted.get("health_indicators") or []
    if indicators:
        rows = [
            {
                "patient_id": patient_id,
                "indicator_name": ind.get("indicator_name", "Unknown"),
                "value": ind.get("value", 0),
                "unit": ind.get("unit", ""),
                "recorded_at": now,
            }
            for ind in indicators
            if ind.get("indicator_name") and ind.get("value") is not None
        ]
        if rows:
            sb.table("health_indicators").insert(rows).execute()
            counts["health_indicators"] = len(rows)

    # ── Vital Logs ─────────────────────────────────────────────────
    vitals = extracted.get("vital_signs") or {}
    has_vitals = any(
        vitals.get(k) is not None
        for k in ("bp_systolic", "bp_diastolic", "heart_rate",
                   "temperature", "spo2", "respiratory_rate")
    )
    if has_vitals:
        row = {
            "patient_id": patient_id,
            "label": "Report Upload",
            "bp_systolic": vitals.get("bp_systolic"),
            "bp_diastolic": vitals.get("bp_diastolic"),
            "heart_rate": vitals.get("heart_rate"),
            "temperature": vitals.get("temperature"),
            "spo2": vitals.get("spo2"),
            "respiratory_rate": vitals.get("respiratory_rate"),
            "notes": vitals.get("notes", "Extracted from uploaded report"),
            "recorded_at": now,
        }
        sb.table("vital_logs").insert(row).execute()
        counts["vital_logs"] = 1

    # ── Prescriptions ──────────────────────────────────────────────
    prescriptions = extracted.get("prescriptions") or []
    if prescriptions:
        rows = [
            {
                "patient_id": patient_id,
                "medication_name": rx.get("medication_name", "Unknown"),
                "dosage": rx.get("dosage", "N/A"),
                "frequency": rx.get("frequency", "As directed"),
                "status": rx.get("status", "upcoming"),
                "adherence_pct": 0,
                "ai_insight": rx.get("ai_insight"),
                "next_dose_time": None,
            }
            for rx in prescriptions
            if rx.get("medication_name")
        ]
        if rows:
            sb.table("prescriptions").insert(rows).execute()
            counts["prescriptions"] = len(rows)

    # ── Lifestyle — Sleep ──────────────────────────────────────────
    lifestyle = extracted.get("lifestyle") or {}
    sleep_hours = lifestyle.get("sleep_hours")
    if sleep_hours is not None:
        sb.table("sleep_logs").insert({
            "patient_id": patient_id,
            "total_hours": sleep_hours,
            "quality_pct": lifestyle.get("sleep_quality_pct") or 75,
            "recorded_at": now,
        }).execute()
        counts["sleep_logs"] = 1

    # ── Lifestyle — Hydration ──────────────────────────────────────
    water = lifestyle.get("water_glasses")
    if water is not None:
        sb.table("hydration_logs").insert({
            "patient_id": patient_id,
            "glasses": int(water),
            "goal_glasses": 8,
            "ai_tip": "Extracted from uploaded report.",
            "recorded_at": now,
        }).execute()
        counts["hydration_logs"] = 1

    # ── Lifestyle — Exercise ───────────────────────────────────────
    exercises = lifestyle.get("exercise_recommendations") or []
    if exercises:
        rows = [
            {
                "patient_id": patient_id,
                "exercise_name": ex.get("exercise_name", "Exercise"),
                "duration_min": ex.get("duration_min", 30),
                "calories_burned": ex.get("calories_burned", 0),
                "is_completed": False,
                "recorded_at": now,
            }
            for ex in exercises
            if ex.get("exercise_name")
        ]
        if rows:
            sb.table("exercise_logs").insert(rows).execute()
            counts["exercise_logs"] = len(rows)

    # ── Lifestyle — Diet ───────────────────────────────────────────
    diet_recs = lifestyle.get("diet_recommendations") or []
    if diet_recs:
        rows = []
        for meal in diet_recs:
            items = meal.get("items") or []
            rows.append({
                "patient_id": patient_id,
                "meal_type": meal.get("meal_type", "Snack"),
                "scheduled_time": None,
                "items": json.dumps(items),
                "total_calories": meal.get("total_calories", 0),
                "is_completed": False,
                "recorded_at": now,
            })
        if rows:
            sb.table("diet_meals").insert(rows).execute()
            counts["diet_meals"] = len(rows)

    # ── AI Trends ──────────────────────────────────────────────────
    trends = extracted.get("ai_trends") or []
    if trends:
        rows = [
            {
                "patient_id": patient_id,
                "trend_title": t.get("trend_title", "Report Insight"),
                "trend_summary": t.get("trend_summary", ""),
                "category": t.get("category", "general"),
            }
            for t in trends
            if t.get("trend_summary")
        ]
        if rows:
            sb.table("ai_trends").insert(rows).execute()
            counts["ai_trends"] = len(rows)

    # ── Vital Insight (AI summary) ─────────────────────────────────
    report_summary = extracted.get("report_summary")
    if report_summary:
        sb.table("vital_insights").insert({
            "patient_id": patient_id,
            "summary": report_summary,
        }).execute()
        counts["vital_insights"] = 1

    return counts


def save_report_conversation(
    file_name: str,
    report_text: str,
    ai_response: str,
    patient_id: str = MOCK_PATIENT_ID,
) -> str | None:
    """
    Create a conversation record with the upload interaction so it
    appears on the Conversation History page.

    Returns the conversation ID or None on failure.
    """
    sb = get_supabase_client()
    now = datetime.utcnow().isoformat()

    try:
        # Truncate report_text for the summary
        snippet = report_text[:200] + "..." if len(report_text) > 200 else report_text

        conv_result = sb.table("conversations").insert({
            "patient_id": patient_id,
            "title": f"Report Upload: {file_name}",
            "summary": ai_response[:300] if ai_response else "Medical report uploaded for analysis.",
            "tags": ["Report", "Upload"],
            "message_count": 2,
            "last_message_at": now,
        }).execute()

        if not conv_result.data:
            return None

        conv_id = conv_result.data[0]["id"]

        # Insert the user message (file upload) and AI response
        messages = [
            {
                "conversation_id": conv_id,
                "role": "user",
                "content": f"[Uploaded report: {file_name}]\n\nExtracted text:\n{snippet}",
                "created_at": now,
            },
            {
                "conversation_id": conv_id,
                "role": "ai",
                "content": ai_response or "Report analyzed successfully.",
                "created_at": now,
            },
        ]
        sb.table("conversation_messages").insert(messages).execute()

        return conv_id

    except Exception as exc:
        print(f"[report_persister] Failed to save conversation: {exc}")
        return None
