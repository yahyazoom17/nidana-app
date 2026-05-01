from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot.router import chatbot_router
from routes.health_monitor.router import health_monitor_router
from routes.vital_logs.router import vital_logs_router
from routes.lifestyle_tracker.router import lifestyle_tracker_router
from routes.conversation_history.router import conversation_history_router

app = FastAPI(title="Nidana API v0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Healthcare API is running 🚀"}

app.include_router(chatbot_router)
app.include_router(health_monitor_router)
app.include_router(vital_logs_router)
app.include_router(lifestyle_tracker_router)
app.include_router(conversation_history_router)