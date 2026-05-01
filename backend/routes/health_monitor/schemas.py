from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Prescriptions ──────────────────────────────────────────────

class PrescriptionCreate(BaseModel):
    patient_id: str
    medication_name: str
    dosage: str
    frequency: str
    status: str = "upcoming"  # upcoming | completed | scheduled
    adherence_pct: float = 0.0
    ai_insight: Optional[str] = None
    next_dose_time: Optional[str] = None


class PrescriptionOut(PrescriptionCreate):
    id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ── Health Indicators ──────────────────────────────────────────

class HealthIndicatorCreate(BaseModel):
    patient_id: str
    indicator_name: str       # e.g. "Blood Sugar", "Sleep Quality"
    value: float
    unit: str                 # e.g. "mg/dL", "%"
    recorded_at: Optional[str] = None


class HealthIndicatorOut(HealthIndicatorCreate):
    id: str
    created_at: Optional[str] = None


# ── AI Trend Analysis ─────────────────────────────────────────

class AITrendCreate(BaseModel):
    patient_id: str
    trend_title: str
    trend_summary: str
    category: str = "general"  # glycemic | recovery | general


class AITrendOut(AITrendCreate):
    id: str
    created_at: Optional[str] = None


# ── Upcoming Consultations ────────────────────────────────────

class ConsultationCreate(BaseModel):
    patient_id: str
    doctor_name: str
    specialty: str
    scheduled_at: str          # ISO 8601 datetime string
    label: str = "upcoming"    # "tomorrow", "upcoming", "today"
    join_url: Optional[str] = None


class ConsultationOut(ConsultationCreate):
    id: str
    created_at: Optional[str] = None


# ── Composite Dashboard Response ──────────────────────────────

class HealthDashboardOut(BaseModel):
    prescriptions: List[PrescriptionOut] = []
    health_indicators: List[HealthIndicatorOut] = []
    ai_trends: List[AITrendOut] = []
    consultations: List[ConsultationOut] = []
    last_synced: Optional[str] = None
