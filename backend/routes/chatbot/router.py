from fastapi import APIRouter, UploadFile, File # type: ignore
from services.chatbot.utils import chatbot_crew, analysis_crew
from routes.chatbot.schemas import ChatbotInputSchema
from services.chatbot.analysis import get_report_from_pdf
from services.chatbot.report_extractor import extract_report_data
from services.chatbot.report_persister import persist_report_data, save_report_conversation
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

    # 1. OCR the report
    report_data = get_report_from_pdf()

    # 2. Run the analysis crew for AI response
    response = analysis_crew.kickoff(inputs={"report": report_data})

    # 3. Extract structured data from the report using LLM
    extracted = {}
    persist_counts = {}
    try:
        extracted = extract_report_data(report_data)
        persist_counts = persist_report_data(extracted)
        save_report_conversation(
            file_name=file.filename or "report.pdf",
            report_text=report_data,
            ai_response=str(response),
        )
    except Exception as exc:
        print(f"[upload-pdf] Data extraction/persistence error: {exc}")

    return {
        "status": "ok",
        "message": "agent responded",
        "response": response,
        "extracted_data": extracted,
        "persisted_counts": persist_counts,
    }

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

    # 1. OCR the report
    report_data = get_report_from_pdf()

    # 2. Run the analysis crew for AI response
    response = analysis_crew.kickoff(inputs={"report": report_data})

    # 3. Extract structured data from the report using LLM
    extracted = {}
    persist_counts = {}
    try:
        extracted = extract_report_data(report_data)
        persist_counts = persist_report_data(extracted)
        save_report_conversation(
            file_name=file.filename or "report.image",
            report_text=report_data,
            ai_response=str(response),
        )
    except Exception as exc:
        print(f"[upload-image] Data extraction/persistence error: {exc}")

    return {
        "status": "ok",
        "message": "agent responded",
        "response": response,
        "extracted_data": extracted,
        "persisted_counts": persist_counts,
    }