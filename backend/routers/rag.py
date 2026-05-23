# routers/rag.py

from pathlib import Path

from fastapi import APIRouter, HTTPException

from schemas.rag import (
    RAGSearchRequest,
    RAGSearchResponse,
    RAGSearchResult,
)

from services.vectorstore_service import (
    create_faiss_index,
    similarity_search,
)

from config.settings import yaml_settings


API_PREFIX = "/rag"

router = APIRouter(prefix=API_PREFIX, tags=["RAG"])


@router.get("/status")
async def rag_status():

    documents_path = Path(yaml_settings.paths.documents_path)

    faiss_index_path = Path(yaml_settings.paths.faiss_index_path)

    documents_count = len([file for file in documents_path.iterdir() if file.is_file()])

    index_exists = (faiss_index_path / "index.faiss").exists()

    return {
        "status": "running",
        "vector_db": yaml_settings.vector_db.provider,
        "embedding_model": yaml_settings.embedding.model,
        "documents_count": documents_count,
        "index_exists": index_exists,
    }


@router.post("/reindex")
async def reindex_documents():

    try:
        result = create_faiss_index()

        return result

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/search", response_model=RAGSearchResponse)
async def rag_search(request: RAGSearchRequest):

    try:
        results = similarity_search(
            query=request.query,
            k=request.k,
        )

        formatted_results = []

        for document, score in results:
            formatted_results.append(
                RAGSearchResult(
                    content=document.page_content,
                    score=float(score),
                    metadata=document.metadata,
                )
            )

        return RAGSearchResponse(results=formatted_results)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
