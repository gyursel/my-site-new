import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { ProjectDialog } from "@/components/ProjectDialog";
import { PortfolioImage } from "@/components/PortfolioImage";

const CATS = ["Всички", "Android", "iOS", "Уеб"];

const PROJECTS = [
  {
    id: "ecommerce",
    title: "Приложение за е-търговия",
    cat: "Android",
    img: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    desc: "Мобилно приложение с каталог с продукти, количка, онлайн плащания и push известия за промени по поръчката.",
    tech: ["Kotlin", "Jetpack Compose", "Firebase"],
  },
  {
    id: "booking",
    title: "Платформа за резервации",
    cat: "Уеб",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    desc: "Уеб приложение с календар за резервации, потребителски профили и административен панел за управление.",
    tech: ["React", "FastAPI", "MongoDB"],
  },
  {
    id: "fitness",
    title: "Фитнес тракер",
    cat: "iOS",
    img: "https://images.unsplash.com/photo-1529653762956-b0a27278529c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    desc: "Приложение за проследяване на тренировки и прогрес с ясни графики, цели и напомняния.",
    tech: ["Swift", "SwiftUI", "CoreData"],
  },
];

export const Projects = () => {
  const [cat, setCat] = useState("Всички");
  const [selected, setSelected] = useState(null);
  const returnFocusRef = useRef(null);

  const filtered =
    cat === "Всички" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);

  return (
    <section id="proekti" className="py-20 sm:py-28 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionHead
            eyebrow="Проекти"
            title="Типови проекти, които създавам"
            desc="Селекция от направленията, в които работя — всеки проект се адаптира към конкретната идея и бизнес цел."
          />
          <Reveal delay={0.1} className="shrink-0">
            <div className="grid grid-cols-2 min-[375px]:grid-cols-4 gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  data-testid={`portfolio-filter-${c.toLowerCase()}`}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`min-h-11 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border ${
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary shadow-accent"
                      : "bg-card text-foreground border-input hover:border-primary hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`project-card-${p.id}`}
                onClick={(event) => { returnFocusRef.current = event.currentTarget; setSelected(p); }}
                role="button"
                tabIndex={0}
                aria-label={p.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    returnFocusRef.current = e.currentTarget;
                    setSelected(p);
                  }
                }}
                className="group cursor-pointer rounded-3xl border border-border bg-card overflow-hidden transition-[border-color,box-shadow] duration-300 hover:shadow-lift hover:border-primary/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <PortfolioImage
                    src={p.img}
                    sizes="(min-width: 1280px) 392px, (min-width: 1024px) 32vw, (min-width: 768px) 48vw, calc(100vw - 2rem)"
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 font-mono-label text-[10px] uppercase tracking-[0.2em] bg-background/90 backdrop-blur border border-border rounded-full px-3 py-1.5 text-foreground">
                    {p.cat}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center justify-between gap-3">
                    {p.title}
                    <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} returnFocusRef={returnFocusRef} />
    </section>
  );
};

export default Projects;