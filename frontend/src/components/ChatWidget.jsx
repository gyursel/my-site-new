import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { ChatMessage } from "@/components/ChatMessage";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useVisualViewport } from "@/hooks/use-visual-viewport";
import { usePortfolioChat } from "@/hooks/use-portfolio-chat";

const SUGGESTIONS = ["Какви услуги предлагаш?", "Колко струва едно приложение?", "Как да поръчам проект?"];

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, streaming, send } = usePortfolioChat();
  const mobile = useMediaQuery("(max-width: 1023px)");
  const viewportStyle = useVisualViewport(open && mobile);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const followMessages = useRef(true);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-chat", openChat);
    return () => window.removeEventListener("open-chat", openChat);
  }, []);
  useEffect(() => {
    if (scrollRef.current && followMessages.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, viewportStyle]);

  const submit = (text) => {
    if (streaming || !text.trim()) return;
    followMessages.current = true;
    setInput("");
    send(text);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={mobile}>
      <DialogTrigger asChild>
        <button data-testid="ai-chat-toggle-button" aria-label={open ? "Затвори AI асистент" : "Отвори AI асистент"}
          className={`chat-toggle fixed z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-accent flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-[transform,background-color] ${open && mobile ? "invisible" : ""}`}>
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </DialogTrigger>
      <DialogContent data-testid="ai-chat-panel" layout="custom" showCloseButton={false} overlayTestId="ai-chat-backdrop" aria-describedby={undefined}
        style={viewportStyle} className="chat-panel rounded-3xl bg-card border-border flex flex-col overflow-hidden"
        onOpenAutoFocus={(event) => { event.preventDefault(); (mobile ? closeRef : inputRef).current?.focus({ preventScroll: true }); }}
        onInteractOutside={(event) => { if (!mobile) event.preventDefault(); }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <LogoMark className="w-9 h-9 shrink-0" />
          <div className="flex-1 min-w-0">
            <DialogTitle data-testid="ai-chat-title" className="text-sm flex items-center gap-1.5">AI асистент <Sparkles className="w-3.5 h-3.5 text-primary" /></DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Отговаря на български</p>
          </div>
          <DialogClose asChild><button ref={closeRef} data-testid="ai-chat-close-button" aria-label="Затвори AI асистент" className="w-11 h-11 shrink-0 rounded-full hover:bg-muted flex items-center justify-center hover:text-primary transition-colors"><X className="w-5 h-5" /></button></DialogClose>
        </div>
        <div ref={scrollRef} data-testid="ai-chat-messages" data-lenis-prevent role="log" aria-live="polite" aria-busy={streaming}
          onScroll={(event) => { const el = event.currentTarget; followMessages.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60; }}
          className="chat-scroll overlay-scroll flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
          {messages.map((message, index) => message.content ? <ChatMessage key={index} message={message} index={index} /> : null)}
          {streaming && !messages[messages.length - 1]?.content && <div data-testid="ai-chat-typing-indicator" className="shrink-0 self-start bg-muted rounded-2xl px-4 py-4 flex gap-1.5" aria-label="Асистентът пише">
            {[0, 1, 2].map((dot) => <span key={dot} className="typing-dot w-2 h-2 rounded-full bg-primary" />)}
          </div>}
          {messages.length === 1 && <div className="flex flex-wrap gap-2 pt-2 shrink-0">
            {SUGGESTIONS.map((text, index) => <button key={text} data-testid={`ai-chat-suggestion-${index}`} onClick={() => submit(text)} className="min-h-11 text-sm text-left font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-2xl px-3.5 py-2 transition-colors">{text}</button>)}
          </div>}
        </div>
        <form data-testid="ai-chat-composer" onSubmit={(event) => { event.preventDefault(); submit(input); }} className="p-3 border-t border-border flex items-center gap-2 shrink-0">
          <input ref={inputRef} data-testid="ai-chat-input" aria-label="Вашият въпрос към AI асистента" maxLength={2000} enterKeyHint="send" autoComplete="off"
            value={input} onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault(); }}
            placeholder="Напишете въпрос…" className="flex-1 min-w-0 min-h-12 rounded-full border border-input bg-background text-foreground px-4 py-3 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] placeholder:text-muted-foreground" />
          <button type="submit" data-testid="ai-chat-send-button" aria-label="Изпрати" disabled={streaming || !input.trim()} className="w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 transition-colors"><Send className="w-5 h-5" /></button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChatWidget;