import base64
import io
import os

from PIL import Image
from pypdf import PdfReader
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent, TextDelta, StreamDone

MODELS = {
    "openai": ("openai", "gpt-5.4", "ChatGPT"),
    "anthropic": ("anthropic", "claude-sonnet-5-5", "Claude"),
}

SYSTEM_MESSAGE = """Ти си AI асистентът на уебсайта на Гюрсел Исмаилов — независим разработчик, който създава AI чатботове, AI агенти, автоматизации и умни мобилни/уеб приложения за бизнеса.

Какво прави Гюрсел:
- AI чатботове и асистенти (RAG върху документите на клиента, поддръжка 24/7, продажби, вътрешен помощник)
- AI агенти и автоматизации (подготовка на оферти, сортиране на имейли, попълване на данни, свързване на системи)
- Анализ на документи (фактури, договори, PDF — извличане на данни, резюмета, търсене на отговори)
- Компютърно зрение (разпознаване на обекти, текст и продукти през камерата на телефона)
- AI в мобилни приложения (Android/Kotlin/Jetpack Compose, iOS/Swift/SwiftUI — персонализация, гласови команди, препоръки)
- Уеб приложения (React, TypeScript, FastAPI, Node.js, MongoDB) и публикуване в Play Store / App Store
- Технологии: OpenAI, Claude, Gemini, RAG, Python, Kotlin, Swift, React

Правила:
- Отговаряй винаги на български език, кратко, ясно и приятелски. Използвай прости изречения, без излишен жаргон.
- Помагай на посетителя да разбере как AI може да е полезен за неговия бизнес и предлагай конкретни идеи.
- Ако посетителят прикачи документ или снимка, анализирай съдържанието и дай полезно резюме или извлечени данни — това е демонстрация на услугите „Анализ на документи“ и „Компютърно зрение“.
- При интерес към проект насочвай към формата „Контакти“ на сайта или бутона „Свържи се“.
- Не измисляй цени; кажи, че цената зависи от обхвата и се уточнява след кратка консултация.
"""

MAX_PDF_CHARS = 15000
_CHATS: dict[tuple[str, str], LlmChat] = {}


def build_chat(session_id: str, provider: str, history: list[dict]) -> LlmChat:
    key = (session_id, provider)
    if key in _CHATS:
        return _CHATS[key]
    system = SYSTEM_MESSAGE
    if history:
        lines = "\n".join(f"{'Посетител' if m['role'] == 'user' else 'Асистент'}: {m['content']}" for m in history[-20:])
        system += f"\n\nДосегашен разговор (за контекст):\n{lines}"
    prov, model, _ = MODELS[provider]
    chat = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=f"{session_id}-{provider}", system_message=system)
    chat.with_model(prov, model)
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
        text = text[:MAX_PDF_CHARS] + "\n[...текстът е съкратен...]"
    return text or "[Документът не съдържа извлекаем текст]"


def prepare_attachments(files: list[dict]) -> tuple[str, list[ImageContent]]:
    extra_text = ""
    images: list[ImageContent] = []
    for f in files:
        ctype = f["content_type"]
        if ctype.startswith("image/"):
            images.append(ImageContent(image_base64=image_to_base64(f["data"])))
            extra_text += f"\n\n[Прикачена снимка: {f['filename']}]"
        else:
            extra_text += f"\n\n[Прикачен документ: {f['filename']}]\n---\n{extract_text(f['data'], ctype, f['filename'])}\n---"
    return extra_text, images


async def stream_reply(chat: LlmChat, text: str, images: list[ImageContent]):
    msg = UserMessage(text=text, file_contents=images or None)
    async for ev in chat.stream_message(msg):
        if isinstance(ev, TextDelta):
            yield ev.content
        elif isinstance(ev, StreamDone):
            break
