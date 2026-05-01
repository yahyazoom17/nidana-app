-- ============================================================
--  Health Monitor Tables — Nidana
--  Run this in the Supabase SQL Editor AFTER the main schema
-- ============================================================

-- 1. Prescriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage          TEXT NOT NULL,
    frequency       TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'upcoming'
                        CHECK (status IN ('upcoming', 'completed', 'scheduled')),
    adherence_pct   NUMERIC(5,2) DEFAULT 0,
    ai_insight      TEXT,
    next_dose_time  TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id
    ON public.prescriptions(patient_id);


-- 2. Health Indicators
-- ============================================================
CREATE TABLE IF NOT EXISTS public.health_indicators (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    indicator_name  TEXT NOT NULL,
    value           NUMERIC NOT NULL,
    unit            TEXT NOT NULL,
    recorded_at     TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_indicators_patient_id
    ON public.health_indicators(patient_id);


-- 3. AI Trends
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_trends (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    trend_title     TEXT NOT NULL,
    trend_summary   TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'general'
                        CHECK (category IN ('glycemic', 'recovery', 'general')),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_trends_patient_id
    ON public.ai_trends(patient_id);


-- 4. Consultations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.consultations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_name     TEXT NOT NULL,
    specialty       TEXT NOT NULL,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    label           TEXT DEFAULT 'upcoming',
    join_url        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient_id
    ON public.consultations(patient_id);


-- ============================================================
--  Row Level Security
-- ============================================================
ALTER TABLE public.prescriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_indicators  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_trends          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations      ENABLE ROW LEVEL SECURITY;

-- Prescriptions
CREATE POLICY "Users can manage own prescriptions"
    ON public.prescriptions FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Health Indicators
CREATE POLICY "Users can manage own health indicators"
    ON public.health_indicators FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- AI Trends
CREATE POLICY "Users can manage own AI trends"
    ON public.ai_trends FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Consultations
CREATE POLICY "Users can manage own consultations"
    ON public.consultations FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );


-- ============================================================
--  updated_at triggers (for prescriptions)
-- ============================================================
CREATE TRIGGER set_prescriptions_updated_at
    BEFORE UPDATE ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
