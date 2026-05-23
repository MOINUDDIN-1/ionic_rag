# services/upload_service.py

from pathlib import Path

from fastapi import UploadFile

from config.settings import yaml_settings


DOCUMENTS_PATH = Path(yaml_settings.paths.documents_path)
DOCUMENTS_PATH.mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
}


def validate_file(file: UploadFile) -> None:
    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {extension}")


def generate_unique_filename(filename: str) -> str:
    file_path = DOCUMENTS_PATH / filename

    if not file_path.exists():
        return filename

    stem = Path(filename).stem
    suffix = Path(filename).suffix

    counter = 1

    while True:
        new_filename = f"{stem}_{counter}{suffix}"

        new_file_path = DOCUMENTS_PATH / new_filename

        if not new_file_path.exists():
            return new_filename

        counter += 1


async def save_uploaded_files(files: list[UploadFile]) -> list[str]:

    uploaded_files = []

    for file in files:
        validate_file(file)

        filename = generate_unique_filename(file.filename)

        file_path = DOCUMENTS_PATH / filename

        content = await file.read()

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        uploaded_files.append(filename)

    return uploaded_files


async def update_uploaded_file(filename: str, file: UploadFile) -> str:

    validate_file(file)

    file_path = DOCUMENTS_PATH / filename

    if not file_path.exists():
        raise FileNotFoundError("Document not found")

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return filename


def list_uploaded_documents() -> list[str]:
    return sorted([file.name for file in DOCUMENTS_PATH.iterdir() if file.is_file()])


def delete_uploaded_documents(filenames: list[str]) -> tuple[list[str], list[str]]:

    deleted_files = []
    failed_files = []

    for filename in filenames:
        file_path = DOCUMENTS_PATH / filename

        if file_path.exists():
            file_path.unlink()
            deleted_files.append(filename)
        else:
            failed_files.append(filename)

    return deleted_files, failed_files

def delete_all_uploaded_documents() -> list[str]:
    deleted_files = []

    for file in DOCUMENTS_PATH.iterdir():
        if file.is_file():
            deleted_files.append(file.name)
            file.unlink()

    return deleted_files