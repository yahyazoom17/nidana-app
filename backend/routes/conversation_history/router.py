"""
Conversation History routes — Nidana
Provides endpoints to list, search, view, create, and delete
past AI consultation conversations.  Includes a seed route
for populating mock data.
"""

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
from typing import Optional

from services.supabase import get_supabase_client
from routes.conversation_history.schemas import (
    ConversationCreate,
    ConversationOut,
    ConversationDetailOut,
    ConversationMessageCreate,
    ConversationMessageOut,
    ConversationListOut,
)

conversation_history_router = APIRouter(
    prefix="/api/conversation-history",
    tags=["conversation-history"],
)


# ── helpers ────────────────────────────────────────────────────

def _supabase():
    return get_supabase_client()


# ================================================================
#  List & Search Conversations
# ================================================================

@conversation_history_router.get("/conversations/{patient_id}")
def list_conversations(
    patient_id: str,
    search: Optional[str] = Query(None, description="Search by title or summary"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    limit: int = 50,
    offset: int = 0,
):
    """
    Return a paginated list of conversations for a patient.
    Supports optional keyword search and tag filtering.
    """
    sb = _supabase()

    query = (
        sb.table("conversations")
        .select("*")
        .eq("patient_id", patient_id)
        .order("last_message_at", desc=True)
    )

    if search:
        # Supabase ilike for case-insensitive partial match
        query = query.or_(f"title.ilike.%{search}%,summary.ilike.%{search}%")

    if tag:
        # tags is a text[] column — use contains
        query = query.contains("tags", [tag])

    data = query.range(offset, offset + limit - 1).execute()

    # Get total count
    count_q = (
        sb.table("conversations")
        .select("id", count="exact")
        .eq("patient_id", patient_id)
    )
    if search:
        count_q = count_q.or_(f"title.ilike.%{search}%,summary.ilike.%{search}%")
    if tag:
        count_q = count_q.contains("tags", [tag])
    count_result = count_q.execute()

    return ConversationListOut(
        conversations=data.data or [],
        total=count_result.count if count_result.count is not None else len(data.data or []),
    )


# ================================================================
#  Single Conversation Detail (with messages)
# ================================================================

@conversation_history_router.get("/conversations/{patient_id}/{conversation_id}")
def get_conversation_detail(patient_id: str, conversation_id: str):
    """Return a conversation header + all its messages."""
    sb = _supabase()

    conv = (
        sb.table("conversations")
        .select("*")
        .eq("id", conversation_id)
        .eq("patient_id", patient_id)
        .single()
        .execute()
    )
    if not conv.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = (
        sb.table("conversation_messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", desc=False)
        .execute()
    )

    return ConversationDetailOut(
        **conv.data,
        messages=messages.data or [],
    )


# ================================================================
#  Conversation CRUD
# ================================================================

@conversation_history_router.post("/conversations")
def create_conversation(payload: ConversationCreate):
    row = payload.model_dump()
    row["last_message_at"] = datetime.utcnow().isoformat()
    result = _supabase().table("conversations").insert(row).execute()
    return {"status": "ok", "data": result.data}


@conversation_history_router.put("/conversations/{conversation_id}")
def update_conversation(conversation_id: str, payload: ConversationCreate):
    result = (
        _supabase()
        .table("conversations")
        .update(payload.model_dump())
        .eq("id", conversation_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"status": "ok", "data": result.data}


@conversation_history_router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):
    # Messages cascade-delete via FK
    _supabase().table("conversations").delete().eq("id", conversation_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Messages CRUD
# ================================================================

@conversation_history_router.get("/messages/{conversation_id}")
def list_messages(conversation_id: str):
    data = (
        _supabase()
        .table("conversation_messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", desc=False)
        .execute()
    )
    return {"status": "ok", "data": data.data}


@conversation_history_router.post("/messages")
def create_message(payload: ConversationMessageCreate):
    sb = _supabase()
    row = payload.model_dump()
    result = sb.table("conversation_messages").insert(row).execute()

    # Update conversation's message_count and last_message_at
    if result.data:
        msg_count = (
            sb.table("conversation_messages")
            .select("id", count="exact")
            .eq("conversation_id", payload.conversation_id)
            .execute()
        )
        sb.table("conversations").update({
            "message_count": msg_count.count or 0,
            "last_message_at": datetime.utcnow().isoformat(),
        }).eq("id", payload.conversation_id).execute()

    return {"status": "ok", "data": result.data}


@conversation_history_router.delete("/messages/{message_id}")
def delete_message(message_id: str):
    _supabase().table("conversation_messages").delete().eq("id", message_id).execute()
    return {"status": "ok", "message": "deleted"}


# ================================================================
#  Seed Mock Data
# ================================================================

MOCK_PATIENT_ID = "00000000-0000-0000-0000-000000000001"


@conversation_history_router.post("/seed")
def seed_mock_conversations():
    """
    Populate the database with realistic conversation history
    matching the Conversation History UI.  Idempotent.
    """
    sb = _supabase()
    pid = MOCK_PATIENT_ID

    # ── clean previous seeds ───────────────────────────────────
    # Delete conversations (messages cascade-delete via FK)
    sb.table("conversations").delete().eq("patient_id", pid).execute()

    now = datetime.utcnow()
    day = timedelta(days=1)

    # ── conversations with inline messages ─────────────────────
    conversations = [
        {
            "title": "Afternoon Headache Consultation",
            "summary": (
                "I recommend drinking a glass of water and resting "
                "for 15 minutes in a quiet environment."
            ),
            "tags": ["Symptoms", "Medication"],
            "date_offset": 0,  # Today
            "message_count": 4,
            "messages": [
                ("user", "I've been having a headache since lunch. It's a dull ache behind my eyes."),
                ("ai", "I'm sorry to hear that. How much water have you had today, and did you eat lunch on time?"),
                ("user", "About 3 glasses, and I ate around 1 PM — a bit late."),
                ("ai", "I recommend drinking a glass of water and resting for 15 minutes in a quiet environment. A delayed meal combined with dehydration often triggers tension headaches."),
            ],
        },
        {
            "title": "Sleep Quality Analysis",
            "summary": (
                "Your REM sleep has improved by 18% since adjusting "
                "your evening routine. Keep maintaining the 10:30 PM bedtime."
            ),
            "tags": ["Sleep", "Wellness"],
            "date_offset": 1,  # Yesterday
            "message_count": 6,
            "messages": [
                ("user", "Can you look at my sleep data from this week?"),
                ("ai", "Sure! I can see your sleep logs. Let me analyze the patterns."),
                ("user", "I've been trying to go to bed at 10:30 PM consistently."),
                ("ai", "Great effort! Your REM sleep has improved by 18% since adjusting your evening routine. Keep maintaining the 10:30 PM bedtime."),
                ("user", "Any tips to improve deep sleep?"),
                ("ai", "Try avoiding screens 30 minutes before bed and keep the room at 65–68°F. A short wind-down routine like reading can help increase deep sleep stages."),
            ],
        },
        {
            "title": "Nutrition & Hydration Review",
            "summary": (
                "Based on your logs, increasing your afternoon water "
                "intake by 2 glasses could help reduce fatigue symptoms."
            ),
            "tags": ["Nutrition", "Hydration"],
            "date_offset": 2,  # Apr 30
            "message_count": 8,
            "messages": [
                ("user", "I feel tired a lot in the afternoon. Could it be diet-related?"),
                ("ai", "Let me review your diet and hydration logs from the past few days."),
                ("user", "I usually have lunch at noon and don't eat until dinner."),
                ("ai", "That's a long gap. I notice your water intake drops after 2 PM as well."),
                ("user", "Yeah, I forget to drink water when I'm working."),
                ("ai", "Based on your logs, increasing your afternoon water intake by 2 glasses could help reduce fatigue symptoms."),
                ("user", "Should I add a snack too?"),
                ("ai", "Yes — a light snack around 3 PM with protein and fiber (like Greek yogurt or almonds) would help maintain energy levels through the afternoon."),
            ],
        },
        {
            "title": "Blood Pressure Follow-up",
            "summary": (
                "Your blood pressure readings over the past week show "
                "excellent stability. Continue your current regimen."
            ),
            "tags": ["Vitals", "BP"],
            "date_offset": 3,  # Apr 29
            "message_count": 5,
            "messages": [
                ("user", "How's my blood pressure looking this week?"),
                ("ai", "Your readings have been very consistent — averaging 120/80 mmHg across all entries."),
                ("user", "Is that good for my age?"),
                ("ai", "Your blood pressure readings over the past week show excellent stability. Continue your current regimen."),
                ("user", "Thanks, I'll keep it up!"),
            ],
        },
        {
            "title": "Exercise Plan Discussion",
            "summary": (
                "A combination of 30-minute walks and light yoga would "
                "be ideal given your current health profile."
            ),
            "tags": ["Exercise", "Wellness"],
            "date_offset": 6,  # Apr 26
            "message_count": 7,
            "messages": [
                ("user", "I want to start exercising but I'm not sure where to begin."),
                ("ai", "That's great to hear! Let me look at your health profile to recommend something safe."),
                ("user", "I haven't exercised regularly in a while."),
                ("ai", "A combination of 30-minute walks and light yoga would be ideal given your current health profile."),
                ("user", "How often should I do each?"),
                ("ai", "Aim for walks 5 days a week and yoga 3 days. Start easy and we can increase intensity after 2 weeks."),
                ("user", "That sounds doable. I'll start tomorrow."),
            ],
        },
    ]

    for conv in conversations:
        ts = now - conv["date_offset"] * day
        conv_row = {
            "patient_id": pid,
            "title": conv["title"],
            "summary": conv["summary"],
            "tags": conv["tags"],
            "message_count": conv["message_count"],
            "last_message_at": ts.isoformat(),
        }
        result = sb.table("conversations").insert(conv_row).execute()
        conv_id = result.data[0]["id"]

        # Insert messages with incrementing timestamps
        msg_rows = []
        for i, (role, content) in enumerate(conv["messages"]):
            msg_rows.append({
                "conversation_id": conv_id,
                "role": role,
                "content": content,
                "created_at": (ts + timedelta(minutes=i * 2)).isoformat(),
            })
        sb.table("conversation_messages").insert(msg_rows).execute()

    return {
        "status": "ok",
        "message": "Conversation history mock data seeded successfully",
        "patient_id": pid,
    }
