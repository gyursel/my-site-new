import { MessageSquareText, Workflow, FileText, ScanEye, Smartphone, Sparkles } from "lucide-react";
import { AI_SECTION, AI_SOLUTIONS } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { useChat } from "../context/ChatContext";

const ICONS = { MessageSquareText, Workflow, FileText, ScanEye, Smartphone };

export const AISolutions = () => {
  const { openWithPrompt } = useChat();
  return (
    <section id="ai" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28" data-testid="ai-section">
      <SectionDecor index="01" />
      <Reveal>
        <p className="eyebrow mb-5">{AI_SECTION.eyebrow}</p>
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          {AI_SECTION.title.map((l, i) => (
            <SplitWords key={l} text={l} delay={i * 0.18} className="block" />
          ))}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{AI_SECTION.lead}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-6 md:gap-5">
        {AI_SOLUTIONS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.title} delay={i * 0.08} variant={i % 2 ? "scale" : "up"} className={s.wide ? "md:col-span-3" : "md:col-span-2"}>
              <article className="glass-card group flex h-full flex-col overflow-hidden" data-testid={`ai-card-${i}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover saturate-[1.18] contrast-[1.06] brightness-[1.06] transition-transform duration-700 group-hover:scale-[1.045]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120927]/85 via-transparent to-transparent" />
                  <div className="icon-tile absolute bottom-4 left-4 !mb-0 backdrop-blur-md">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
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
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
