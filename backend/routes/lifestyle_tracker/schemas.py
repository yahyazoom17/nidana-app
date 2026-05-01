from pydantic import BaseModel
from typing import Optional, List


# ── Summary Cards ──────────────────────────────────────────────

class LifestyleSummaryItem(BaseModel):
    metric: str              # "Hydration", "Calorie Goal", "Calories Burned", "Sleep Score"
    display_value: str       # "5/8", "1070/1800", "350", "85"
    unit: str                # "glasses", "kcal", "kcal", "/100"
    progress_pct: Optional[float] = None  # 0–100


# ── Hydration ──────────────────────────────────────────────────

class HydrationLogCreate(BaseModel):
    patient_id: str
    glasses: int = 0
    goal_glasses: int = 8
    ai_tip: Optional[str] = None
    recorded_at: Optional[str] = None


class HydrationLogOut(HydrationLogCreate):
    id: str
    created_at: Optional[str] = None


# ── Sleep Analysis ─────────────────────────────────────────────

class SleepLogCreate(BaseModel):
    patient_id: str
    total_hours: float
    quality_pct: float               # 0–100
    deep_pct: Optional[float] = None
    rem_pct: Optional[float] = None
    light_pct: Optional[float] = None
    bedtime: Optional[str] = None    # e.g. "10:30 PM"
    wake_time: Optional[str] = None  # e.g. "6:00 AM"
    recorded_at: Optional[str] = None


class SleepLogOut(SleepLogCreate):
    id: str
    created_at: Optional[str] = None


# ── Diet Plan ──────────────────────────────────────────────────

class DietMealItem(BaseModel):
    name: str          # "Oatmeal with berries"
    calories: Optional[int] = None


class DietMealCreate(BaseModel):
    patient_id: str
    meal_type: str              # "Breakfast" | "Lunch" | "Snack" | "Dinner"
    scheduled_time: Optional[str] = None   # e.g. "7:00 AM"
    items: List[DietMealItem] = []
    total_calories: int = 0
    is_completed: bool = False
    recorded_at: Optional[str] = None


class DietMealOut(DietMealCreate):
    id: str
    created_at: Optional[str] = None


# ── Exercise Log ──────────────────────────────────────────────

class ExerciseLogCreate(BaseModel):
    patient_id: str
    exercise_name: str          # "Morning Walk", "Yoga Session", etc.
    duration_min: int
    calories_burned: int
    is_completed: bool = False
    recorded_at: Optional[str] = None


class ExerciseLogOut(ExerciseLogCreate):
    id: str
    created_at: Optional[str] = None


# ── Composite Dashboard Response ──────────────────────────────

class LifestyleDashboardOut(BaseModel):
    summary_cards: List[LifestyleSummaryItem] = []
    hydration: Optional[HydrationLogOut] = None
    sleep: Optional[SleepLogOut] = None
    diet_meals: List[DietMealOut] = []
    diet_calorie_total: int = 0
    diet_calorie_goal: int = 1800
    exercises: List[ExerciseLogOut] = []
    exercise_calorie_total: int = 0
