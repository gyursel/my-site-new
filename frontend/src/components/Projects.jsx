import { Link } from "react-router-dom";
import { ArrowUpRight, Timer, Trophy } from "lucide-react";
import { IMAGES, PROJECTS, PROJECTS_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

export const Projects = () => (
  <section id="projects" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28" data-testid="projects-section">
    <SectionDecor index="03" />
    <Reveal>
      <p className="eyebrow mb-5">{PROJECTS_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={PROJECTS_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{PROJECTS_SECTION.lead}</p>
    </Reveal>

    <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-3 md:gap-6">
      {PROJECTS.map((p, i) => {
        const headlineResult = p.results?.[0];
        return (
          <Reveal key={p.slug} delay={i * 0.08} variant="up">
            <Link to={`/projects/${p.slug}`} className="block h-full" data-testid={`project-card-${i}`} aria-label={`Отвори проекта ${p.title}`}>
              <article className="glass-card group flex h-full flex-col overflow-hidden">
                <div className="relative bg-[#070411] p-3">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
                    <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3" aria-hidden="true">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]/50" />
                    </div>
                    <img
                      src={IMAGES.projects[p.cover]}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/9] w-full object-cover saturate-[1.18] contrast-[1.06] transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                  </div>
                  <span className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="meta-mono uppercase">{p.tag}</span>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{p.text}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {headlineResult && (
                      <div className="rounded-xl border border-[#B16CFF]/20 bg-[#8B3DFF]/10 p-3">
                        <Trophy className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" />
                        <p className="mt-2 text-lg font-extrabold text-white">{headlineResult.value}</p>
                        <p className="mt-1 text-[10px] leading-snug text-white/50">{headlineResult.label}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-[#00E5FF]/15 bg-[#00E5FF]/[0.05] p-3">
                      <Timer className="h-4 w-4 text-[#00E5FF]" aria-hidden="true" />
                      <p className="mt-2 text-sm font-bold text-white">{p.duration}</p>
                      <p className="mt-1 text-[10px] text-white/50">срок за реализация</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => <span key={s} className="chip">{s}</span>)}
                  </div>

                  <p className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#C9A0FF] transition-transform duration-300 group-hover:translate-x-1">
                    Виж казуса <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </p>
                </div>
              </article>
            </Link>
          </Reveal>
        );
      })}
    </div>
  </section>
);
