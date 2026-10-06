import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronDown, Loader2, Trash2, Bot, User, Paperclip } from "lucide-react";
import { api, formatApiError } from "../lib/api";

const fmtDate = (iso) => new Date(iso).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short" });
const LABEL = { openai: "ChatGPT", anthropic: "Claude" };

const SessionMessages = ({ sessionId }) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    api.get(`/chat/sessions/${sessionId}`).then((r) => setMessages(r.data)).catch(() => setMessages([]));
  }, [sessionId]);

  if (!messages) return <Loader2 className="my-4 h-4 w-4 animate-spin text-[#C9A0FF]" />;
  return (
    <div className="mt-4 space-y-3 border-t border-white/10 pt-4" data-testid="admin-chat-messages">
      {messages.map((m) => (
        <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "" : "flex-row-reverse"}`} data-testid={`admin-chat-message-${m.role}`}>
          <span className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-white/10 text-white" : "bg-[#8B3DFF]/30 text-[#C9A0FF]"}`}>
            {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
          </span>
          <div className={`max-w-[80%] ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
            <p className="whitespace-pre-wrap">{m.content || <span className="text-white/40">[празен отговор]</span>}</p>
            {m.attachments?.length > 0 && (
              <p className="mt-2 flex flex-wrap gap-2">
                {m.attachments.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1 font-mono text-[10px] text-white/70"><Paperclip className="h-3 w-3" />{a.name}</span>
                ))}
              </p>
            )}
            <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-white/40">
              {m.role === "assistant" ? m.model_label || LABEL[m.provider] : "Посетител"} · {fmtDate(m.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminChatLogs = () => {
  const [sessions, setSessions] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get("/chat/sessions").then((r) => setSessions(r.data)).catch((e) => { toast.error(formatApiError(e)); setSessions([]); });
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/chat/sessions/${id}`);
      setSessions((s) => s.filter((x) => x.session_id !== id));
      if (openId === id) setOpenId(null);
      toast.success("Разговорът е изтрит.");
    } catch (e) { toast.error(formatApiError(e)); }
  };

  if (!sessions) return <Loader2 className="mt-8 h-5 w-5 animate-spin text-[#C9A0FF]" data-testid="admin-chats-loading" />;

  return (
    <section className="mt-6 space-y-3" data-testid="admin-chats-list">
      {sessions.length === 0 && <p className="text-sm text-white/50" data-testid="admin-chats-empty">Все още няма разговори с AI асистента.</p>}
      {sessions.map((s) => {
        const expanded = openId === s.session_id;
        return (
          <article key={s.session_id} className="glass-card p-5" data-testid="admin-chat-session">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button type="button" onClick={() => setOpenId(expanded ? null : s.session_id)} className="min-w-0 flex-1 text-left" aria-expanded={expanded} data-testid="admin-chat-session-toggle">
                <p className="truncate text-sm font-bold">{s.preview || "(без текст)"}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-[10px] text-white/40">
                  <span>{s.count} съобщения</span>
                  <span>{s.providers.filter(Boolean).map((p) => LABEL[p] || p).join(" · ")}</span>
                  <span>{fmtDate(s.last_at)}</span>
                  <span className="truncate text-white/25">{s.session_id}</span>
                </p>
              </button>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setOpenId(expanded ? null : s.session_id)} className="icon-btn text-white/60 hover:text-[#C9A0FF]" aria-label={expanded ? "Скрий разговора" : "Покажи разговора"} data-testid="admin-chat-expand">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </button>
                <button type="button" onClick={() => remove(s.session_id)} className="icon-btn text-white/40 hover:text-red-300" aria-label="Изтрий разговора" data-testid="admin-chat-delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <SessionMessages sessionId={s.session_id} />
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </section>
  );
};
