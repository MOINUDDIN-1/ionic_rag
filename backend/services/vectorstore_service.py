# services/vectorstore_service.py

from pathlib import Path

from langchain_core.documents import Document

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
)

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)

from langchain_community.vectorstores import (
    FAISS,
)

from langchain_pinecone import (
    PineconeEmbeddings,
)

from config.settings import (
    env_settings,
    yaml_settings,
)


# =========================
# PATHS
# =========================

DOCUMENTS_PATH = Path(yaml_settings.paths.documents_path)

FAISS_INDEX_PATH = Path(yaml_settings.paths.faiss_index_path)

FAISS_INDEX_PATH.mkdir(parents=True, exist_ok=True)


# =========================
# EMBEDDINGS
# =========================
embeddings = PineconeEmbeddings(
    model=yaml_settings.embedding.model,
    pinecone_api_key=env_settings.PINECONE_API_KEY,
)


# =========================
# LOAD DOCUMENTS
# =========================


def load_documents() -> list[Document]:

    documents = []

    for file_path in DOCUMENTS_PATH.iterdir():
        if not file_path.is_file():
            continue

        suffix = file_path.suffix.lower()

        try:
            if suffix == ".pdf":
                loader = PyPDFLoader(str(file_path))

            elif suffix == ".txt":
                loader = TextLoader(str(file_path), encoding="utf-8")

            elif suffix == ".md":
                loader = TextLoader(str(file_path), encoding="utf-8")

            elif suffix == ".docx":
                loader = Docx2txtLoader(str(file_path))

            else:
                continue

            documents.extend(loader.load())

        except Exception as error:
            print(f"Failed to load {file_path.name}: {error}")

    return documents


# =========================
# MERGE DOCUMENTS
# =========================
def merge_documents_by_file(documents: list[Document]) -> list[Document]:

    merged_docs = {}

    for doc in documents:
        source = doc.metadata.get("source", "unknown")

        filename = Path(source).name

        if filename not in merged_docs:
            merged_docs[filename] = []

        merged_docs[filename].append(doc.page_content)

    final_documents = []

    for filename, contents in merged_docs.items():
        merged_text = "\n\n".join(contents)

        final_documents.append(
            Document(page_content=merged_text, metadata={"filename": filename})
        )

    return final_documents


# =========================
# SPLIT DOCUMENTS
# =========================


def split_documents(documents: list[Document]) -> list[Document]:

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=yaml_settings.rag.chunk_size,
        chunk_overlap=yaml_settings.rag.chunk_overlap,
    )

    return text_splitter.split_documents(documents)


# =========================
# CREATE FAISS INDEX
# =========================


def create_faiss_index():

    documents = load_documents()

    if not documents:
        raise ValueError("No documents found")

    merged_documents = merge_documents_by_file(documents)

    split_docs = split_documents(merged_documents)

    vectorstore = FAISS.from_documents(split_docs, embeddings)

    vectorstore.save_local(str(FAISS_INDEX_PATH))

    return {
        "documents_loaded": len(merged_documents),
        "chunks_created": len(split_docs),
        "message": "FAISS index created successfully",
    }


# =========================
# LOAD FAISS INDEX
# =========================


def load_faiss_index():

    index_file = FAISS_INDEX_PATH / "index.faiss"

    if not index_file.exists():
        raise ValueError("FAISS index not found")

    return FAISS.load_local(
        str(FAISS_INDEX_PATH),
        embeddings,
        allow_dangerous_deserialization=True,
    )


# =========================
# SIMILARITY SEARCH
# =========================


def similarity_search(
    query: str,
    k: int | None = None,
):

    vectorstore = load_faiss_index()

    results = vectorstore.similarity_search_with_relevance_scores(
        query=query,
        k=k or yaml_settings.rag.top_k,
    )

    return results
