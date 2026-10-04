export const ChatMessage = ({ message, index }) => (
  <div data-testid={`ai-chat-message-${index}`} data-message-role={message.role}
    className={`max-w-[88%] shrink-0 rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${message.role === "user" ? "self-end bg-primary text-primary-foreground rounded-br-md" : "self-start bg-muted text-foreground rounded-bl-md"}`}>
    {message.content.split(/(\*\*[^*]+\*\*)/g).map((part, key) => part.startsWith("**") && part.endsWith("**") ? <strong key={key}>{part.slice(2, -2)}</strong> : part)}
  </div>
);