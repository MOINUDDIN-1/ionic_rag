from fastapi import (
    Depends,
    HTTPException,
)

from sqlalchemy import (
    select,
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


async def get_conversation(
    conversation_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db),
):

    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )

    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if conversation.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return conversation
