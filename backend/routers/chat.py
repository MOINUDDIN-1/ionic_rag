# routers/chat.py

from fastapi import (
    APIRouter,
    HTTPException,
)

from fastapi.responses import FileResponse

from schemas.chat import (
    AudioRequest,
    ChatRequest,
    ChatResponse,
    SummarizeRequest,
    SummarizeResponse,
)

from services.audio_service import generate_audio_file

from services.llm_service import summarize_text

from services.rag_service import rag_chat


API_PREFIX = "/chat"

router = APIRouter(
    prefix=API_PREFIX,
    tags=["Chat"],
)


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
):

    try:
        result = rag_chat(
            query=request.message,
            k=request.k,
        )

        return ChatResponse(
            response=result["response"],
            sources=result["sources"],
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(
    request: SummarizeRequest,
):

    try:
        summary = summarize_text(request.text)

        return SummarizeResponse(summary=summary)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/audio")
async def audio_chat(
    request: AudioRequest,
):

    try:
        audio_path = await generate_audio_file(request.text)

        return FileResponse(
            path=audio_path,
            media_type="audio/mpeg",
            filename=audio_path.name,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
