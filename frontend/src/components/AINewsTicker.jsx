import { useEffect, useRef, useState } from "react";
import { Pause, Play, Radio } from "lucide-react";

const REFRESH_MS = 3 * 60 * 60 * 1000;
const STORAGE_KEY = "gursel-ai-news-bg-v2";
const safeLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["news.google.com", "openai.com", "www.openai.com"].includes(url.hostname) ? url.href : null;
  } catch { return null; }
};

const readFeed = (xml) => {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid RSS");
  const seen = new Set();
  return Array.from(doc.querySelectorAll("item")).map(item => {
    const text = tag => item.querySelector(tag)?.textContent?.trim() || "";
    const url = safeLink(text("link"));
    const source = text("source") || "Новини";
    let title = text("title");
    if (title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
    return { title: title.slice(0, 350), url, source: source.slice(0, 80), date: text("pubDate") };
  }).filter(item => {
    if (!/[А-Яа-я]/.test(item.title) || !item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)).slice(0, 15);
};

export default function AINewsTicker() {
  const [items, setItems] = useState([]);
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [duration, setDuration] = useState(180);
  const groupRef = useRef(null);

  useEffect(() => {
    let active = true;
    let busy = false;
    let lastFetch = 0;
    let controller;
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (cached && Array.isArray(cached.items)) {
        const valid = cached.items.filter(i => typeof i.title === "string" && /[А-Яа-я]/.test(i.title) && typeof i.source === "string" && safeLink(i.url)).slice(0, 15);
        if (valid.length) { setItems(valid); setUpdated(cached.updated); }
      }
    } catch { /* Storage is optional. */ }
    const refresh = async () => {
      if (busy || !active) return;
      busy = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch("/api/ai-news?language=bg-v2", { signal: controller.signal });
        if (!response.ok) throw new Error("RSS unavailable");
        const news = readFeed(await response.text());
        if (!news.length) throw new Error("Empty RSS");
        if (!active) return;
        const stamp = response.headers.get("X-News-Updated-At") || new Date().toISOString();
        lastFetch = Date.now();
        setItems(news); setUpdated(stamp); setUnavailable(false);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: news, updated: stamp })); } catch { /* Optional cache. */ }
      } catch {
        if (active) setUnavailable(true);
      } finally { clearTimeout(timeout); busy = false; }
    };
    refresh();
    // Check often, fetch only every three hours; retry a failed feed after five minutes.
    const tick = () => {
      if (!document.hidden && Date.now() - lastFetch >= REFRESH_MS) refresh();
    };
    const timer = setInterval(tick, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", tick);
    return () => { active = false; controller?.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const measure = () => setDuration(Math.max(45, group.getBoundingClientRect().width / 36));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    return () => observer.disconnect();
  }, [items]);

  const group = (duplicate = false) => (
    <div className="ai-news-group" ref={duplicate ? undefined : groupRef} aria-hidden={duplicate || undefined}>
      {items.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : 0} className="ai-news-link">
        <span className="ai-news-source">{item.source}</span>
        <span>{item.title}</span><span className="ai-news-dot" aria-hidden="true">✦</span>
      </a>)}
    </div>
  );
  const updatedDate = updated ? new Date(updated) : null;
  const updatedLabel = updatedDate && !Number.isNaN(updatedDate.getTime()) ? updatedDate.toLocaleString("bg-BG") : "";
  return (
    <aside className={`ai-news-ribbon ${paused ? "is-paused" : ""}`} aria-label="Последни новини за изкуствен интелект" data-testid="ai-news-ribbon">
      <div className="ai-news-badge" title={`Обновяване на всеки 3 часа. ${updatedLabel ? "Последно: " + updatedLabel : ""} ${unavailable && items.length ? "Показват се последните запазени новини." : ""}`}>
        <Radio size={16} aria-hidden="true" /><span>AI НОВИНИ</span>
        {unavailable && items.length > 0 && <span className="ai-news-cached">запазени</span>}
      </div>
      <div className="ai-news-window">
        {items.length ? <div className="ai-news-track" style={{ animationDuration: `${duration}s` }}>{group()}{group(true)}</div>
          : <p className="ai-news-status" role="status">{unavailable ? "Новините временно не са достъпни. Ще опитаме отново." : "Зареждане на последните AI новини…"}</p>}
      </div>
      <button type="button" className="ai-news-pause" disabled={!items.length} onClick={() => setPaused(value => !value)} aria-label={paused ? "Пусни лентата с AI новини" : "Пауза на лентата с AI новини"} aria-pressed={paused}>
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>
    </aside>
  );
}
