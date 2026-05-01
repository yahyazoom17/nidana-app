from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Single Vital Log Entry ─────────────────────────────────────

class VitalLogCreate(BaseModel):
    patient_id: str
    label: str = "Morning Check"      # "Morning Check" | "Evening Check" | custom
    bp_systolic: Optional[int] = None          # e.g. 120
    bp_diastolic: Optional[int] = None         # e.g. 80
    heart_rate: Optional[int] = None           # bpm
    temperature: Optional[float] = None        # °F
    spo2: Optional[float] = None               # %
    respiratory_rate: Optional[int] = None     # bpm
    notes: Optional[str] = None                # free-text patient note
    recorded_at: Optional[str] = None          # ISO 8601


class VitalLogOut(VitalLogCreate):
    id: str
    created_at: Optional[str] = None


# ── Summary Card (latest reading + % change) ──────────────────

class VitalSummaryItem(BaseModel):
    metric: str              # "Blood Pressure", "Temperature", etc.
    display_value: str       # "120/80", "98.4", "98", "16"
    unit: str                # "mmHg", "°F", "%", "bpm"
    change_pct: Optional[float] = None  # e.g. +2.0  or -1.5


# ── 7-Day Trend Data Point ────────────────────────────────────

class TrendPoint(BaseModel):
    date: str                # ISO date or day label ("Mon", "Tue" …)
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None


# ── AI Insight ─────────────────────────────────────────────────

class AIInsight(BaseModel):
    summary: str
    generated_at: Optional[str] = None


# ── Composite Dashboard Response ──────────────────────────────

class VitalLogsDashboardOut(BaseModel):
    summary_cards: List[VitalSummaryItem] = []
    trend_7day: List[TrendPoint] = []
    ai_insight: Optional[AIInsight] = None
    recent_logs: List[VitalLogOut] = []
