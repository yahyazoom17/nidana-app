from fastapi import APIRouter, UploadFile, File # type: ignore
from services.chatbot.utils import chatbot_crew, analysis_crew
from routes.chatbot.schemas import ChatbotInputSchema
from services.chatbot.analysis import get_report_from_pdf
import os
import img2pdf

chatbot_router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@chatbot_router.get("/")
def health():
    return {"message":"chatbot is running!", "status":"ok"}

@chatbot_router.post("/chat")
def ask_chatbot(user_input:ChatbotInputSchema):
    response = chatbot_crew.kickoff(inputs={
    "input": f"{user_input.query}"
    })
    return {"status":"ok", "message":"agent responded", "response":response}

@chatbot_router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed"}

    file_path = os.path.join(UPLOAD_FOLDER, "sample.pdf")

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    report_data = get_report_from_pdf()
    response = analysis_crew.kickoff(inputs={"report":report_data})
    return {"status":"ok", "message":"agent responded", "response":response}

@chatbot_router.post("/upload-image")
async def convert_to_pdf(file: UploadFile = File(...)):
    # Read uploaded file
    image_bytes = await file.read()

    # Convert to PDF
    pdf_bytes = img2pdf.convert(image_bytes)

    # Save PDF to disk
    output_path = f"uploads/sample.pdf"
    with open(output_path, "wb") as f:
        f.write(pdf_bytes)

    report_data = get_report_from_pdf()
    response = analysis_crew.kickoff(inputs={"report":report_data})
    return {"status":"ok", "message":"agent responded", "response":response}