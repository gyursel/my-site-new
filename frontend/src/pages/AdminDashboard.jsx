import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Inbox, FolderOpen, LogOut, Trash2, Download, ArrowLeft, Loader2 } from "lucide-react";
import { api, formatApiError, setToken } from "../lib/api";
import { LogoMark } from "../components/LogoMark";

const fmtDate = (iso) => new Date(iso).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short" });
const fmtSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("contacts");
  const [contacts, setContacts] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const [c, f] = await Promise.all([api.get("/contact"), api.get("/files")]);
    setContacts(c.data);
    setFiles(f.data);
  }, []);

  useEffect(() => {
    api.get("/auth/me")
      .then((r) => { setUser(r.data); return load(); })
      .catch(() => { setToken(null); navigate("/admin/login", { replace: true }); })
      .finally(() => setLoading(false));
  }, [load, navigate]);

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setToken(null);
    navigate("/admin/login", { replace: true });
  };

  const removeContact = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setContacts((c) => c.filter((x) => x.id !== id));
      toast.success("Запитването е изтрито.");
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const removeFile = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles((f) => f.filter((x) => x.id !== id));
      toast.success("Файлът е премахнат.");
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const download = async (f) => {
    try {
      const res = await api.get(`/files/${f.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.original_filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatApiError(e, "Файлът не може да бъде свален.")); }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center" data-testid="admin-loading">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9A0FF]" />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 pb-20 pt-10" data-testid="admin-dashboard">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div>
            <p className="text-sm font-bold">Админ панел</p>
            <p className="font-mono text-[10px] text-white/50" data-testid="admin-user-email">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="btn-secondary !px-4 !py-2" data-testid="admin-back-link">
            <ArrowLeft className="h-4 w-4" /> Към сайта
          </Link>
          <button type="button" onClick={logout} className="btn-ghost" data-testid="admin-logout-button">
            <LogOut className="h-4 w-4" /> Изход
          </button>
        </div>
      </header>

      <div className="mt-8 flex gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "contacts"} onClick={() => setTab("contacts")} className={`chip !px-4 !py-2 !text-xs ${tab === "contacts" ? "!border-[#B16CFF] !bg-[#8B3DFF]/25 !text-white shadow-[0_0_18px_rgba(139,61,255,0.45)]" : ""}`} data-testid="admin-tab-contacts">
          <Inbox className="mr-1.5 h-3.5 w-3.5" /> Запитвания ({contacts.length})
        </button>
        <button type="button" role="tab" aria-selected={tab === "files"} onClick={() => setTab("files")} className={`chip !px-4 !py-2 !text-xs ${tab === "files" ? "!border-[#B16CFF] !bg-[#8B3DFF]/25 !text-white shadow-[0_0_18px_rgba(139,61,255,0.45)]" : ""}`} data-testid="admin-tab-files">
          <FolderOpen className="mr-1.5 h-3.5 w-3.5" /> Файлове ({files.length})
        </button>
      </div>

      {tab === "contacts" && (
        <section className="mt-6 space-y-3" data-testid="admin-contacts-list">
          {contacts.length === 0 && <p className="text-sm text-white/50" data-testid="admin-contacts-empty">Все още няма запитвания.</p>}
          {contacts.map((c) => (
            <article key={c.id} className="glass-card p-5" data-testid="admin-contact-item">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{c.name} <span className="ml-2 font-mono text-[11px] font-normal text-[#C9A0FF]">{c.email}</span></p>
                  <p className="mt-1 font-mono text-[10px] text-white/40">{fmtDate(c.created_at)}</p>
                </div>
                <button type="button" onClick={() => removeContact(c.id)} className="icon-btn text-white/40 hover:text-red-300" aria-label="Изтрий запитването" data-testid="admin-contact-delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/75">{c.message}</p>
            </article>
          ))}
        </section>
      )}

      {tab === "files" && (
        <section className="mt-6 space-y-3" data-testid="admin-files-list">
          {files.length === 0 && <p className="text-sm text-white/50" data-testid="admin-files-empty">Няма качени файлове.</p>}
          {files.map((f) => (
            <article key={f.id} className="glass-card flex flex-wrap items-center justify-between gap-3 p-4" data-testid="admin-file-item">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{f.original_filename}</p>
                <p className="mt-1 font-mono text-[10px] text-white/40">{f.content_type} · {fmtSize(f.size)} · {fmtDate(f.created_at)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => download(f)} className="icon-btn text-white/60 hover:text-[#C9A0FF]" aria-label="Свали файла" data-testid="admin-file-download">
                  <Download className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => removeFile(f.id)} className="icon-btn text-white/40 hover:text-red-300" aria-label="Премахни файла" data-testid="admin-file-delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
