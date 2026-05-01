-- ============================================================
--  Vital Logs Tables — Nidana
--  Run this in the Supabase SQL Editor AFTER the main schema
-- ============================================================

-- 1. Vital Logs (individual readings)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vital_logs (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id        UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    label             TEXT NOT NULL DEFAULT 'Morning Check',
    bp_systolic       INT,
    bp_diastolic      INT,
    heart_rate        INT,
    temperature       NUMERIC(5,2),
    spo2              NUMERIC(5,2),
    respiratory_rate  INT,
    notes             TEXT,
    recorded_at       TIMESTAMPTZ DEFAULT now(),
    created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vital_logs_patient_id
    ON public.vital_logs(patient_id);

CREATE INDEX IF NOT EXISTS idx_vital_logs_recorded_at
    ON public.vital_logs(recorded_at);


-- 2. Vital Insights (AI-generated summaries)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vital_insights (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id  UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    summary     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vital_insights_patient_id
    ON public.vital_insights(patient_id);


-- ============================================================
--  Row Level Security
-- ============================================================
ALTER TABLE public.vital_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_insights ENABLE ROW LEVEL SECURITY;

-- Vital Logs
CREATE POLICY "Users can manage own vital logs"
    ON public.vital_logs FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Vital Insights
CREATE POLICY "Users can manage own vital insights"
    ON public.vital_insights FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );
