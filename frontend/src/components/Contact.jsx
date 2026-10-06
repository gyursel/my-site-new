import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, MapPin, CheckCircle2, Send, Loader2 } from "lucide-react";
import { CONTACT } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { Magnetic } from "./Magnetic";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INFO = [
  { icon: Mail, label: "Имейл", value: CONTACT.email, testid: "contact-info-email" },
  { icon: Phone, label: "Телефон", value: CONTACT.phone, testid: "contact-info-phone" },
  { icon: MapPin, label: "Локация", value: CONTACT.location, testid: "contact-info-location" },
];

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", message: "" } });

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
    } catch (e) {
      toast.error("Запитването не беше изпратено. Моля, опитайте отново.");
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-6 py-24 md:py-32" data-testid="contact-section">
      <SectionDecor index="06" />
      <Reveal>
        <p className="eyebrow mb-5">{CONTACT.eyebrow}</p>
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          <SplitWords text={CONTACT.title} />
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{CONTACT.lead}</p>
      </Reveal>

      <Reveal delay={0.15} variant="blur">
        <div className="glass-panel mt-12 p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-start gap-4 py-8" data-testid="contact-success-message">
              <CheckCircle2 className="h-12 w-12 text-[#C9A0FF]" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Запитването е изпратено!</h3>
              <p className="text-white/70">Благодаря ви за интереса. Ще се свържа с вас в рамките на един работен ден.</p>
              <button
                className="btn-secondary mt-2"
                onClick={() => setSubmitted(false)}
                data-testid="contact-new-message-button"
              >
                Изпратете ново запитване
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white/80">
                  Име
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Вашето име"
                  className="field-input"
                  data-testid="contact-name-input"
                  {...register("name", { required: "Моля, въведете име", minLength: { value: 2, message: "Името е твърде кратко" } })}
                />
                {errors.name && <p className="mt-2 text-sm text-red-400" data-testid="contact-name-error">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white/80">
                  Имейл
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="field-input"
                  data-testid="contact-email-input"
                  {...register("email", {
                    required: "Моля, въведете имейл",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Невалиден имейл адрес" },
                  })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-400" data-testid="contact-email-error">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white/80">
                  Съобщение
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Разкажете ми за проекта си..."
                  className="field-input resize-none"
                  data-testid="contact-message-input"
                  {...register("message", { required: "Моля, напишете съобщение", minLength: { value: 10, message: "Съобщението е твърде кратко" } })}
                />
                {errors.message && <p className="mt-2 text-sm text-red-400" data-testid="contact-message-error">{errors.message.message}</p>}
              </div>

              <Magnetic className="w-full sm:w-auto">
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting} data-testid="contact-form-submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Изпращане...
                    </>
                  ) : (
                    <>
                      Изпрати запитване
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </Magnetic>
            </form>
          )}

          <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {INFO.map((item) => (
              <div key={item.label} className="flex items-center gap-3" data-testid={item.testid}>
                <item.icon className="h-5 w-5 shrink-0 text-[#C9A0FF]" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">{item.label}</p>
                  <p className="text-sm font-medium text-white/80">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};
