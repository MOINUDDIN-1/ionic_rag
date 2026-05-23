# routers/upload.py

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
)

from schemas.document import (
    DeleteDocumentsRequest,
    DeleteDocumentsResponse,
    DocumentListResponse,
    DocumentResponse,
    UploadResponse,
)

from services.upload_service import (
    delete_uploaded_documents,
    list_uploaded_documents,
    save_uploaded_files,
    update_uploaded_file,
    delete_all_uploaded_documents,
)


router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=UploadResponse)
async def upload_documents(files: list[UploadFile] = File(...)):
    try:
        uploaded_files = await save_uploaded_files(files)

        return UploadResponse(
            uploaded_files=uploaded_files, message="Documents uploaded successfully"
        )

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.put("/{filename}")
async def update_document(filename: str, file: UploadFile = File(...)):
    try:
        updated_file = await update_uploaded_file(filename=filename, file=file)

        return {
            "updated_file": updated_file,
            "message": "Document updated successfully",
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("", response_model=DocumentListResponse)
async def uploaded_documents():
    documents = list_uploaded_documents()

    return DocumentListResponse(
        documents=[DocumentResponse(filename=doc) for doc in documents]
    )


@router.delete("/all")
async def delete_all_documents():
    deleted_files = delete_all_uploaded_documents()

    return {
        "deleted_files": deleted_files,
        "message": "All documents deleted successfully",
    }


@router.delete("/{filename}")
async def delete_document(
    filename: str,
):

    deleted_files, failed_files = delete_uploaded_documents([filename])

    if failed_files:
        raise HTTPException(
            status_code=404,
            detail=f"{filename} not found",
        )

    return {
        "deleted_file": filename,
        "message": "Document deleted successfully",
    }


@router.delete("", response_model=DeleteDocumentsResponse)
async def delete_documents(request: DeleteDocumentsRequest):
    deleted_files, failed_files = delete_uploaded_documents(request.filenames)

    return DeleteDocumentsResponse(
        deleted_files=deleted_files, failed_files=failed_files
    )
