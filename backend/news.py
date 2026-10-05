import html
import re
import time
from concurrent.futures import ThreadPoolExecutor
from email.utils import parsedate_to_datetime

import requests

FEEDS = [
    ("Actualno", "https://www.actualno.com/rss"),
    ("24 часа", "https://www.24chasa.bg/rss"),
    ("Vesti.bg", "https://www.vesti.bg/rss"),
    ("Дневник", "https://www.dnevnik.bg/rss/"),
    ("Капитал", "https://www.capital.bg/rss/"),
]

SLUG_CATEGORIES = {
    "sviat": "Свят", "svyat": "Свят", "world": "Свят", "mezhdunarodni": "Свят",
    "bulgaria": "България", "bylgaria": "България", "balgaria": "България",
    "politika": "Политика", "politics": "Политика", "politika_i_ikonomika": "Политика",
    "ikonomika": "Икономика", "biznes": "Бизнес", "business": "Бизнес", "pari": "Пари",
    "sport": "Спорт", "tehnologii": "Технологии", "technology": "Технологии", "tech": "Технологии",
    "krimi": "Крими", "crime": "Крими", "obshtestvo": "Общество", "kultura": "Култура",
    "zdrave": "Здраве", "healthy": "Здраве", "obrazovanie": "Образование", "nauka": "Наука",
    "lifestyle": "Лайфстайл", "mneniya": "Мнения", "analizi": "Анализи", "evropa": "Европа",
}

TAG_RE = re.compile(r"<[^>]+>")
CACHE_TTL = 600
_cache = {"ts": 0.0, "items": []}


def _clean(text: str) -> str:
    return html.unescape(TAG_RE.sub("", text or "")).strip()


def _category(raw: str, link: str) -> str:
    raw = _clean(raw)
    if raw and not raw.isdigit():
        return raw
    for seg in link.split("/")[3:6]:
        if seg in SLUG_CATEGORIES:
            return SLUG_CATEGORIES[seg]
    return "Новини"


def _fetch(source: str, url: str) -> list[dict]:
    import xml.etree.ElementTree as ET
    resp = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0 (compatible; GurselNewsBot/1.0)"})
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    items = []
    for it in root.iter("item"):
        title = _clean(it.findtext("title") or "")
        link = (it.findtext("link") or "").strip()
        if not title or not link:
            continue
        pub = it.findtext("pubDate") or ""
        try:
            ts = parsedate_to_datetime(pub).timestamp()
        except Exception:
            ts = 0.0
        items.append({
            "title": title,
            "link": link,
            "source": source,
            "category": _category(it.findtext("category") or "", link),
            "published": pub,
            "_ts": ts,
        })
        if len(items) >= 12:
            break
    return items


def get_news(limit: int = 40) -> list[dict]:
    now = time.time()
    if _cache["items"] and now - _cache["ts"] < CACHE_TTL:
        return _cache["items"][:limit]
    merged: list[dict] = []
    with ThreadPoolExecutor(max_workers=len(FEEDS)) as pool:
        for res in pool.map(lambda f: _safe_fetch(*f), FEEDS):
            merged.extend(res)
    if not merged:
        return _cache["items"][:limit]
    merged.sort(key=lambda x: x["_ts"], reverse=True)
    seen, out = set(), []
    for m in merged:
        key = m["title"].lower()
        if key in seen:
            continue
        seen.add(key)
        out.append({k: v for k, v in m.items() if k != "_ts"})
    _cache["items"] = out
    _cache["ts"] = now
    return out[:limit]


def _safe_fetch(source: str, url: str) -> list[dict]:
    try:
        return _fetch(source, url)
    except Exception:
        return []
