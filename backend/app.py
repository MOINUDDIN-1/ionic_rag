# app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm_service import generate_chat_response

app = FastAPI(title="Ionic RAG Chatbot API")

# CORS for Ionic Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.get("/")
async def health_check():
    return {"status": "running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    response = generate_chat_response(request.message)

    return ChatResponse(response=response)
