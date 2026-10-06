import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Clock, Gauge, Layers, MessageSquareText, Send } from "lucide-react";
import { FEATURES, PLATFORMS, PROJECT_TYPES, SCALES, URGENCY, computeEstimate, summarizeEstimate } from "../data/estimator";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { Magnetic } from "./Magnetic";
import { useChat } from "../context/ChatContext";

const AnimatedNumber = ({ value, ...rest }) => {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (v) => Math.round(v));
  useEffect(() => { mv.set(value); }, [value, mv]);
  return <motion.span {...rest}>{text}</motion.span>;
};

const Option = ({ active, onClick, children, testid, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    data-testid={testid}
    className={`estimate-option ${active ? "estimate-option--active" : ""} ${className}`}
  >
    {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    <span>{children}</span>
  </button>
);

const Step = ({ n, title, children }) => (
  <div data-testid={`estimator-step-${n}`}>
    <p className="mb-3 flex items-center gap-3 text-sm font-bold">
      <span className="font-mono text-[11px] text-[#B16CFF]">0{n}</span> {title}
    </p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export const Estimator = () => {
  const { openWithPrompt } = useChat();
  const [sel, setSel] = useState({ type: "chatbot", platform: "both", features: ["ai"], scale: "mvp", urgency: "standard" });
  const est = useMemo(() => computeEstimate(sel), [sel]);
  const set = (k, v) => setSel((s) => ({ ...s, [k]: v }));
  const toggleFeature = (id) => setSel((s) => ({ ...s, features: s.features.includes(id) ? s.features.filter((f) => f !== id) : [...s.features, id] }));

  const sendToContact = () => {
    window.dispatchEvent(new CustomEvent("prefill-contact", { detail: `Здравейте! Направих бърза оценка на сайта:\n\n${summarizeEstimate(sel, est)}\n\nИскам да обсъдим проекта.` }));
  };

  return (
    <section id="estimate" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32" data-testid="estimator-section">
      <SectionDecor index="05" />
      <Reveal>
        <p className="eyebrow mb-5">// Бърза оценка</p>
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          <SplitWords text="Колко голям е вашият проект?" />
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          Изберете какво ви трябва и вижте ориентировъчен обем и срок за секунди. Оценката е насочваща — точните параметри уточняваме на кратка консултация.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-7">
          <div className="glass-panel space-y-8 p-6 md:p-8" data-testid="estimator-form">
            <Step n={1} title="Тип проект">
              {PROJECT_TYPES.map((t) => (
                <Option key={t.id} active={sel.type === t.id} onClick={() => set("type", t.id)} testid={`estimator-type-${t.id}`}>{t.label}</Option>
              ))}
            </Step>
            {sel.type === "mobile" && (
              <Step n={2} title="Платформи">
                {PLATFORMS.map((p) => (
                  <Option key={p.id} active={sel.platform === p.id} onClick={() => set("platform", p.id)} testid={`estimator-platform-${p.id}`}>{p.label}</Option>
                ))}
              </Step>
            )}
            <Step n={sel.type === "mobile" ? 3 : 2} title="Модули и функции">
              {FEATURES.map((f) => (
                <Option key={f.id} active={sel.features.includes(f.id)} onClick={() => toggleFeature(f.id)} testid={`estimator-feature-${f.id}`}>{f.label}</Option>
              ))}
            </Step>
            <Step n={sel.type === "mobile" ? 4 : 3} title="Обхват">
              {SCALES.map((s) => (
                <Option key={s.id} active={sel.scale === s.id} onClick={() => set("scale", s.id)} testid={`estimator-scale-${s.id}`} className="flex-col !items-start">
                  {s.label}
                  <span className="block text-[11px] font-normal text-white/50">{s.hint}</span>
                </Option>
              ))}
            </Step>
            <Step n={sel.type === "mobile" ? 5 : 4} title="Срок">
              {URGENCY.map((u) => (
                <Option key={u.id} active={sel.urgency === u.id} onClick={() => set("urgency", u.id)} testid={`estimator-urgency-${u.id}`}>{u.label}</Option>
              ))}
            </Step>
          </div>
        </Reveal>

        <Reveal variant="right" delay={0.1} className="lg:col-span-5">
          <div className="glass-panel sticky top-28 overflow-hidden p-6 md:p-8" data-testid="estimator-result">
            <div className="hero-orb -right-16 -top-16 h-48 w-48 bg-[#8B3DFF]/30" aria-hidden="true" />
            <p className="eyebrow">// Ориентировъчна оценка</p>

            <div className="mt-6 flex items-end gap-3">
              <motion.span
                key={est.scope.label}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="text-6xl font-extrabold leading-none text-glow md:text-7xl"
                data-testid="estimator-scope-label"
              >
                {est.scope.label}
              </motion.span>
              <div className="pb-1">
                <p className="text-sm font-bold" data-testid="estimator-scope-title">{est.scope.title}</p>
                <p className="text-xs text-white/55">{est.scope.text}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"><Clock className="h-3.5 w-3.5 text-[#C9A0FF]" /> Срок</p>
                <p className="mt-2 text-2xl font-extrabold text-[#C9A0FF]" data-testid="estimator-weeks">
                  <AnimatedNumber value={est.weeksMin} />–<AnimatedNumber value={est.weeksMax} /> <span className="text-sm font-semibold text-white/70">седм.</span>
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"><Gauge className="h-3.5 w-3.5 text-[#C9A0FF]" /> Обем</p>
                <p className="mt-2 text-2xl font-extrabold text-[#C9A0FF]" data-testid="estimator-hours">
                  <AnimatedNumber value={est.hoursMin} />–<AnimatedNumber value={est.hoursMax} /> <span className="text-sm font-semibold text-white/70">часа</span>
                </p>
              </div>
            </div>

            <div className="mt-8" data-testid="estimator-phases">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"><Layers className="h-3.5 w-3.5 text-[#C9A0FF]" /> Етапи</p>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                {est.phases.map((p, i) => (
                  <motion.div
                    key={p.label}
                    layout
                    className="h-full"
                    style={{ flex: p.weeks, background: ["#00E5FF", "#8B3DFF", "#B16CFF", "#C9A0FF"][i], opacity: 0.9 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                ))}
              </div>
              <ul className="mt-3 space-y-1.5">
                {est.phases.map((p, i) => (
                  <li key={p.label} className="flex items-center justify-between text-xs text-white/70">
                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: ["#00E5FF", "#8B3DFF", "#B16CFF", "#C9A0FF"][i] }} />{p.label}</span>
                    <span className="font-mono text-[11px] text-white/50">~{p.weeks} седм.</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Magnetic className="w-full">
                <a href="#contact" onClick={sendToContact} className="btn-primary w-full" data-testid="estimator-send-button">
                  Изпрати оценката като запитване <Send className="h-4 w-4" aria-hidden="true" />
                </a>
              </Magnetic>
              <button type="button" onClick={() => openWithPrompt(`Ето моята бърза оценка:\n${summarizeEstimate(sel, est)}\nКакво бихте ми препоръчали за старт?`)} className="btn-secondary w-full" data-testid="estimator-ask-ai-button">
                <MessageSquareText className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" /> Обсъди оценката с AI
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] text-white/40">Цената зависи от обхвата и се уточнява след консултация.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
