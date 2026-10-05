import { MessageSquareText, Workflow, FileText, ScanEye, Smartphone, Sparkles } from "lucide-react";
import { AI_SECTION, AI_SOLUTIONS } from "../data/content";
import { Reveal } from "./Reveal";
import { useChat } from "../context/ChatContext";

const ICONS = { MessageSquareText, Workflow, FileText, ScanEye, Smartphone };

export const AISolutions = () => {
  const { openWithPrompt } = useChat();
  return (
    <section id="ai" className="mx-auto max-w-6xl px-6 py-24 md:py-28" data-testid="ai-section">
      <Reveal>
        <p className="eyebrow mb-4">{AI_SECTION.eyebrow}</p>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {AI_SECTION.title.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">{AI_SECTION.lead}</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
        {AI_SOLUTIONS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.title} delay={i * 0.07} className={s.wide ? "md:col-span-3" : "md:col-span-2"}>
              <article className="glass-card flex h-full flex-col p-6" data-testid={`ai-card-${i}`}>
                <div className="icon-tile mb-5">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold md:text-lg">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{s.text}</p>
                <p className="meta-mono mt-4">{s.meta}</p>
                <button
                  type="button"
                  onClick={() => openWithPrompt(s.prompt)}
                  className="group/ask mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#C9A0FF] transition-[color,transform] duration-300 hover:translate-x-1 hover:text-white"
                  data-testid={`ai-card-ask-${i}`}
                >
                  <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover/ask:rotate-180 group-hover/ask:scale-125" aria-hidden="true" />
                  {AI_SECTION.askLabel}
                </button>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
