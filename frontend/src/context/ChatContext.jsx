import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ChatContext = createContext(null);

const SESSION_KEY = "gi-chat-session";

const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s-${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const ChatProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState(getSessionId);

  const openWithPrompt = useCallback((prompt = "") => {
    setDraft(prompt);
    setOpen(true);
  }, []);

  const resetSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(getSessionId());
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, draft, setDraft, openWithPrompt, sessionId, resetSession }),
    [open, draft, openWithPrompt, sessionId, resetSession],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
