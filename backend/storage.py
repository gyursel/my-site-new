import os

from bson.binary import Binary
from pymongo import MongoClient


APP_NAME = "gursel-portfolio"

_client = None
_collection = None


def init_storage(force: bool = False):
    global _client, _collection

    if _collection is not None and not force:
        return _collection

    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]

    _client = MongoClient(
        mongo_url,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
    )

    # Проверка на връзката с MongoDB Atlas
    _client.admin.command("ping")

    db = _client[db_name]
    _collection = db["object_storage"]

    return _collection


def put_object(path: str, data: bytes, content_type: str) -> dict:
    collection = init_storage()

    collection.update_one(
        {"_id": path},
        {
            "$set": {
                "data": Binary(data),
                "content_type": content_type,
                "size": len(data),
            }
        },
        upsert=True,
    )

    return {
        "path": path,
        "size": len(data),
        "content_type": content_type,
    }


def get_object(path: str) -> tuple[bytes, str]:
    collection = init_storage()

    obj = collection.find_one({"_id": path})

    if not obj:
        raise FileNotFoundError(f"Object not found: {path}")

    return (
        bytes(obj["data"]),
        obj.get("content_type", "application/octet-stream"),
    )
