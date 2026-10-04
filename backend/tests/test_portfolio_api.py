"""Regression tests for portfolio backend: root, contact, and chat SSE flows."""

import json
import os
import uuid

import pytest
import requests
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv("/app/frontend/.env")
load_dotenv("/app/backend/.env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")


@pytest.fixture(scope="module")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def mongo_db():
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    try:
        yield db
    finally:
        client.close()


@pytest.fixture(scope="module")
def test_marker():
    return f"TEST_PORTFOLIO_{uuid.uuid4().hex[:10]}"


@pytest.fixture(scope="module", autouse=True)
def cleanup_test_data(mongo_db, test_marker):
    yield
    mongo_db.contact_messages.delete_many({"message": {"$regex": test_marker}})
    mongo_db.chat_messages.delete_many({"session_id": {"$regex": test_marker}})


def _collect_sse_text(response):
    chunks = []
    full = ""
    event_types = []
    for raw_line in response.iter_lines(decode_unicode=True):
        if not raw_line:
            continue
        if not raw_line.startswith("data:"):
            continue
        payload = raw_line[5:].strip()
        try:
            evt = json.loads(payload)
        except json.JSONDecodeError:
            continue
        event_types.append(evt.get("type"))
        if evt.get("type") == "delta":
            text = evt.get("content", "")
            chunks.append(text)
            full += text
        if evt.get("type") == "done":
            break
    return full, event_types, chunks


class TestPortfolioApi:
    # Root and status
    def test_api_root(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "service" in data and isinstance(data["service"], str)

    # Contact validation and persistence
    def test_contact_invalid_email_blocked(self, api_client, test_marker):
        payload = {
            "name": "Test User",
            "email": "not-an-email",
            "project_type": "Уебсайт",
            "message": f"{test_marker} invalid email should fail validation",
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422
        body = response.json()
        assert "detail" in body

    def test_contact_create_and_verify_in_mongo(self, api_client, mongo_db, test_marker):
        payload = {
            "name": "Test Portfolio",
            "email": "palette-test@example.com",
            "project_type": "Уебсайт",
            "message": f"{test_marker} valid inquiry from pytest",
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] is True
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "Благодарим" in data["message"]

        doc = mongo_db.contact_messages.find_one({"message": payload["message"]})
        assert doc is not None
        assert doc["email"] == payload["email"]
        assert doc["name"] == payload["name"]

    # SSE chat and context continuity
    def test_chat_sse_first_turn_bulgarian(self, api_client, test_marker):
        session_id = f"{test_marker}_chat"
        payload = {
            "session_id": session_id,
            "message": "Какви услуги предлагаш? Отговори кратко на български.",
        }
        response = api_client.post(f"{BASE_URL}/api/chat", json=payload, stream=True)
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")

        full, event_types, chunks = _collect_sse_text(response)
        assert "delta" in event_types
        assert "done" in event_types
        assert len(chunks) > 0
        assert len(full.strip()) > 0
        assert any("а" <= ch.lower() <= "я" for ch in full)

    def test_chat_sse_second_turn_and_persisted_history(self, api_client, mongo_db, test_marker):
        session_id = f"{test_marker}_chat"
        payload = {
            "session_id": session_id,
            "message": "Може ли и Android, и iOS приложение от един човек?",
        }
        response = api_client.post(f"{BASE_URL}/api/chat", json=payload, stream=True)
        assert response.status_code == 200

        full, event_types, _ = _collect_sse_text(response)
        assert "done" in event_types
        assert len(full.strip()) > 0

        docs = list(mongo_db.chat_messages.find({"session_id": session_id}))
        assert len(docs) >= 4
        roles = [d.get("role") for d in docs]
        assert "user" in roles
        assert "assistant" in roles
