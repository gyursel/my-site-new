import axios from "axios";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
export const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "gi-admin-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeaders() };
  return config;
});

export const formatApiError = (err, fallback = "Нещо се обърка. Опитайте отново.") => {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return detail?.msg || String(detail);
};

export async function streamChat({ sessionId, sessionKey, message, provider, fileIds, onDelta, onDone, onError, signal }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 65000);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener("abort", forwardAbort, { once: true });
  let completed = false;
  let receivedText = false;

  try {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Chat-Key": sessionKey,
        ...authHeaders(),
      },
      body: JSON.stringify({ session_id: sessionId, message, provider, file_ids: fileIds }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = await res.json();
        detail = typeof body.detail === "string" ? body.detail : "";
      } catch {}
      const message = res.status === 429
        ? "Има твърде много заявки. Опитай отново след малко."
        : res.status === 401 || res.status === 403
          ? "Сесията на чата е невалидна. Натисни „Изчисти“ и опитай отново."
          : res.status >= 500
            ? "AI сървърът има временен проблем. Опитай отново след малко."
            : detail || `Връзката не успя (HTTP ${res.status}).`;
      onError?.(message);
      return false;
    }
    if (!res.body) {
      onError?.("Сървърът не върна отговор.");
      return false;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const processEvent = (block) => {
      const line = block.split("\n").find((part) => part.trimStart().startsWith("data:"));
      if (!line) return;
      let payload;
      try {
        payload = JSON.parse(line.slice(line.indexOf("data:") + 5).trim());
      } catch { return; }
      if (payload.delta) {
        receivedText = true;
        onDelta?.(payload.delta);
      }
      if (payload.error) {
        onError?.(payload.error);
      }
      if (payload.done) {
        completed = true;
        onDone?.(payload);
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";
      for (const event of events) processEvent(event);
    }
    buffer += decoder.decode();
    if (buffer.trim()) processEvent(buffer);
    if (!completed && !receivedText) {
      onError?.("AI асистентът не върна отговор. Опитай отново.");
      return false;
    }
    return receivedText;
  } catch (err) {
    onError?.(err?.name === "AbortError"
      ? "Отговорът се забави прекалено много. Опитай отново."
      : "Неуспешна връзка с AI сървъра. Провери връзката и опитай пак.");
    return false;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
