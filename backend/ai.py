import base64
import io
import json
import os

import httpx
from PIL import Image
from pypdf import PdfReader


MODELS = {
    "anthropic": (
        "anthropic",
        os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-5"),
        "Claude",
    ),
}


SYSTEM_MESSAGE = """Ти си AI асистентът на уебсайта на Гюрсел Исмаилов — независим разработчик, който създава AI чатботове, AI агенти, автоматизации и умни мобилни/уеб приложения за бизнеса.

Какво прави Гюрсел:
- AI чатботове и асистенти
- AI агенти и автоматизации
- Анализ на документи
- Компютърно зрение
- AI в мобилни приложения
- Уеб приложения
- OpenAI, Claude, Gemini, RAG, Python, Kotlin, Swift, React

Правила:
- Отговаряй винаги на български език.
- Отговаряй кратко, ясно и приятелски.
- Помагай на посетителя да разбере как AI може да е полезен за бизнеса му.
- При прикачен документ или снимка анализирай съдържанието.
- При интерес към проект насочвай към формата „Контакти“ или „Свържи се“.
- Не измисляй цени. Цената се уточнява след консултация.
"""


MAX_PDF_CHARS = 15000

_CHATS = {}


def build_chat(session_id: str, provider: str, history: list[dict]):
    if provider not in MODELS:
        raise ValueError("Unsupported AI provider")

    key = (session_id, provider)

    chat = {
        "session_id": session_id,
        "provider": provider,
        "history": history[-20:] if history else [],
    }

    _CHATS[key] = chat
    return chat


def drop_chat(session_id: str, provider: str):
    _CHATS.pop((session_id, provider), None)


def image_to_base64(data: bytes) -> str:
    img = Image.open(io.BytesIO(data))

    if getattr(img, "is_animated", False):
        img.seek(0)

    img = img.convert("RGB")
    img.thumbnail((1024, 1024))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)

    return base64.b64encode(buf.getvalue()).decode("utf-8")


def extract_text(data: bytes, content_type: str, filename: str) -> str:
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(data))
        text = "\n".join((page.extract_text() or "") for page in reader.pages)
    else:
        text = data.decode("utf-8", errors="ignore")

    text = text.strip()

    if len(text) > MAX_PDF_CHARS:
        text = text[:MAX_PDF_CHARS]
        text += "\n[...текстът е съкратен...]"

    return text or "[Документът не съдържа извлекаем текст]"


def prepare_attachments(files: list[dict]):
    extra_text = ""
    images = []

    for f in files:
        ctype = f["content_type"]

        if ctype.startswith("image/"):
            images.append(
                {
                    "media_type": "image/jpeg",
                    "data": image_to_base64(f["data"]),
                }
            )

            extra_text += (
                f"\n\n[Прикачена снимка: {f['filename']}]"
            )

        else:
            text = extract_text(
                f["data"],
                ctype,
                f["filename"],
            )

            extra_text += (
                f"\n\n[Прикачен документ: {f['filename']}]\n"
                f"---\n{text}\n---"
            )

    return extra_text, images


def _history_messages(history):
    result = []

    for item in history[-20:]:
        role = item.get("role")

        if role not in ("user", "assistant"):
            continue

        content = item.get("content", "")

        if content:
            result.append(
                {
                    "role": role,
                    "content": content,
                }
            )

    return result


async def _stream_openai(chat, text, images):
    api_key = os.environ.get("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY липсва в environment variables"
        )

    model = MODELS["openai"][1]

    messages = [
        {
            "role": "system",
            "content": SYSTEM_MESSAGE,
        }
    ]

    messages.extend(
        _history_messages(chat.get("history", []))
    )

    if images:
        content = [
            {
                "type": "text",
                "text": text,
            }
        ]

        for image in images:
            content.append(
                {
                    "type": "image_url",
                    "image_url": {
                        "url": (
                            "data:"
                            + image["media_type"]
                            + ";base64,"
                            + image["data"]
                        )
                    },
                }
            )

        messages.append(
            {
                "role": "user",
                "content": content,
            }
        )

    else:
        messages.append(
            {
                "role": "user",
                "content": text,
            }
        )

    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    timeout = httpx.Timeout(
        120.0,
        connect=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream(
            "POST",
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
        ) as response:

            if response.status_code >= 400:
                body = await response.aread()

                raise RuntimeError(
                    "OpenAI API error "
                    f"{response.status_code}: "
                    f"{body.decode(errors='ignore')[:1000]}"
                )

            async for line in response.aiter_lines():
                if not line.startswith("data:"):
                    continue

                data = line[5:].strip()

                if not data:
                    continue

                if data == "[DONE]":
                    break

                try:
                    event = json.loads(data)
                except json.JSONDecodeError:
                    continue

                choices = event.get("choices") or []

                if not choices:
                    continue

                delta = choices[0].get("delta") or {}
                content = delta.get("content")

                if isinstance(content, str) and content:
                    yield content


async def _stream_anthropic(chat, text, images):
    api_key = os.environ.get("ANTHROPIC_API_KEY")

    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY липсва в environment variables"
        )

    model = MODELS["anthropic"][1]

    messages = _history_messages(
        chat.get("history", [])
    )

    content = []

    for image in images:
        content.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": image["media_type"],
                    "data": image["data"],
                },
            }
        )

    content.append(
        {
            "type": "text",
            "text": text,
        }
    )

    messages.append(
        {
            "role": "user",
            "content": content,
        }
    )

    payload = {
        "model": model,
        "max_tokens": 1500,
        "system": SYSTEM_MESSAGE,
        "messages": messages,
        "stream": True,
    }

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    timeout = httpx.Timeout(
        120.0,
        connect=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream(
            "POST",
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=payload,
        ) as response:

            if response.status_code >= 400:
                body = await response.aread()

                raise RuntimeError(
                    "Anthropic API error "
                    f"{response.status_code}: "
                    f"{body.decode(errors='ignore')[:1000]}"
                )

            async for line in response.aiter_lines():
                if not line.startswith("data:"):
                    continue

                raw = line[5:].strip()

                if not raw:
                    continue

                try:
                    event = json.loads(raw)
                except json.JSONDecodeError:
                    continue

                if event.get("type") != "content_block_delta":
                    continue

                delta = event.get("delta") or {}

                if delta.get("type") == "text_delta":
                    token = delta.get("text", "")

                    if token:
                        yield token


async def stream_reply(chat, text: str, images: list):
    provider = chat["provider"]

    if provider == "openai":
        async for token in _stream_openai(
            chat,
            text,
            images,
        ):
            yield token
        return

    if provider == "anthropic":
        async for token in _stream_anthropic(
            chat,
            text,
            images,
        ):
            yield token
        return

    raise RuntimeError(
        f"Unsupported AI provider: {provider}"
    )
