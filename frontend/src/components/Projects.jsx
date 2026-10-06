import { IMAGES, PROJECTS, PROJECTS_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";

export const Projects = () => (
  <section id="projects" className="mx-auto max-w-6xl px-6 py-24 md:py-32" data-testid="projects-section">
    <Reveal>
      <p className="eyebrow mb-5">{PROJECTS_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={PROJECTS_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{PROJECTS_SECTION.lead}</p>
    </Reveal>

    <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
      {PROJECTS.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.12} variant={i === 0 ? "left" : i === 2 ? "right" : "up"}>
          <article className="glass-card group h-full overflow-hidden" data-testid={`project-card-${i}`}>
            <div className="overflow-hidden">
              <img
                src={IMAGES.projects[i]}
                alt={p.title}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
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
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  </section>
);
