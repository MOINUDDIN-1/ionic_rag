# services/llm_service.py

from langchain_core.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.tracers.stdout import ConsoleCallbackHandler
from langchain_groq import ChatGroq

from config.settings import (
    env_settings,
    yaml_settings,
)

callback_handler = ConsoleCallbackHandler()
llm = ChatGroq(
    model=yaml_settings.llm.model,
    temperature=yaml_settings.llm.temperature,
    api_key=env_settings.GROQ_API_KEY,
    callbacks=[callback_handler],
)


RAG_PROMPT_TEMPLATE = """
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer is not available in the context,
say:
"I could not find the answer in the provided documents."

Context:
{context}
"""


rag_prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            RAG_PROMPT_TEMPLATE,
        ),
        MessagesPlaceholder(variable_name="history"),
        (
            "human",
            "{question}",
        ),
    ]
)


def generate_chat_response(
    question: str,
    context: str,
    history,
) -> str:

    chain = rag_prompt_template | llm

    response = chain.invoke(
        {
            "question": question,
            "context": context,
            "history": history,
        },
        config={"callbacks": [callback_handler]},
    )

    return response.content


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
        },
        config={"callbacks": [callback_handler]},
    )

    return response.content
