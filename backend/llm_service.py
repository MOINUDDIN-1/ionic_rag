# llm_service.py

import os

from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

# Read API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not OPENAI_API_KEY and not GROQ_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in .env file")

# Initialize LLM
# llm = ChatOpenAI(model="gpt-4.1-mini", temperature=0.7, api_key=OPENAI_API_KEY)
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.7, api_key=GROQ_API_KEY)

# Prompt Template
chat_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a helpful AI assistant.
            Give concise, accurate, and clean responses.
            """,
        ),
        ("human", "{user_input}"),
    ]
)

# Output parser
output_parser = StrOutputParser()

# LangChain Expression Language (LCEL)
chain = chat_prompt | llm | output_parser


def generate_chat_response(user_message: str) -> str:
    """
    Generate chatbot response using LangChain + OpenAI
    """

    response = chain.invoke({"user_input": user_message})
    # response = "test response"

    return response
