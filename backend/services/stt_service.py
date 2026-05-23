from pathlib import Path
from uuid import uuid4

from faster_whisper import WhisperModel


TEMP_AUDIO_DIR = Path("temp_stt_audio")

TEMP_AUDIO_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8",
)


async def transcribe_audio(
    audio_file,
) -> str:

    filename = f"{uuid4().hex}_{audio_file.filename}"

    temp_audio_path = TEMP_AUDIO_DIR / filename

    with open(
        temp_audio_path,
        "wb",
    ) as buffer:
        content = await audio_file.read()

        buffer.write(content)

    segments, _ = model.transcribe(str(temp_audio_path))

    text = " ".join([segment.text for segment in segments])

    temp_audio_path.unlink(missing_ok=True)

    return text.strip()
