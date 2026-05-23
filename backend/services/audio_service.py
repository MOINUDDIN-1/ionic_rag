# services/audio_service.py

from pathlib import Path
from uuid import uuid4

import edge_tts


TEMP_AUDIO_DIR = Path("temp_audio")

TEMP_AUDIO_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


VOICE = "en-US-AriaNeural"


async def generate_audio_file(
    text: str,
) -> Path:

    filename = f"{uuid4().hex}.mp3"

    audio_path = TEMP_AUDIO_DIR / filename

    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
    )

    await communicate.save(str(audio_path))

    return audio_path
