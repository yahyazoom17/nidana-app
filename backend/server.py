from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot.router import chatbot_router

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