-- ============================================================
--  Nidana — Supabase Database Schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 0. Enable required extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- 1. Profiles (extends Supabase Auth users)
-- ============================================================
CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Patients
-- ============================================================
CREATE TABLE public.patients (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    age         INT,
    gender      TEXT CHECK (gender IN ('male', 'female', 'other')),
    blood_group TEXT,
    allergies   TEXT[],
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_patients_user_id ON public.patients(user_id);


-- 3. Chat Sessions
-- ============================================================
CREATE TABLE public.chat_sessions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id  UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    title       TEXT NOT NULL DEFAULT 'New Conversation',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);


-- 4. Chat Messages
-- ============================================================
CREATE TABLE public.chat_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK (role IN ('user', 'ai')),
    content     TEXT NOT NULL,
    metadata    JSONB DEFAULT '{}',        -- store token count, model info, etc.
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);


-- 5. Medical Reports (uploaded PDFs / images)
-- ============================================================
CREATE TABLE public.medical_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id      UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    session_id      UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
    file_name       TEXT NOT NULL,
    file_type       TEXT NOT NULL,               -- 'application/pdf', 'image/png', etc.
    storage_path    TEXT NOT NULL,                -- path in Supabase Storage bucket
    extracted_text  TEXT,                         -- OCR output from pytesseract
    analysis        TEXT,                         -- AI analysis result
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_medical_reports_user_id ON public.medical_reports(user_id);


-- ============================================================
--  Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update only their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Patients: full CRUD on own patients
CREATE POLICY "Users can manage own patients"
    ON public.patients FOR ALL
    USING (auth.uid() = user_id);

-- Chat Sessions: full CRUD on own sessions
CREATE POLICY "Users can manage own chat sessions"
    ON public.chat_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Chat Messages: users can access messages in their own sessions
CREATE POLICY "Users can manage own chat messages"
    ON public.chat_messages FOR ALL
    USING (
        session_id IN (
            SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
        )
    );

-- Medical Reports: full CRUD on own reports
CREATE POLICY "Users can manage own medical reports"
    ON public.medical_reports FOR ALL
    USING (auth.uid() = user_id);


-- ============================================================
--  Storage Bucket for medical files
-- ============================================================
-- Run these separately if the SQL editor doesn't support storage API:
--   1. Go to Dashboard → Storage → New Bucket
--   2. Name: "medical-files", set to private
--
-- Or use the SQL below:
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-files', 'medical-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload/read/delete their own files
CREATE POLICY "Users can upload own medical files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'medical-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own medical files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'medical-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own medical files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'medical-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- ============================================================
--  updated_at auto-refresh trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
