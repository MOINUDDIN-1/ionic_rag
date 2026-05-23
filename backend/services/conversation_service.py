from sqlalchemy import (
    select,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from database.models import (
    Conversation,
    ConversationMessage,
)


async def create_conversation(
    db: AsyncSession,
    user_id: str,
):

    conversation = Conversation(
        user_id=user_id,
    )

    db.add(conversation)

    await db.commit()

    await db.refresh(conversation)

    return conversation


async def get_user_conversations(
    db: AsyncSession,
    user_id: str,
):

    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    )

    return result.scalars().all()


async def get_conversation_messages(
    db: AsyncSession,
    conversation_id: str,
):

    result = await db.execute(
        select(ConversationMessage)
        .where(ConversationMessage.conversation_id == conversation_id)
        .order_by(ConversationMessage.created_at.asc())
    )

    return result.scalars().all()


async def add_message(
    db: AsyncSession,
    conversation_id: str,
    role: str,
    content: str,
):

    message = ConversationMessage(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )

    db.add(message)

    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )

    conversation = result.scalar_one()

    conversation.last_message = content

    if conversation.title == "New Chat":
        conversation.title = content.strip()[:40]

    await db.commit()

    await db.refresh(message)

    return message


async def delete_conversation(
    db: AsyncSession,
    conversation_id: str,
):

    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )

    conversation = result.scalar_one_or_none()

    if not conversation:
        raise ValueError("Conversation not found")

    await db.delete(conversation)

    await db.commit()

    return True
