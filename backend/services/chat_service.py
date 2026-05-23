from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
)

from config.settings import (
    yaml_settings,
)

from services.conversation_service import (
    add_message,
    get_conversation_messages,
)

from services.llm_service import (
    generate_chat_response,
)

from services.vectorstore_service import (
    similarity_search,
)


MAX_HISTORY_MESSAGES = yaml_settings.memory.max_history_messages

MAX_MESSAGE_CHARS = yaml_settings.memory.max_message_chars


def truncate_text(
    text: str,
    max_chars: int = MAX_MESSAGE_CHARS,
):

    if len(text) <= max_chars:
        return text

    return text[:max_chars]


def build_history(
    messages,
):

    history = []

    recent_messages = messages[-MAX_HISTORY_MESSAGES:]

    for message in recent_messages:
        content = truncate_text(message.content)

        if message.role == "user":
            history.append(HumanMessage(content=content))

        elif message.role == "assistant":
            history.append(AIMessage(content=content))

    return history


def build_context(
    results,
):

    contexts = []

    for document, _score in results:
        contexts.append(document.page_content)

    return "\n\n".join(contexts)


def extract_sources(
    results,
):

    sources = set()

    for document, _score in results:
        filename = document.metadata.get("filename")

        if filename:
            sources.add(filename)

    return list(sources)


async def process_chat(
    db: AsyncSession,
    conversation_id: str,
    message: str,
    k: int = 3,
):

    conversation_messages = await get_conversation_messages(
        db=db,
        conversation_id=conversation_id,
    )

    history = build_history(conversation_messages)

    results = similarity_search(
        query=message,
        k=k,
    )

    context = build_context(results)

    response = generate_chat_response(
        question=message,
        context=context,
        history=history,
    )

    await add_message(
        db=db,
        conversation_id=conversation_id,
        role="user",
        content=message,
    )

    await add_message(
        db=db,
        conversation_id=conversation_id,
        role="assistant",
        content=response,
    )

    return {
        "response": response,
        "sources": extract_sources(results),
    }
