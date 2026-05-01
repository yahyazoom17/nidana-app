-- ============================================================
--  Lifestyle Tracker Tables — Nidana
--  Run this in the Supabase SQL Editor AFTER the main schema
-- ============================================================

-- 1. Hydration Logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hydration_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    glasses         INT NOT NULL DEFAULT 0,
    goal_glasses    INT NOT NULL DEFAULT 8,
    ai_tip          TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hydration_logs_patient_id
    ON public.hydration_logs(patient_id);


-- 2. Sleep Logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    total_hours     NUMERIC(4,2) NOT NULL,
    quality_pct     NUMERIC(5,2) NOT NULL,
    deep_pct        NUMERIC(5,2),
    rem_pct         NUMERIC(5,2),
    light_pct       NUMERIC(5,2),
    bedtime         TEXT,
    wake_time       TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_patient_id
    ON public.sleep_logs(patient_id);


-- 3. Diet Meals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    meal_type       TEXT NOT NULL
                        CHECK (meal_type IN ('Breakfast', 'Lunch', 'Snack', 'Dinner')),
    scheduled_time  TEXT,
    items           JSONB DEFAULT '[]',
    total_calories  INT DEFAULT 0,
    is_completed    BOOLEAN DEFAULT false,
    recorded_at     TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_meals_patient_id
    ON public.diet_meals(patient_id);


-- 4. Exercise Logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercise_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    exercise_name   TEXT NOT NULL,
    duration_min    INT NOT NULL,
    calories_burned INT NOT NULL DEFAULT 0,
    is_completed    BOOLEAN DEFAULT false,
    recorded_at     TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercise_logs_patient_id
    ON public.exercise_logs(patient_id);


-- ============================================================
--  Row Level Security
-- ============================================================
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs  ENABLE ROW LEVEL SECURITY;

-- Hydration Logs
CREATE POLICY "Users can manage own hydration logs"
    ON public.hydration_logs FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Sleep Logs
CREATE POLICY "Users can manage own sleep logs"
    ON public.sleep_logs FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Diet Meals
CREATE POLICY "Users can manage own diet meals"
    ON public.diet_meals FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Exercise Logs
CREATE POLICY "Users can manage own exercise logs"
    ON public.exercise_logs FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );
