from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import asyncio
import hashlib
import hmac
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, APIRouter, Depends, File, HTTPException, Request, Response, UploadFile
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from starlette.middleware.cors import CORSMiddleware

import ai
import news
import storage
from auth import (
    check_lockout, create_access_token, decode_token, extract_token,
    register_failed_attempt, seed_admin, verify_password,
)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EXPOSE_API_DOCS = os.environ.get("EXPOSE_API_DOCS", "0") == "1"
app = FastAPI(
    docs_url="/docs" if EXPOSE_API_DOCS else None,
    redoc_url="/redoc" if EXPOSE_API_DOCS else None,
    openapi_url="/openapi.json" if EXPOSE_API_DOCS else None,
)
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

ALLOWED_UPLOAD_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain", "text/csv"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
CHAT_KEY_HEADER = "X-Chat-Key"


def _client_fingerprint(request: Request) -> str:
    forwarded = (request.headers.get("x-forwarded-for") or "").split(",")[0].strip()
    host = forwarded or (request.client.host if request.client else "unknown")
    return hashlib.sha256(host.encode("utf-8")).hexdigest()


async def rate_limit(request: Request, scope: str, limit: int, window_seconds: int):
    now = datetime.now(timezone.utc)
    window_id = int(now.timestamp()) // window_seconds
    key = f"{scope}:{_client_fingerprint(request)}:{window_id}"
    rec = await db.rate_limits.find_one_and_update(
        {"_id": key},
        {
            "$inc": {"count": 1},
            "$setOnInsert": {
                "expires_at": datetime.fromtimestamp((window_id + 2) * window_seconds, tz=timezone.utc),
            },
        },
        upsert=True,
        return_document=True,
    )
    if rec and rec.get("count", 0) > limit:
        raise HTTPException(status_code=429, detail="Твърде много заявки. Опитайте отново след малко.")


def _chat_key_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


async def require_chat_session(request: Request, session_id: str, create: bool = False):
    key = request.headers.get(CHAT_KEY_HEADER, "")
    if len(key) < 24 or len(key) > 200:
        raise HTTPException(status_code=401, detail="Невалидна чат сесия")

    digest = _chat_key_hash(key)
    rec = await db.chat_sessions.find_one({"session_id": session_id}, {"_id": 0})

    if rec is None and create:
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$setOnInsert": {
                    "session_id": session_id,
                    "key_hash": digest,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
            },
            upsert=True,
        )
        rec = await db.chat_sessions.find_one({"session_id": session_id}, {"_id": 0})

    if rec is None:
        raise HTTPException(status_code=404, detail="Чат сесията не е намерена")

    if not hmac.compare_digest(rec.get("key_hash", ""), digest):
        raise HTTPException(status_code=403, detail="Нямате достъп до тази чат сесия")

    return digest


# ---------- Models ----------
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


class ChatInput(BaseModel):
    session_id: str = Field(min_length=12, max_length=100, pattern=r"^s-[0-9a-fA-F-]{36}$")
    message: str = Field(min_length=1, max_length=4000)
    provider: str = Field(default="anthropic", pattern="^anthropic$")
    file_ids: List[str] = Field(default_factory=list)


class FileOut(BaseModel):
    id: str
    original_filename: str
    content_type: str
    size: int
    created_at: str
    session_id: Optional[str] = None


# ---------- Auth ----------
async def get_current_user(request: Request) -> dict:
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Не сте влезли в системата")
    payload = decode_token(token)
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Потребителят не съществува")
    return user


async def get_admin_user(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Нямате администраторски права")
    return user


def set_auth_cookie(response: Response, token: str):
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="lax", max_age=43200, path="/")


@api_router.post("/auth/login")
async def login(data: LoginInput, request: Request, response: Response):
    await rate_limit(request, "admin-login", 25, 15 * 60)
    email = data.email.lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    await check_lockout(db, identifier)
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        await register_failed_attempt(db, identifier)
        raise HTTPException(status_code=401, detail="Грешен имейл или парола")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], user["email"])
    set_auth_cookie(response, token)
    return {"user": UserOut(**user).model_dump(), "access_token": token}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Contact ----------
@api_router.get("/")
async def root():
    return {"message": "Gursel AI Portfolio API"}


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(input: ContactCreate, request: Request):
    await rate_limit(request, "contact", 10, 60 * 60)
    obj = ContactMessage(**input.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contacts(user: dict = Depends(get_admin_user)):
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


@api_router.delete("/contact/{contact_id}", status_code=204)
async def delete_contact(contact_id: str, user: dict = Depends(get_admin_user)):
    res = await db.contact_messages.delete_one({"id": contact_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Запитването не е намерено")
    return Response(status_code=204)


# ---------- Files ----------
@api_router.post("/files/upload", response_model=FileOut, status_code=201)
async def upload_file(request: Request, file: UploadFile = File(...), session_id: Optional[str] = None):
    await rate_limit(request, "file-upload", 20, 60 * 60)
    if not session_id:
        raise HTTPException(status_code=400, detail="Липсва чат сесия")
    session_key_hash = await require_chat_session(request, session_id, create=True)
    ctype = file.content_type or "application/octet-stream"
    if ctype not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(status_code=415, detail="Поддържат се само PDF, TXT, CSV, JPG, PNG и WEBP файлове")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Файлът е по-голям от 10 MB")
    if not data:
        raise HTTPException(status_code=400, detail="Празен файл")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    file_id = str(uuid.uuid4())
    path = f"{storage.APP_NAME}/uploads/{session_id or 'anonymous'}/{file_id}.{ext}"
    try:
        result = await asyncio.to_thread(storage.put_object, path, data, ctype)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Качването във файловото хранилище не успя")
    doc = {
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": ctype,
        "size": result.get("size", len(data)),
        "session_id": session_id,
        "session_key_hash": session_key_hash,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.files.insert_one(doc)
    return FileOut(**doc)


@api_router.get("/files", response_model=List[FileOut])
async def list_files(user: dict = Depends(get_admin_user)):
    docs = await db.files.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.get("/files/{file_id}/download")
async def download_file(file_id: str, user: dict = Depends(get_admin_user)):
    rec = await db.files.find_one({"id": file_id, "is_deleted": False}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=404, detail="Файлът не е намерен")
    data, ctype = await asyncio.to_thread(storage.get_object, rec["storage_path"])
    safe_name = (rec["original_filename"] or "download").replace("\r", "").replace("\n", "").replace('"', "")[:180]
    headers = {"Content-Disposition": f'attachment; filename="{safe_name}"'}
    return Response(content=data, media_type=rec.get("content_type", ctype), headers=headers)


@api_router.delete("/files/{file_id}", status_code=204)
async def delete_file(file_id: str, user: dict = Depends(get_admin_user)):
    res = await db.files.update_one({"id": file_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Файлът не е намерен")
    return Response(status_code=204)


# ---------- News ----------
@api_router.get("/news")
async def get_news(limit: int = 40):
    items = await asyncio.to_thread(news.get_news, min(max(limit, 1), 100))
    return {"items": items, "cached_at": news._cache["ts"]}


# ---------- AI chat ----------
@api_router.get("/chat/sessions")
async def chat_sessions(user: dict = Depends(get_admin_user)):
    pipeline = [
        {"$sort": {"created_at": 1}},
        {"$group": {
            "_id": "$session_id",
            "count": {"$sum": 1},
            "first_at": {"$first": "$created_at"},
            "last_at": {"$last": "$created_at"},
            "providers": {"$addToSet": "$provider"},
            "preview": {"$first": {"$cond": [{"$eq": ["$role", "user"]}, "$content", None]}},
            "messages": {"$push": {"role": "$role", "content": "$content"}},
        }},
        {"$sort": {"last_at": -1}},
        {"$limit": 200},
    ]
    out = []
    async for g in db.chat_messages.aggregate(pipeline):
        preview = next((m["content"] for m in g["messages"] if m["role"] == "user"), "")
        out.append({
            "session_id": g["_id"], "count": g["count"], "first_at": g["first_at"], "last_at": g["last_at"],
            "providers": g["providers"], "preview": preview[:160],
        })
    return out


@api_router.get("/chat/sessions/{session_id}")
async def chat_session_detail(session_id: str, user: dict = Depends(get_admin_user)):
    docs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(500)
    if not docs:
        raise HTTPException(status_code=404, detail="Разговорът не е намерен")
    return docs


@api_router.delete("/chat/sessions/{session_id}", status_code=204)
async def chat_session_delete(session_id: str, user: dict = Depends(get_admin_user)):
    await db.chat_messages.delete_many({"session_id": session_id})
    for p in ai.MODELS:
        ai.drop_chat(session_id, p)
    return Response(status_code=204)


@api_router.get("/chat/models")
async def chat_models():
    return [{"id": k, "label": v[2], "model": v[1]} for k, v in ai.MODELS.items()]


@api_router.get("/chat/{session_id}/messages")
async def chat_history(session_id: str, request: Request):
    session_key_hash = await require_chat_session(request, session_id, create=False)
    docs = await db.chat_messages.find(
        {"session_id": session_id, "session_key_hash": session_key_hash},
        {"_id": 0},
    ).sort("created_at", 1).to_list(200)
    return docs


@api_router.delete("/chat/{session_id}", status_code=204)
async def chat_clear(session_id: str, request: Request):
    session_key_hash = await require_chat_session(request, session_id, create=False)
    await db.chat_messages.delete_many({"session_id": session_id, "session_key_hash": session_key_hash})
    await db.files.update_many(
        {"session_id": session_id, "session_key_hash": session_key_hash},
        {"$set": {"is_deleted": True}},
    )
    await db.chat_sessions.delete_one({"session_id": session_id})
    for p in ai.MODELS:
        ai.drop_chat(session_id, p)
    return Response(status_code=204)


@api_router.post("/chat")
async def chat(input: ChatInput, request: Request):
    await rate_limit(request, "chat", 60, 10 * 60)
    session_key_hash = await require_chat_session(request, input.session_id, create=True)
    history = await db.chat_messages.find(
        {"session_id": input.session_id, "session_key_hash": session_key_hash},
        {"_id": 0},
    ).sort("created_at", 1).to_list(200)

    files = []
    for fid in input.file_ids[:5]:
        rec = await db.files.find_one(
            {
                "id": fid,
                "session_id": input.session_id,
                "session_key_hash": session_key_hash,
                "is_deleted": False,
            },
            {"_id": 0},
        )
        if not rec:
            continue
        data, _ = await asyncio.to_thread(storage.get_object, rec["storage_path"])
        files.append({"data": data, "content_type": rec["content_type"], "filename": rec["original_filename"]})

    try:
        extra_text, images = await asyncio.to_thread(ai.prepare_attachments, files)
    except Exception as e:
        logger.warning(f"Attachment processing rejected: {e}")
        raise HTTPException(status_code=400, detail="Прикаченият файл не може да бъде обработен")

    attachments = [{"id": f, "name": n["filename"]} for f, n in zip(input.file_ids, files)]
    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()), "session_id": input.session_id, "session_key_hash": session_key_hash,
        "role": "user", "content": input.message, "provider": input.provider,
        "attachments": attachments, "created_at": now,
    })

    chat_obj = ai.build_chat(input.session_id, input.provider, history)
    label = ai.MODELS[input.provider][2]

    async def event_stream():
        full = []
        try:
            async for token in ai.stream_reply(chat_obj, input.message + extra_text, images):
                full.append(token)
                yield f"data: {json.dumps({'delta': token})}\n\n"
        except Exception as e:
            logger.error(f"LLM stream error ({input.provider}): {e}")
            ai.drop_chat(input.session_id, input.provider)
            yield f"data: {json.dumps({'error': 'AI моделът не отговори. Моля, опитайте отново.'})}\n\n"
            return
        text = "".join(full)
        await db.chat_messages.insert_one({
            "id": str(uuid.uuid4()), "session_id": input.session_id, "session_key_hash": session_key_hash,
            "role": "assistant", "content": text, "provider": input.provider,
            "model_label": label, "attachments": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        yield f"data: {json.dumps({'done': True, 'model_label': label})}\n\n"

    return StreamingResponse(
        event_stream(), media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


app.include_router(api_router)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
    response.headers.setdefault("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
    if request.url.scheme == "https":
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS",
        "https://my-site-new-neon.vercel.app,http://localhost:3000"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Chat-Key"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.rate_limits.create_index("expires_at", expireAfterSeconds=0)
    await db.chat_sessions.create_index("session_id", unique=True)
    await db.chat_messages.create_index([("session_id", 1), ("created_at", 1)])
    await seed_admin(db)
    try:
        await asyncio.to_thread(storage.init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
