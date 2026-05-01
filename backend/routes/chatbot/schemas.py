from pydantic import BaseModel
from typing import Optional

class ChatbotInputSchema(BaseModel):
    query: str
    patient_data: Optional[dict] = {
        "patient_name":""
    }