import { Link } from "react-router-dom";
import { ArrowUpRight, Timer, Trophy } from "lucide-react";
import { IMAGES, PROJECTS, PROJECTS_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

const IMAGE_TINTS = [
  "from-[#00f3ff]/24 via-[#4D7CFF]/8 to-[#087ca8]/22",
  "from-[#087ca8]/24 via-transparent to-[#00f3ff]/22",
  "from-[#00B8FF]/20 via-[#087ca8]/8 to-[#D75CFF]/22",
];

export const Projects = () => (
  <section id="projects" className="relative mx-auto max-w-6xl xl:max-w-[1280px] px-4 py-16 sm:px-6 md:py-28" data-testid="projects-section">
    <SectionDecor index="03" />
    <Reveal>
      <p className="eyebrow mb-5">{PROJECTS_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={PROJECTS_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{PROJECTS_SECTION.lead}</p>
    </Reveal>

    <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-3 md:gap-6 xl:gap-7">
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
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00f3ff]/50" />
                    </div>
                    <img
                      src={IMAGES.projects[p.cover]}
                      srcSet={`${IMAGES.projects[p.cover].replace("w=2000", "w=640")} 640w, ${IMAGES.projects[p.cover].replace("w=2000", "w=960")} 960w, ${IMAGES.projects[p.cover]} 2000w`}
                      sizes="(max-width: 767px) 100vw, 33vw"
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/9] w-full object-cover saturate-[1.36] contrast-[1.12] brightness-[1.07] transition-[transform,filter] duration-500 group-hover:scale-[1.035] group-hover:saturate-[1.5] group-hover:contrast-[1.16] group-hover:brightness-[1.11]"
                    />
                    <div className={`pointer-events-none absolute inset-x-3 bottom-3 top-10 bg-gradient-to-br ${IMAGE_TINTS[i % IMAGE_TINTS.length]} mix-blend-screen opacity-65 transition-opacity duration-500 group-hover:opacity-88`} />
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 top-10 bg-gradient-to-t from-[#06111e]/55 via-transparent to-[#00f3ff]/[0.03]" />
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
                      <div className="rounded-xl border border-[#00f3ff]/20 bg-[#087ca8]/10 p-3">
                        <Trophy className="h-4 w-4 text-[#8af6ff]" aria-hidden="true" />
                        <p className="mt-2 text-lg font-extrabold text-white">{headlineResult.value}</p>
                        <p className="mt-1 text-[10px] leading-snug text-white/50">{headlineResult.label}</p>
                      </div>
                    )}
                    <div className="rounded-xl border border-[#00f3ff]/15 bg-[#00f3ff]/[0.05] p-3">
                      <Timer className="h-4 w-4 text-[#00f3ff]" aria-hidden="true" />
                      <p className="mt-2 text-sm font-bold text-white">{p.duration}</p>
                      <p className="mt-1 text-[10px] text-white/50">срок за реализация</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => <span key={s} className="chip">{s}</span>)}
                  </div>

                  <p className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#8af6ff] transition-transform duration-300 group-hover:translate-x-1">
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
