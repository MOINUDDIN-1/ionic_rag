# routers/__init__.py


from .chat import router as chat_router
from .conversations import router as conversations_router
from .upload import router as upload_router
from .health import router as health_router
from .rag import router as rag_router

API_PREFIX = "/api/v1"

ALL_ROUTERS = (
    chat_router,
    conversations_router,
    upload_router,
    health_router,
    rag_router,
)


__all__ = [
    "API_PREFIX",
    "ALL_ROUTERS",
    "chat_router",
    "upload_router",
    "health_router",
    "rag_router",
    "conversations_router",
]
