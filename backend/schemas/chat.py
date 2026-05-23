# schemas/chat.py

from pydantic import BaseModel


class ChatRequest(BaseModel):
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
