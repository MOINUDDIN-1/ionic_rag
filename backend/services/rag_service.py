# services/rag_service.py

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
)

from config.settings import yaml_settings

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
) -> str:

    if len(text) <= max_chars:
        return text

    return text[:max_chars]


def build_history(
    history,
):

    messages = []

    recent_history = history[-MAX_HISTORY_MESSAGES:]

    for item in recent_history:
        content = truncate_text(item.content)

        if item.role == "user":
            messages.append(HumanMessage(content=content))

        elif item.role == "assistant":
            messages.append(AIMessage(content=content))

    return messages


def build_context(results) -> str:

    contexts = []

    for document, _score in results:
        contexts.append(document.page_content)

    return "\n\n".join(contexts)


def extract_sources(results) -> list[str]:

    sources = set()

    for document, _score in results:
        filename = document.metadata.get("filename")

        if filename:
            sources.add(filename)

    return list(sources)


def rag_chat(
    query: str,
    history,
    k: int = 3,
):

    if not yaml_settings.memory.enabled:
        history = []

    results = similarity_search(
        query=query,
        k=k,
    )

    context = build_context(results)

    history_messages = build_history(history)

    response = generate_chat_response(
        question=query,
        context=context,
        history=history_messages,
    )

    sources = extract_sources(results)

    return {
        "response": response,
        "sources": sources,
    }
