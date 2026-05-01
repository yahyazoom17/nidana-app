from pydantic import BaseModel
from typing import Optional, List


# ── Single Message inside a Conversation ───────────────────────

class ConversationMessageCreate(BaseModel):
    conversation_id: str
    role: str = "user"         # "user" | "ai"
    content: str
    metadata: Optional[dict] = None


class ConversationMessageOut(ConversationMessageCreate):
    id: str
    created_at: Optional[str] = None


# ── Conversation (session header) ─────────────────────────────

class ConversationCreate(BaseModel):
    patient_id: str
    title: str
    summary: Optional[str] = None
    tags: List[str] = []       # ["Symptoms", "Medication", …]


class ConversationOut(ConversationCreate):
    id: str
    message_count: int = 0
    last_message_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ── Conversation Detail (header + messages) ───────────────────

class ConversationDetailOut(ConversationOut):
    messages: List[ConversationMessageOut] = []


# ── List Page Response ────────────────────────────────────────

class ConversationListOut(BaseModel):
    conversations: List[ConversationOut] = []
    total: int = 0
