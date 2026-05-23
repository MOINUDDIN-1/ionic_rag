# schemas/chat.py

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: str
    history: list[ChatMessage] = []
    k: int = 3


class ChatResponse(BaseModel):
    response: str
    sources: list[str]


class SummarizeRequest(BaseModel):
    text: str


class SummarizeResponse(BaseModel):
    summary: str


class AudioRequest(BaseModel):
    text: str


class AudioResponse(BaseModel):
    audio_url: str
