# services/llm_service.py

from langchain_groq import ChatGroq

from langchain_core.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
)

from config.settings import (
    env_settings,
    yaml_settings,
)


# =========================
# LLM
# =========================

llm = ChatGroq(
    model=yaml_settings.llm.model,
    temperature=yaml_settings.llm.temperature,
    api_key=env_settings.GROQ_API_KEY,
)


# =========================
# PROMPT
# =========================

RAG_PROMPT_TEMPLATE = """
You are a helpful AI assistant.

Answer the user's question ONLY using:
1. Retrieved document context
2. Previous conversation history

If the answer is not available,
say:
"I could not find the answer in the provided documents."

Retrieved Context:
{context}
"""


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            RAG_PROMPT_TEMPLATE,
        ),
        MessagesPlaceholder(
            variable_name="history",
            optional=True,
        ),
        (
            "human",
            "{question}",
        ),
    ]
)


# =========================
# CHAT RESPONSE
# =========================


def generate_chat_response(
    question: str,
    context: str,
    history,
) -> str:

    chain = prompt | llm

    response = chain.invoke(
        {
            "question": question,
            "context": context,
            "history": history,
        }
    )

    return response.content


# =========================
# SUMMARIZE
# =========================

SUMMARY_PROMPT_TEMPLATE = """
Summarize the following text clearly and concisely.

Text:
{text}
"""


summary_prompt_template = ChatPromptTemplate.from_template(SUMMARY_PROMPT_TEMPLATE)


def summarize_text(
    text: str,
) -> str:

    chain = summary_prompt_template | llm

    response = chain.invoke(
        {
            "text": text,
        }
    )

    return response.content
