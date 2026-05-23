# services/rag_service.py

from services.llm_service import (
    generate_chat_response,
)

from services.vectorstore_service import (
    similarity_search,
)


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
    k: int = 3,
):

    results = similarity_search(
        query=query,
        k=k,
    )

    context = build_context(results)

    response = generate_chat_response(
        question=query,
        context=context,
    )

    sources = extract_sources(results)

    return {
        "response": response,
        "sources": sources,
    }
