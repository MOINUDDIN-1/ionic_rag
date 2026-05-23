# routers/health.py

from fastapi import APIRouter


API_PREFIX = "/health"

router = APIRouter(
    prefix=API_PREFIX,
    tags=["Health"]
)


@router.get("")
async def health_check():
    return {
        "status": "healthy"
    }