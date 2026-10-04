import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export async function streamChat(payload, { onDelta, onDone, onError }) {
  let res;
  try {
    res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    onError("Няма връзка със сървъра. Опитайте отново.");
    return;
  }
  if (!res.ok || !res.body) {
    onError("Сървърът не отговори. Опитайте отново след малко.");
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const raw = buffer.slice(0, sep).trim();
        buffer = buffer.slice(sep + 2);
        if (!raw.startsWith("data:")) continue;
        const evt = JSON.parse(raw.slice(5).trim());
        if (evt.type === "delta") onDelta(evt.content);
        else if (evt.type === "error") onError(evt.content);
        else if (evt.type === "done") onDone();
      }
    }
  } catch (e) {
    onError("Връзката прекъсна. Опитайте отново.");
  }
}