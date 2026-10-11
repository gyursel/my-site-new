import { createContext, useCallback, useContext, useState } from "react";

const ChatContext = createContext(null);

// Sessions live only in memory. Each new chat opening gets fresh credentials.
const getSession = () => ({
  id: `s-${crypto.randomUUID()}`,
  key: `${crypto.randomUUID()}${crypto.randomUUID()}`,
});

export const ChatProvider = ({ children }) => {
  const [initialSession] = useState(getSession);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState(initialSession.id);
  const [sessionKey, setSessionKey] = useState(initialSession.key);

  const resetSession = useCallback(() => {
    const next = getSession();
    setSessionId(next.id);
    setSessionKey(next.key);
  }, []);

  const openChat = useCallback(() => {
    resetSession();
    setDraft("");
    setOpen(true);
  }, [resetSession]);

  const openWithPrompt = useCallback((prompt = "") => {
    resetSession();
    setDraft(prompt);
    setOpen(true);
  }, [resetSession]);

  const value = useMemo(
    () => ({ open, setOpen, openChat, draft, setDraft, openWithPrompt, sessionId, sessionKey, resetSession }),
    [open, openChat, draft, openWithPrompt, sessionId, sessionKey, resetSession],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
