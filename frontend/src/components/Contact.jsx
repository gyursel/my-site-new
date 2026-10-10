import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, MapPin, CheckCircle2, Send, Loader2, ArrowUpRight } from "lucide-react";
import { CONTACT } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { Magnetic } from "./Magnetic";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INFO = [
  { icon: Mail, label: "Имейл", value: CONTACT.email, href: `mailto:${CONTACT.email}`, testid: "contact-info-email" },
  { icon: Phone, label: "Телефон", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}`, testid: "contact-info-phone" },
  { icon: MapPin, label: "Локация", value: CONTACT.location, href: null, testid: "contact-info-location" },
];

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } =
    useForm({ defaultValues: { name: "", email: "", message: "" } });

  useEffect(() => {
    const onPrefill = (e) => {
      setSubmitted(false);
      setValue("message", e.detail, { shouldDirty: true });
    };
    window.addEventListener("prefill-contact", onPrefill);
    return () => window.removeEventListener("prefill-contact", onPrefill);
  }, [setValue]);

  const onSubmit = async (values) => {
    try {
      await axios.post(`${API}/contact`, values);
      reset();
      setSubmitted(true);
    } catch {
      toast.error("Запитването не беше изпратено. Моля, опитайте отново.");
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-20 md:py-28" data-testid="contact-section">
      <SectionDecor index="06" />
      <Reveal>
        <p className="eyebrow mb-5">{CONTACT.eyebrow}</p>
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          <SplitWords text={CONTACT.title} />
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{CONTACT.lead}</p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="left">
          <div className="glass-panel h-full p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00E5FF]">DIRECT CONTACT</p>
            <h3 className="mt-3 text-2xl font-bold">Нека поговорим за идеята ви.</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Можете да се свържете директно по телефон или имейл, или да изпратите кратко запитване.
            </p>
            <div className="mt-7 space-y-3">
              {INFO.map((item) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#B16CFF]/30 bg-[#8B3DFF]/15">
                      <item.icon className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-white/40">{item.label}</span>
                      <span className="mt-1 block truncate text-sm font-semibold text-white/85">{item.value}</span>
                    </span>
                    {item.href && <ArrowUpRight className="ml-auto h-4 w-4 text-white/30" aria-hidden="true" />}
                  </>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-[#B16CFF]/50 hover:bg-[#8B3DFF]/10" data-testid={item.testid}>
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3" data-testid={item.testid}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} variant="blur">
          <div className="glass-panel p-6 md:p-8">
            {submitted ? (
              <div className="flex min-h-[360px] flex-col items-start justify-center gap-4" data-testid="contact-success-message">
                <CheckCircle2 className="h-12 w-12 text-[#C9A0FF]" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Запитването е изпратено!</h3>
                <p className="text-white/70">Благодаря ви за интереса. Ще се свържа с вас в рамките на един работен ден.</p>
                <button className="btn-secondary mt-2" onClick={() => setSubmitted(false)}>Изпратете ново запитване</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" data-testid="contact-form">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white/80">Име</label>
                  <input id="contact-name" type="text" placeholder="Вашето име" className="field-input" {...register("name", { required: "Моля, въведете име", minLength: { value: 2, message: "Името е твърде кратко" } })} />
                  {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white/80">Имейл</label>
                  <input id="contact-email" type="email" placeholder="you@example.com" className="field-input" {...register("email", { required: "Моля, въведете имейл", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Невалиден имейл адрес" } })} />
                  {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/80">Съобщение</label>
                  <textarea id="contact-message" rows={5} placeholder="Разкажете ми за проекта си..." className="field-input resize-none" {...register("message", { required: "Моля, напишете съобщение", minLength: { value: 10, message: "Съобщението е твърде кратко" } })} />
                  {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>}
                </div>
                <Magnetic className="w-full sm:w-auto">
                  <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Изпращане...</> : <>Изпрати запитване <Send className="h-4 w-4" /></>}
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
