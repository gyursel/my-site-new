import { Paperclip } from "lucide-react";

export const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`} data-testid={`chat-message-${message.role}`}>
      <div className="max-w-[85%]">
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
          {message.content ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            <span className="inline-flex items-center gap-1 py-1" aria-label="AI пише">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          )}
        </div>
        {message.attachments?.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-end gap-1">
            {message.attachments.map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1 font-mono text-[10px] text-white/50">
                <Paperclip className="h-3 w-3" /> {a.name}
              </span>
            ))}
          </div>
        )}
        {!isUser && message.model_label && !message.streaming && (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/35">{message.model_label}</p>
        )}
      </div>
    </div>
  );
};
