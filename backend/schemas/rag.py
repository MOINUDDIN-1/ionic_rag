# schemas/rag.py

from pydantic import BaseModel


class RAGSearchRequest(BaseModel):
    query: str
    k: int = 3


class RAGSearchResult(BaseModel):
    content: str
    score: float
    metadata: dict


class RAGSearchResponse(BaseModel):
    results: list[RAGSearchResult]
