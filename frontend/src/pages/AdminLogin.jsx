import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { api, formatApiError, setToken } from "../lib/api";
import { LogoMark } from "../components/LogoMark";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.access_token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(formatApiError(err, "Входът не успя."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6" data-testid="admin-login-page">
      <form onSubmit={submit} className="glass-panel w-full max-w-sm p-8" data-testid="admin-login-form">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div>
            <p className="text-sm font-bold">Админ вход</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#B16CFF]/80">Гюрсел Исмаилов</p>
          </div>
        </div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-white/80">Имейл</label>
        <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="admin@..." data-testid="admin-email-input" />
        <label htmlFor="admin-password" className="mb-2 mt-4 block text-sm font-medium text-white/80">Парола</label>
        <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" placeholder="••••••••" data-testid="admin-password-input" />
        {error && <p className="mt-3 text-sm text-red-400" data-testid="admin-login-error">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full" data-testid="admin-login-submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Вход
        </button>
      </form>
    </main>
  );
}
