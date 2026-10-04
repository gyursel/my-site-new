import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Linkedin, Github } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHead } from "@/components/Reveal";
import { api } from "@/lib/api";

const CONTACTS = [
  { icon: Mail, label: "Имейл", value: "hello@gursel.dev", testid: "contact-email-link", href: "mailto:hello@gursel.dev" },
  { icon: Phone, label: "Телефон", value: "+359 88 000 0000", testid: "contact-phone-link", href: "tel:+359880000000" },
  { icon: MapPin, label: "Локация", value: "София, България · работи дистанционно", testid: "contact-location" },
];

const PROJECT_TYPES = [
  "Уебсайт",
  "Android приложение",
  "iOS приложение",
  "Android + iOS",
  "Комплексен проект",
];

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", project_type: PROJECT_TYPES[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setResult(null);
    setLoading(true);
    try {
      const res = await api.post("/contact", form);
      setResult({ ok: true, message: res.data.message || "Съобщението бе изпратено успешно!" });
      toast.success(<span data-testid="contact-success-message">{res.data.message || "Съобщението бе изпратено успешно!"}</span>, {
        description: <span data-testid="contact-success-description">Ще получите отговор възможно най-скоро.</span>,
      });
      setForm({ name: "", email: "", project_type: PROJECT_TYPES[0], message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setResult({ ok: false, message: typeof detail === "string" ? detail : "Възникна грешка при изпращането. Моля, опитайте отново." });
      toast.error(
        <span data-testid="contact-error-message" role="alert">{typeof detail === "string"
          ? detail
          : "Възникна грешка при изпращането. Моля, опитайте отново."}</span>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontakti" className="py-20 sm:py-28 bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <SectionHead
            eyebrow="Контакти"
            title="Имате идея? Нека я осъществим."
            desc="Разкажете ми накратко за проекта си и ще Ви отговоря с конкретен план и следващи стъпки."
          />

          <div className="mt-10 space-y-3">
            {CONTACTS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                {c.href ? (
                  <a
                    href={c.href}
                    data-testid={c.testid}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-[transform,border-color] duration-200 hover:border-primary/50 hover:-translate-y-0.5"
                  >
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-foreground mt-0.5 break-words">
                        {c.value}
                      </span>
                    </span>
                  </a>
                ) : (
                  <div
                    data-testid={c.testid}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5" />
                    </span>
                    <span>
                      <span className="block font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-foreground mt-0.5">
                        {c.value}
                      </span>
                    </span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                data-testid="contact-social-linkedin"
                aria-label="LinkedIn"
                className="w-11 h-11 shrink-0 rounded-full border border-input bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                data-testid="contact-social-github"
                aria-label="GitHub"
                className="w-11 h-11 shrink-0 rounded-full border border-input bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <span className="text-xs text-muted-foreground font-mono-label uppercase tracking-widest ml-1 min-w-0">
                LinkedIn · GitHub — заменете с профилите си
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form
            onSubmit={submit}
            data-testid="contact-form"
            aria-busy={loading}
            className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-panel"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cf-name" className="block text-sm font-bold text-foreground mb-1.5">
                  Име <span className="text-primary">*</span>
                </label>
                <input
                  id="cf-name"
                  data-testid="contact-name-input"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  name="name"
                  enterKeyHint="next"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Вашето име"
                  className="w-full min-w-0 rounded-xl border border-input bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="cf-email" className="block text-sm font-bold text-foreground mb-1.5">
                  Имейл <span className="text-primary">*</span>
                </label>
                <input
                  id="cf-email"
                  data-testid="contact-email-input"
                  type="email"
                  autoComplete="email"
                  name="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="vasht@imeil.bg"
                  className="w-full min-w-0 rounded-xl border border-input bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="cf-type" className="block text-sm font-bold text-foreground mb-1.5">
                Тип проект
              </label>
              <div className="relative">
                <select
                  id="cf-type"
                  data-testid="contact-type-select"
                  name="project_type"
                  value={form.project_type}
                  onChange={set("project_type")}
                  className="w-full min-w-0 appearance-none rounded-xl border border-input bg-background text-foreground pl-4 pr-9 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] cursor-pointer"
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  ▼
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="cf-message" className="block text-sm font-bold text-foreground mb-1.5">
                За проекта <span className="text-primary">*</span>
              </label>
              <textarea
                id="cf-message"
                data-testid="contact-message-input"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Опишете накратко идеята, целта и предпочитания срок…"
                className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] placeholder:text-muted-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              data-testid="contact-form-submit-button"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shadow-accent"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Изпращане…
                </>
              ) : (
                <>
                  Изпрати запитване <Send className="w-4 h-4" />
                </>
              )}
            </button>
            {result && <p data-testid="contact-form-result" role={result.ok ? "status" : "alert"} className={`mt-4 text-sm leading-relaxed ${result.ok ? "text-primary" : "text-destructive"}`}>{result.message}</p>}
            <p data-testid="contact-response-note" className="mt-3 text-xs text-muted-foreground text-center">
              Отговарям лично на всяко запитване — обикновено в рамките на един ден.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;