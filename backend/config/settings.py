# config/settings.py

from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


# =========================
# PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "config.yaml"


# =========================
# ENV SETTINGS
# =========================


class EnvSettings(BaseSettings):
    OPENAI_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    PINECONE_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")


# =========================
# YAML SETTINGS
# =========================


class LLMConfig(BaseModel):
    provider: Literal["openai", "groq"]
    model: str
    temperature: float = 0.7


class EmbeddingConfig(BaseModel):
    provider: Literal["openai", "huggingface", "pinecone"]
    model: str


class VectorDBConfig(BaseModel):
    provider: str
    path: str


class RAGConfig(BaseModel):
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k: int = 4


class MemoryConfig(BaseModel):
    enabled: bool = True
    max_history_messages: int = 3
    max_message_chars: int = 2000


class PathsConfig(BaseModel):
    documents_path: str
    faiss_index_path: str


class AppConfig(BaseModel):
    env: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000


class YAMLSettings(BaseModel):
    llm: LLMConfig
    embedding: EmbeddingConfig
    vector_db: VectorDBConfig
    rag: RAGConfig
    paths: PathsConfig
    app: AppConfig
    memory: MemoryConfig


# =========================
# LOAD YAML
# =========================


def load_yaml_settings() -> YAMLSettings:
    with open(CONFIG_PATH, "r") as file:
        data = yaml.safe_load(file)

    return YAMLSettings(**data)


# =========================
# GLOBAL SETTINGS
# =========================

env_settings = EnvSettings()
yaml_settings = load_yaml_settings()
