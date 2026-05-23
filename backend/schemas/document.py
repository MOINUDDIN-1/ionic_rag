# schemas/document.py

from pydantic import BaseModel


class UploadResponse(BaseModel):
    uploaded_files: list[str]
    message: str


class DeleteDocumentsRequest(BaseModel):
    filenames: list[str]


class DeleteDocumentsResponse(BaseModel):
    deleted_files: list[str]
    failed_files: list[str]


class DocumentResponse(BaseModel):
    filename: str


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
