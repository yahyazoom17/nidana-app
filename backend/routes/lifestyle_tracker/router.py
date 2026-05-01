"""
Lifestyle Tracker routes — Nidana
Provides CRUD endpoints for hydration, sleep, diet plan, and
exercise logs.  Includes a composite dashboard endpoint and a
seed route for populating mock data.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import json

from services.supabase import get_supabase_client
from routes.lifestyle_tracker.schemas import (
    LifestyleSummaryItem,
    HydrationLogCreate,
    HydrationLogOut,
    SleepLogCreate,
    SleepLogOut,
    DietMealCreate,
    DietMealOut,
    DietMealItem,
    ExerciseLogCreate,
    ExerciseLogOut,
    LifestyleDashboardOut,
)

lifestyle_tracker_router = APIRouter(
    prefix="/api/lifestyle-tracker",
    tags=["lifestyle-tracker"],
)


# ── helpers ────────────────────────────────────────────────────

def _supabase():
    return get_supabase_client()


def _today_iso():
    return datetime.utcnow().date().isoformat()


# ================================================================
#  Dashboard (composite)
# ================================================================

@lifestyle_tracker_router.get("/dashboard/{patient_id}")
def get_lifestyle_dashboard(patient_id: str):
    """Return everything the Lifestyle Tracker page needs."""
    sb = _supabase()
    today = _today_iso()

    # ── hydration (today's latest) ─────────────────────────────
    hydration_q = (
        sb.table("hydration_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .gte("recorded_at", today)
        .order("recorded_at", desc=True)
        .limit(1)
        .execute()
    )
    hydration = hydration_q.data[0] if hydration_q.data else None

    # ── sleep (last night) ─────────────────────────────────────
    sleep_q = (
        sb.table("sleep_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(1)
        .execute()
    )
    sleep = sleep_q.data[0] if sleep_q.data else None

    # ── diet meals (today) ─────────────────────────────────────
    diet_q = (
        sb.table("diet_meals")
        .select("*")
        .eq("patient_id", patient_id)
        .gte("recorded_at", today)
        .order("scheduled_time", desc=False)
        .execute()
    )
    diet_meals = diet_q.data or []
    # Parse items JSON string back into list if stored as string
    for m in diet_meals:
        if isinstance(m.get("items"), str):
            m["items"] = json.loads(m["items"])
    diet_calorie_total = sum(m.get("total_calories", 0) for m in diet_meals)
    diet_calorie_goal = 1800

    # ── exercises (today) ──────────────────────────────────────
    exercise_q = (
        sb.table("exercise_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .gte("recorded_at", today)
        .order("recorded_at", desc=False)
        .execute()
    )
    exercises = exercise_q.data or []
    exercise_calorie_total = sum(
        e.get("calories_burned", 0) for e in exercises if e.get("is_completed")
    )

    # ── summary cards ──────────────────────────────────────────
    h_glasses = hydration.get("glasses", 0) if hydration else 0
    h_goal = hydration.get("goal_glasses", 8) if hydration else 8
    sleep_score = int(sleep.get("quality_pct", 0)) if sleep else 0

    summary_cards = [
        LifestyleSummaryItem(
            metric="Hydration",
            display_value=f"{h_glasses}/{h_goal}",
            unit="glasses",
            progress_pct=round(h_glasses / h_goal * 100, 1) if h_goal else 0,
        ),
        LifestyleSummaryItem(
            metric="Calorie Goal",
            display_value=f"{diet_calorie_total}/{diet_calorie_goal}",
            unit="kcal",
            progress_pct=round(diet_calorie_total / diet_calorie_goal * 100, 1),
        ),
        LifestyleSummaryItem(
            metric="Calories Burned",
            display_value=str(exercise_calorie_total),
            unit="kcal",
            progress_pct=None,
        ),
        LifestyleSummaryItem(
            metric="Sleep Score",
            display_value=str(sleep_score),
            unit="/100",
            progress_pct=float(sleep_score),
        ),
    ]

    return LifestyleDashboardOut(
        summary_cards=summary_cards,
        hydration=hydration,
        sleep=sleep,
        diet_meals=diet_meals,
        diet_calorie_total=diet_calorie_total,
        diet_calorie_goal=diet_calorie_goal,
        exercises=exercises,
        exercise_calorie_total=exercise_calorie_total,
    )


# ================================================================
#  Hydration Logs
# ================================================================

@lifestyle_tracker_router.get("/hydration/{patient_id}")
def list_hydration(patient_id: str, limit: int = 30):
    data = (
        _supabase()
        .table("hydration_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@lifestyle_tracker_router.post("/hydration")
def create_hydration(payload: HydrationLogCreate):
    row = payload.model_dump()
    if not row.get("recorded_at"):
        row["recorded_at"] = datetime.utcnow().isoformat()
    result = _supabase().table("hydration_logs").insert(row).execute()
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.put("/hydration/{log_id}")
def update_hydration(log_id: str, payload: HydrationLogCreate):
    result = (
        _supabase()
        .table("hydration_logs")
        .update(payload.model_dump())
        .eq("id", log_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Hydration log not found")
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.delete("/hydration/{log_id}")
def delete_hydration(log_id: str):
    _supabase().table("hydration_logs").delete().eq("id", log_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Sleep Logs
# ================================================================

@lifestyle_tracker_router.get("/sleep/{patient_id}")
def list_sleep(patient_id: str, limit: int = 30):
    data = (
        _supabase()
        .table("sleep_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@lifestyle_tracker_router.post("/sleep")
def create_sleep(payload: SleepLogCreate):
    row = payload.model_dump()
    if not row.get("recorded_at"):
        row["recorded_at"] = datetime.utcnow().isoformat()
    result = _supabase().table("sleep_logs").insert(row).execute()
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.put("/sleep/{log_id}")
def update_sleep(log_id: str, payload: SleepLogCreate):
    result = (
        _supabase()
        .table("sleep_logs")
        .update(payload.model_dump())
        .eq("id", log_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Sleep log not found")
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.delete("/sleep/{log_id}")
def delete_sleep(log_id: str):
    _supabase().table("sleep_logs").delete().eq("id", log_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Diet Meals
# ================================================================

@lifestyle_tracker_router.get("/diet/{patient_id}")
def list_diet_meals(patient_id: str, limit: int = 30):
    data = (
        _supabase()
        .table("diet_meals")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    meals = data.data or []
    for m in meals:
        if isinstance(m.get("items"), str):
            m["items"] = json.loads(m["items"])
    return {"status": "ok", "data": meals}


@lifestyle_tracker_router.post("/diet")
def create_diet_meal(payload: DietMealCreate):
    row = payload.model_dump()
    # Serialize items list to JSON string for JSONB storage
    row["items"] = json.dumps([i.dict() if hasattr(i, "dict") else i for i in row["items"]])
    if not row.get("recorded_at"):
        row["recorded_at"] = datetime.utcnow().isoformat()
    result = _supabase().table("diet_meals").insert(row).execute()
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.put("/diet/{meal_id}")
def update_diet_meal(meal_id: str, payload: DietMealCreate):
    row = payload.model_dump()
    row["items"] = json.dumps([i.dict() if hasattr(i, "dict") else i for i in row["items"]])
    result = (
        _supabase()
        .table("diet_meals")
        .update(row)
        .eq("id", meal_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Diet meal not found")
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.delete("/diet/{meal_id}")
def delete_diet_meal(meal_id: str):
    _supabase().table("diet_meals").delete().eq("id", meal_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Exercise Logs
# ================================================================

@lifestyle_tracker_router.get("/exercises/{patient_id}")
def list_exercises(patient_id: str, limit: int = 30):
    data = (
        _supabase()
        .table("exercise_logs")
        .select("*")
        .eq("patient_id", patient_id)
        .order("recorded_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@lifestyle_tracker_router.post("/exercises")
def create_exercise(payload: ExerciseLogCreate):
    row = payload.model_dump()
    if not row.get("recorded_at"):
        row["recorded_at"] = datetime.utcnow().isoformat()
    result = _supabase().table("exercise_logs").insert(row).execute()
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.put("/exercises/{exercise_id}")
def update_exercise(exercise_id: str, payload: ExerciseLogCreate):
    result = (
        _supabase()
        .table("exercise_logs")
        .update(payload.model_dump())
        .eq("id", exercise_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Exercise log not found")
    return {"status": "ok", "data": result.data}


@lifestyle_tracker_router.delete("/exercises/{exercise_id}")
def delete_exercise(exercise_id: str):
    _supabase().table("exercise_logs").delete().eq("id", exercise_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Seed Mock Data
# ================================================================

MOCK_PATIENT_ID = "00000000-0000-0000-0000-000000000001"


@lifestyle_tracker_router.post("/seed")
def seed_mock_lifestyle_data():
    """
    Populate the database with realistic mock lifestyle data
    matching the Lifestyle Tracker UI.  Idempotent.
    """
    sb = _supabase()
    pid = MOCK_PATIENT_ID
    now = datetime.utcnow()
    today = now.date().isoformat()

    # ── clean previous seeds ───────────────────────────────────
    for table in ("hydration_logs", "sleep_logs", "diet_meals", "exercise_logs"):
        sb.table(table).delete().eq("patient_id", pid).execute()

    # ── hydration ──────────────────────────────────────────────
    sb.table("hydration_logs").insert({
        "patient_id": pid,
        "glasses": 5,
        "goal_glasses": 8,
        "ai_tip": (
            "You tend to drink less water after 4 PM. "
            "Set a reminder to stay hydrated through the evening."
        ),
        "recorded_at": now.isoformat(),
    }).execute()

    # ── sleep ──────────────────────────────────────────────────
    sb.table("sleep_logs").insert({
        "patient_id": pid,
        "total_hours": 7.5,
        "quality_pct": 85,
        "deep_pct": 25,
        "rem_pct": 22,
        "light_pct": 53,
        "bedtime": "10:30 PM",
        "wake_time": "6:00 AM",
        "recorded_at": (now - timedelta(hours=8)).isoformat(),
    }).execute()

    # ── diet plan ──────────────────────────────────────────────
    meals = [
        {
            "patient_id": pid,
            "meal_type": "Breakfast",
            "scheduled_time": "7:00 AM",
            "items": json.dumps([
                {"name": "Oatmeal with berries", "calories": 180},
                {"name": "Green tea", "calories": 5},
                {"name": "Almonds (10)", "calories": 70},
            ]),
            "total_calories": 400,
            "is_completed": True,
            "recorded_at": today + "T07:00:00",
        },
        {
            "patient_id": pid,
            "meal_type": "Lunch",
            "scheduled_time": "12:00 PM",
            "items": json.dumps([
                {"name": "Grilled chicken salad", "calories": 250},
                {"name": "Brown rice", "calories": 130},
                {"name": "Lentil soup", "calories": 100},
            ]),
            "total_calories": 480,
            "is_completed": True,
            "recorded_at": today + "T12:00:00",
        },
        {
            "patient_id": pid,
            "meal_type": "Snack",
            "scheduled_time": "3:00 PM",
            "items": json.dumps([
                {"name": "Greek yogurt", "calories": 100},
                {"name": "Mixed nuts", "calories": 60},
                {"name": "Apple slices", "calories": 40},
            ]),
            "total_calories": 200,
            "is_completed": False,
            "recorded_at": today + "T15:00:00",
        },
        {
            "patient_id": pid,
            "meal_type": "Dinner",
            "scheduled_time": "6:00 PM",
            "items": json.dumps([
                {"name": "Baked salmon", "calories": 280},
                {"name": "Roasted veggies", "calories": 120},
                {"name": "Quinoa", "calories": 140},
            ]),
            "total_calories": 540,
            "is_completed": False,
            "recorded_at": today + "T18:00:00",
        },
    ]
    sb.table("diet_meals").insert(meals).execute()

    # ── exercises ──────────────────────────────────────────────
    exercises = [
        {
            "patient_id": pid,
            "exercise_name": "Morning Walk",
            "duration_min": 30,
            "calories_burned": 180,
            "is_completed": True,
            "recorded_at": today + "T06:30:00",
        },
        {
            "patient_id": pid,
            "exercise_name": "Yoga Session",
            "duration_min": 45,
            "calories_burned": 200,
            "is_completed": True,
            "recorded_at": today + "T09:00:00",
        },
        {
            "patient_id": pid,
            "exercise_name": "Strength Training",
            "duration_min": 40,
            "calories_burned": 300,
            "is_completed": False,
            "recorded_at": today + "T17:00:00",
        },
    ]
    sb.table("exercise_logs").insert(exercises).execute()

    return {
        "status": "ok",
        "message": "Lifestyle tracker mock data seeded successfully",
        "patient_id": pid,
    }
