import { useRef, useState } from "react";
import { streamChat } from "@/lib/api";

const GREETING = "Здравейте! Аз съм AI асистентът на Гюрсел. Мога да разкажа за услугите, начина на работа и как да започнете вашия проект. С какво да помогна?";

export const usePortfolioChat = () => {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [streaming, setStreaming] = useState(false);
  const pending = useRef(false);
  const session = useRef(null);
  const send = async (text) => {
    const message = text.trim();
    if (!message || pending.current) return;
    pending.current = true;
    setStreaming(true);
    setMessages((current) => [...current, { role: "user", content: message }, { role: "assistant", content: "" }]);
    let answer = "";
    const update = (content) => setMessages((current) => [...current.slice(0, -1), { role: "assistant", content }]);
    try {
      if (!session.current) {
        try { session.current = localStorage.getItem("gursel-chat-session"); } catch { /* Storage may be unavailable in private browsers. */ }
        if (!session.current) session.current = crypto.randomUUID();
        try { localStorage.setItem("gursel-chat-session", session.current); } catch { /* Keep this session in memory instead. */ }
      }
      await streamChat({ session_id: session.current, message }, {
        onDelta: (delta) => { answer += delta; update(answer); },
        onDone: () => {},
        onError: (error) => update(answer || error),
      });
    } catch {
      update(answer || "Няма връзка със сървъра. Опитайте отново.");
    } finally {
      pending.current = false;
      setStreaming(false);
    }
  };
  return { messages, streaming, send };
};