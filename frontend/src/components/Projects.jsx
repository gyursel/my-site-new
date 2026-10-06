import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { IMAGES, PROJECTS, PROJECTS_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

export const Projects = () => (
  <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32" data-testid="projects-section">
    <SectionDecor index="03" />
    <Reveal>
      <p className="eyebrow mb-5">{PROJECTS_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={PROJECTS_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{PROJECTS_SECTION.lead}</p>
    </Reveal>

    <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
      {PROJECTS.map((p, i) => (
        <Reveal key={p.slug} delay={i * 0.12} variant={i === 0 ? "left" : i === 2 ? "right" : "up"}>
          <Link to={`/projects/${p.slug}`} className="block h-full" data-testid={`project-card-${i}`} aria-label={`Отвори проекта ${p.title}`}>
            <article className="glass-card group h-full overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={IMAGES.projects[p.cover]}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="p-6">
                <span className="meta-mono uppercase">{p.tag}</span>
                <h3 className="mt-3 text-base font-bold md:text-lg">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{p.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C9A0FF] transition-transform duration-300 group-hover:translate-x-1">
                  Виж казуса <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </p>
              </div>
            </article>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);
