import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { MessageCircle, X, Send, Paperclip, Loader2, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { api, formatApiError, streamChat } from "../lib/api";
import { ChatMessage } from "./ChatMessage";

const PROVIDERS = [
  { id: "openai", label: "ChatGPT" },
  { id: "anthropic", label: "Claude" },
];

const SUGGESTIONS = [
  "Какво е RAG чатбот?",
  "Колко време отнема един AI проект?",
  "Как AI може да помогне на моя бизнес?",
];

export const ChatWidget = () => {
  const { open, setOpen, draft, setDraft, sessionId, resetSession } = useChat();
  const [provider, setProvider] = useState("openai");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/${sessionId}/messages`).then((r) => setMessages(r.data)).catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    if (draft) {
      setInput(draft);
      setDraft("");
    }
  }, [draft, setDraft]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post(`/files/upload?session_id=${sessionId}`, form);
      setFiles((f) => [...f, data]);
    } catch (err) {
      toast.error(formatApiError(err, "Файлът не беше качен."));
    } finally {
      setUploading(false);
    }
  };

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const attachments = files.map((f) => ({ id: f.id, name: f.original_filename }));
    setInput("");
    setFiles([]);
    setBusy(true);
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", content, attachments },
      { id: `a-${Date.now()}`, role: "assistant", content: "", provider, streaming: true },
    ]);
    const append = (delta) =>
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: last.content + delta };
        return copy;
      });
    try {
      await streamChat({
        sessionId,
        message: content,
        provider,
        fileIds: attachments.map((a) => a.id),
        onDelta: append,
        onError: (msg) => toast.error(msg),
        onDone: (p) =>
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false, model_label: p.model_label };
            return copy;
          }),
      });
    } catch {
      toast.error("Връзката с AI асистента се прекъсна.");
    } finally {
      setBusy(false);
      setMessages((m) => m.map((x) => ({ ...x, streaming: false })));
    }
  };

  const clear = async () => {
    await api.delete(`/chat/${sessionId}`).catch(() => {});
    setMessages([]);
    resetSession();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="chat-fab fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_0_30px_rgba(139,61,255,0.6)] transition-[transform,box-shadow] duration-300 hover:scale-110 hover:shadow-[0_0_45px_rgba(177,108,255,0.9)] active:scale-95"
        style={{ background: "linear-gradient(135deg, #B16CFF, #7A2BFF)" }}
        aria-label={open ? "Затвори AI чата" : "Отвори AI чата"}
        data-testid="chat-toggle-button"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass-panel fixed bottom-24 right-5 z-50 flex h-[min(620px,calc(100vh-7rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden"
            data-testid="chat-panel"
            role="dialog"
            aria-label="AI асистент"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-bold">AI асистент</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#B16CFF]/80">Гюрсел Исмаилов</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1" data-testid="chat-provider-switch">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id)}
                    disabled={busy}
                    className={`tab-pill ${provider === p.id ? "text-white" : "text-white/60 hover:text-white"}`}
                    data-testid={`chat-provider-${p.id}`}
                    aria-pressed={provider === p.id}
                  >
                    {provider === p.id && (
                      <motion.span layoutId="chat-provider-indicator" className="tab-pill-indicator" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                    <span className="relative z-10">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-messages">
              {messages.length === 0 && (
                <div className="space-y-3" data-testid="chat-empty-state">
                  <div className="chat-bubble-ai">
                    Здравейте! Аз съм AI асистентът на Гюрсел. Питайте ме как изкуственият интелект може да помогне на вашия бизнес — или прикачете PDF/снимка за демонстрация на анализ.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" className="chip" onClick={() => send(s)} data-testid="chat-suggestion">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2" data-testid="chat-attachments">
                {files.map((f) => (
                  <span key={f.id} className="chip gap-1.5">
                    {f.content_type.startsWith("image/") ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    <span className="max-w-[140px] truncate">{f.original_filename}</span>
                    <button type="button" onClick={() => setFiles((x) => x.filter((y) => y.id !== f.id))} aria-label="Премахни файла">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-end gap-2 border-t border-white/10 px-3 py-3"
              data-testid="chat-form"
            >
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv" className="hidden" onChange={onPickFile} data-testid="chat-file-input" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || busy}
                className="icon-btn text-white/60 hover:text-[#C9A0FF] disabled:opacity-40"
                aria-label="Прикачи файл"
                data-testid="chat-attach-button"
              >
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                rows={1}
                placeholder="Напишете въпрос..."
                className="field-input max-h-28 flex-1 resize-none !py-2 text-sm"
                data-testid="chat-input"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-full bg-[#8B3DFF] p-2.5 text-white shadow-[0_0_14px_rgba(139,61,255,0.5)] transition-[background-color,transform,box-shadow] duration-300 hover:scale-110 hover:bg-[#9A4DFF] hover:shadow-[0_0_24px_rgba(177,108,255,0.8)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Изпрати"
                data-testid="chat-send-button"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            <div className="flex items-center justify-between border-t border-white/5 px-4 py-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/35" data-testid="chat-active-model">
                Модел: {PROVIDERS.find((p) => p.id === provider)?.label}
              </span>
              <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-[10px] text-white/40 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-red-300" data-testid="chat-clear-button">
                <Trash2 className="h-3 w-3" /> Изчисти
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
