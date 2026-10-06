import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Building2, CheckCircle2 } from "lucide-react";
import { IMAGES, PROJECTS } from "../data/content";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatWidget } from "../components/ChatWidget";
import { CountUp, Reveal, SplitWords } from "../components/Reveal";
import { Magnetic } from "../components/Magnetic";
import { ScrollProgress } from "../components/ScrollProgress";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const EASE = [0.22, 1, 0.36, 1];

const Meta = ({ icon: Icon, label, value, testid }) => (
  <div className="flex items-start gap-3" data-testid={testid}>
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A0FF]" aria-hidden="true" />
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-white/85">{value}</p>
    </div>
  </div>
);

export default function CaseStudy() {
  const { slug } = useParams();
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[idx];
  useSmoothScroll();

  useEffect(() => {
    if (project) document.title = `${project.title} — Гюрсел Исмаилов`;
    return () => { document.title = "Гюрсел Исмаилов — AI решения за бизнеса"; };
  }, [project]);

  if (!project) return <Navigate to="/" replace />;
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="relative" data-testid="case-study-page">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="grid-overlay absolute inset-0" />
        <div className="noise absolute inset-0" />
      </div>
      <ScrollProgress />
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <Link to="/#projects" className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-[#C9A0FF]" data-testid="case-back-link">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            Всички проекти
          </Link>
        </motion.div>

        <header className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <motion.p className="eyebrow mb-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} data-testid="case-tag">
              // {project.tag}
            </motion.p>
            <h1 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl" data-testid="case-title">
              <SplitWords text={project.title} delay={0.15} />
            </h1>
            <motion.p className="mt-7 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: EASE }} data-testid="case-lead">
              {project.text}
            </motion.p>
          </div>
          <motion.aside className="glass-panel grid grid-cols-1 gap-5 p-6 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: EASE }} data-testid="case-meta">
            <Meta icon={Building2} label="Клиент" value={project.client} testid="case-meta-client" />
            <Meta icon={Clock} label="Срок" value={project.duration} testid="case-meta-duration" />
            <Meta icon={Calendar} label="Година" value={project.year} testid="case-meta-year" />
          </motion.aside>
        </header>

        <motion.div
          className="case-media mt-14 aspect-[21/9]"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          data-testid="case-cover"
        >
          <img src={IMAGES.projects[project.cover]} alt={project.title} loading="eager" />
        </motion.div>

        <section className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="case-results">
          {project.results.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.1} variant="scale">
              <div className="glass-card h-full p-6">
                <CountUp value={r.value} className="text-4xl font-extrabold text-[#C9A0FF] md:text-5xl" data-testid={`case-result-${i}`} />
                <p className="mt-2 text-xs leading-snug text-white/55 md:text-sm">{r.label}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-2" data-testid="case-story">
          <Reveal variant="left">
            <p className="eyebrow mb-4">// Предизвикателство</p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Откъде тръгнахме</h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">{project.challenge}</p>
          </Reveal>
          <Reveal variant="right" delay={0.1}>
            <p className="eyebrow mb-4">// Решение</p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Какво изградих</h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">{project.solution}</p>
            <div className="mt-6 flex flex-wrap gap-2" data-testid="case-stack">
              {project.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Reveal>
        </section>

        <section className="mt-24" data-testid="case-gallery">
          <Reveal>
            <p className="eyebrow mb-4">// Галерия</p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl"><SplitWords text="Поглед отвътре" /></h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {project.gallery.map((g, i) => (
              <Reveal key={`${g}-${i}`} delay={i * 0.12} variant="blur" className={i === 0 ? "md:col-span-2" : i === 2 ? "md:col-span-3" : ""}>
                <div className={`case-media ${i === 0 ? "aspect-[16/9]" : i === 2 ? "aspect-[21/9]" : "aspect-[4/5] md:aspect-auto md:h-full"}`} data-testid={`case-gallery-item-${i}`}>
                  <img src={IMAGES.projects[g]} alt={`${project.title} — екран ${i + 1}`} loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-24" data-testid="case-steps">
          <Reveal>
            <p className="eyebrow mb-4">// Процес</p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl"><SplitWords text="Стъпка по стъпка" /></h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            {project.steps.map((s, i) => (
              <Reveal key={s} delay={i * 0.1}>
                <div className="glass-card h-full p-6" data-testid={`case-step-${i}`}>
                  <span className="font-mono text-xs text-[#B16CFF]">0{i + 1}</span>
                  <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-snug">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A0FF]" aria-hidden="true" />{s}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal variant="blur" className="mt-28">
          <div className="glass-panel relative overflow-hidden p-10 md:p-16" data-testid="case-cta">
            <div className="hero-orb -right-10 -top-10 h-64 w-64 bg-[#8B3DFF]/30" aria-hidden="true" />
            <p className="eyebrow mb-4">// Следваща стъпка</p>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">Имате подобна задача? Да я обсъдим.</h2>
            <p className="mt-5 max-w-xl text-base text-white/65 md:text-lg">Разкажете ми за идеята си и ще получите конкретен план и оценка в рамките на един работен ден.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link to="/#contact" className="btn-primary group" data-testid="case-contact-cta">
                  Свържете се с мен
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Link to={`/projects/${next.slug}`} className="btn-secondary" data-testid="case-next-link">
                Следващ проект: {next.title}
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
