from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from database.database import (
    get_db,
)

from database.models import (
    Conversation,
)

from dependencies.conversation import (
    get_conversation,
)

from services.conversation_service import (
    add_message,
    create_conversation,
    delete_conversation,
    get_conversation_messages,
    get_user_conversations,
)


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("")
async def new_conversation(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):

    return await create_conversation(
        db=db,
        user_id=user_id,
    )


@router.get("")
async def conversations(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):

    return await get_user_conversations(
        db=db,
        user_id=user_id,
    )


@router.get("/{conversation_id}")
async def conversation_messages(
    conversation: Conversation = Depends(get_conversation),
    db: AsyncSession = Depends(get_db),
):

    return await get_conversation_messages(
        db=db,
        conversation_id=conversation.id,
    )


@router.post("/{conversation_id}/messages")
async def create_message(
    role: str,
    content: str,
    conversation: Conversation = Depends(get_conversation),
    db: AsyncSession = Depends(get_db),
):

    return await add_message(
        db=db,
        conversation_id=conversation.id,
        role=role,
        content=content,
    )


@router.delete("/{conversation_id}")
async def remove_conversation(
    conversation: Conversation = Depends(get_conversation),
    db: AsyncSession = Depends(get_db),
):

    deleted = await delete_conversation(
        db=db,
        conversation_id=conversation.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return {"message": "Conversation deleted"}
