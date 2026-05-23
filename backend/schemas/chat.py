# schemas/chat.py

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    conversation_id: str
    user_id: str
    message: str
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


class SpeechToTextResponse(BaseModel):
    text: str
