-- ============================================================
--  Conversation History Tables — Nidana
--  Run this in the Supabase SQL Editor AFTER the main schema
-- ============================================================

-- 1. Conversations (session headers)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    summary         TEXT,
    tags            TEXT[] DEFAULT '{}',
    message_count   INT DEFAULT 0,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_patient_id
    ON public.conversations(patient_id);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
    ON public.conversations(last_message_at);


-- 2. Conversation Messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'ai')),
    content         TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conv_id
    ON public.conversation_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at
    ON public.conversation_messages(created_at);


-- ============================================================
--  Row Level Security
-- ============================================================
ALTER TABLE public.conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages  ENABLE ROW LEVEL SECURITY;

-- Conversations: users can manage conversations for their own patients
CREATE POLICY "Users can manage own conversations"
    ON public.conversations FOR ALL
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

-- Conversation Messages: users can manage messages in their own conversations
CREATE POLICY "Users can manage own conversation messages"
    ON public.conversation_messages FOR ALL
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations
            WHERE patient_id IN (
                SELECT id FROM public.patients WHERE user_id = auth.uid()
            )
        )
    );


-- ============================================================
--  updated_at trigger for conversations
-- ============================================================
CREATE TRIGGER set_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
