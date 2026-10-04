from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, EmailStr
from typing import List, Optional, Annotated, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId
import os
import uuid
import json
import logging
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Mongo document helpers ----------
def _coerce_oid(v):
    return str(v)


PyObjectId = Annotated[str, BeforeValidator(_coerce_oid)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self):
        data = json.loads(self.model_dump_json(by_alias=True, exclude_none=True))
        data = {k: v for k, v in data.items() if v is not None}
        if not data.get("_id"):
            data["_id"] = ObjectId()
        return data

    @classmethod
    def from_mongo(cls, doc):
        if not doc:
            return None
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id", None) or doc.get("id"))
        return cls(**doc)


# ---------- Models ----------
class StatusCheck(BaseDocument):
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    project_type: str = Field(default="Друго", max_length=60)
    message: str = Field(min_length=10, max_length=5000)


class ContactResponse(BaseModel):
    ok: bool
    id: Optional[str] = None
    message: str


class ChatMessageDoc(BaseDocument):
    session_id: str
    role: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactDoc(BaseDocument):
    name: str
    email: str
    project_type: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=6, max_length=80)
    message: str = Field(min_length=1, max_length=2000)


# ---------- AI assistant ----------
CHAT_SYSTEM_PROMPT = """Ти си AI асистентът на официалния сайт на Гюрсел Исмаилов — фрийлансър разработчик, който създава:
1) Android приложения (Kotlin, Jetpack Compose, Material 3, публикуване в Google Play);
2) iOS приложения (Swift, SwiftUI, публикуване в App Store);
3) уебсайтове и уеб приложения (React, Tailwind CSS, бекенд със FastAPI/Node.js, SEO оптимизация).

Правила:
- Винаги отговаряй на български.
- Бъди кратък, професионален и приветлив (обикновено 2-5 изречения, позволени са кратки списъци).
- Представяш услугите и начина на работа на Гюрсел и помагаш на потенциални клиенти да формулират запитването си.
- НЕ измисляй конкретни цени, срокове, имена на клиенти, награди или статистики. При въпрос за цена обясни, че тя зависи от обема и функционалността, и насърчи клиента да опише идеята си чрез контактната форма на сайта или на имейл.
- Контактни данни: имейл: hello@gursel.dev; телефон: +359 88 000 0000; локация: София, България (работи и дистанционно).
- Ако въпросът е извън обхвата, отговори любезно и кратко и върни разговора към услугите и следващите стъпки."""


@api_router.get("/")
async def root():
    return {"status": "ok", "service": "Гюрсел Исмаилов — портфолио API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    _ = await db.status_checks.insert_one(status_obj.to_mongo())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().to_list(1000)
    return [StatusCheck.from_mongo(d) for d in docs]


@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(input: ContactCreate):
    contact = ContactDoc(
        name=input.name.strip(),
        email=str(input.email),
        project_type=input.project_type,
        message=input.message.strip(),
    )
    result = await db.contact_messages.insert_one(contact.to_mongo())
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Записът не бе създаден")
    return ContactResponse(
        ok=True,
        id=str(result.inserted_id),
        message="Благодарим! Ще се свържа с вас възможно най-скоро.",
    )


@api_router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # Prior turns (chronological), then persist the new user message
    prior_docs = await db.chat_messages.find(
        {"session_id": req.session_id}, {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    prior_msgs = [
        {"role": d["role"], "content": d["content"]} for d in reversed(prior_docs)
    ]
    await db.chat_messages.insert_one(
        ChatMessageDoc(session_id=req.session_id, role="user", content=req.message).to_mongo()
    )

    async def event_stream():
        full_reply = ""
        try:
            chat = (
                LlmChat(
                    api_key=os.environ["EMERGENT_LLM_KEY"],
                    session_id=f"portfolio-{req.session_id}",
                    system_message=CHAT_SYSTEM_PROMPT,
                    initial_messages=prior_msgs,
                )
                .with_model("anthropic", "claude-sonnet-5-5")
            )
            async for event in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(event, TextDelta):
                    full_reply += event.content
                    yield f"data: {json.dumps({'type': 'delta', 'content': event.content}, ensure_ascii=False)}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception as e:
            logger.error(f"Chat error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': 'Възникна грешка при отговора. Моля, опитайте отново.'}, ensure_ascii=False)}\n\n"

        if full_reply:
            try:
                await db.chat_messages.insert_one(
                    ChatMessageDoc(session_id=req.session_id, role="assistant", content=full_reply).to_mongo()
                )
            except Exception as e:
                logger.error(f"Failed to persist assistant message: {e}")
        yield f"data: {json.dumps({'type': 'done'}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()