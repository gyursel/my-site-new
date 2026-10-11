import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ChatContext = createContext(null);

const SESSION_KEY = "gi-chat-session";
const SESSION_SECRET_KEY = "gi-chat-secret";

const getSession = () => {
  let id = localStorage.getItem(SESSION_KEY);
  let key = localStorage.getItem(SESSION_SECRET_KEY);

  if (!id) {
    id = `s-${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, id);
  }

  if (!key) {
    key = `${crypto.randomUUID()}${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_SECRET_KEY, key);
  }

  return { id, key };
};

export const ChatProvider = ({ children }) => {
  const initialSession = useMemo(() => getSession(), []);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState(initialSession.id);
  const [sessionKey, setSessionKey] = useState(initialSession.key);

  const openWithPrompt = useCallback((prompt = "") => {
    setDraft(prompt);
    setOpen(true);
  }, []);

  const resetSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_SECRET_KEY);
    const next = getSession();
    setSessionId(next.id);
    setSessionKey(next.key);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, draft, setDraft, openWithPrompt, sessionId, sessionKey, resetSession }),
    [open, draft, openWithPrompt, sessionId, sessionKey, resetSession],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
