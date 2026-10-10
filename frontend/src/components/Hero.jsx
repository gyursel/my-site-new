import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Workflow, Smartphone, Sparkles } from "lucide-react";
import { HERO, IMAGES } from "../data/content";
import { Magnetic } from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1];

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

const Words = ({ text, delay }) => (
  <span className="block">
    {text.split(" ").map((w, i) => (
      <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
        <motion.span
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE }}
        >
          {w}
        </motion.span>
        {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
      </span>
    ))}
  </span>
);

const RotatingWord = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO.rotating.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative block h-[1.15em] overflow-hidden" data-testid="hero-rotating-word">
      <AnimatePresence mode="wait">
        <motion.span
          key={HERO.rotating[i]}
          className="block bg-gradient-to-r from-[#C9A0FF] via-[#9A4DFF] to-[#00E5FF] bg-clip-text text-transparent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {HERO.rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const FloatingCapability = ({ icon: Icon, title, meta, className = "" }) => (
  <div className={`absolute z-20 hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#120a28]/90 px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:flex ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#B16CFF]/40 bg-[#8B3DFF]/20 text-[#C9A0FF]">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
    <span>
      <span className="block text-xs font-bold text-white">{title}</span>
      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-[#00E5FF]/80">{meta}</span>
    </span>
  </div>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const opacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);

  return (
    <section
      id="intro"
      ref={ref}
      className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-36 lg:grid-cols-12 lg:pt-28"
      data-testid="hero-section"
    >
      <div className="hero-orb left-[-10%] top-[20%] h-72 w-72 bg-[#8B3DFF]/25" aria-hidden="true" />
      <div className="hero-orb right-[5%] top-[60%] h-56 w-56 bg-[#00E5FF]/15 [animation-delay:-6s]" aria-hidden="true" />

      <motion.div className="lg:col-span-6" style={{ y: textY, opacity }}>
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[#B16CFF]/40 bg-[#8B3DFF]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#D9C2FF]"
          {...fade(0.05)}
          data-testid="hero-badge"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#C9A0FF] pulse-dot" aria-hidden="true" />
          {HERO.badge}
        </motion.span>

        <motion.p className="mt-7 font-mono text-xs uppercase tracking-[0.25em] text-white/45" {...fade(0.15)} data-testid="hero-name">
          {HERO.name}
        </motion.p>

        <h1 className="mt-3 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl" data-testid="hero-headline">
          <Words text={HERO.titleStart} delay={0.25} />
          <RotatingWord />
          <Words text={HERO.titleEnd} delay={0.45} />
        </h1>

        <motion.p className="mt-7 max-w-lg text-base leading-relaxed text-white/70 md:text-lg" {...fade(0.55)} data-testid="hero-lead">
          {HERO.lead.map((part, idx) =>
            typeof part === "string" ? part : <strong key={idx} className="font-semibold text-white">{part.b}</strong>,
          )}
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...fade(0.65)}>
          <Magnetic>
            <a href="#contact" className="btn-primary group" data-testid="hero-primary-cta">
              {HERO.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href="#projects" className="btn-secondary" data-testid="hero-secondary-cta">
              Виж проектите
            </a>
          </Magnetic>
        </motion.div>

        <motion.div className="mt-9 flex flex-wrap gap-2" {...fade(0.75)} data-testid="hero-tags">
          {HERO.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </motion.div>
      </motion.div>

      <motion.div
        className="lg:col-span-6"
        style={{ y }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
      >
        <div className="relative mx-auto max-w-lg lg:ml-auto" data-testid="hero-portrait">
          <div
            className="absolute -inset-12 rounded-full opacity-80"
            style={{ background: "radial-gradient(closest-side, rgba(139,61,255,0.42), rgba(0,229,255,0.08) 58%, transparent 100%)" }}
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[26px] border border-[#B16CFF]/45 bg-[#0b0718] p-1.5 shadow-[0_20px_70px_rgba(67,24,120,0.38)]">
            <img
              src={IMAGES.portrait}
              alt="Гюрсел Исмаилов работи на лаптоп"
              className="aspect-[4/3] w-full rounded-[20px] object-cover object-[68%_20%]"
              loading="eager"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-1.5 rounded-[20px] bg-gradient-to-t from-[#080411]/75 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#0d081b]/80 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#00E5FF]">AI PRODUCT STUDIO</p>
                  <p className="mt-1 text-sm font-bold text-white">От идея до работещ продукт</p>
                </div>
                <Sparkles className="h-5 w-5 shrink-0 text-[#C9A0FF]" aria-hidden="true" />
              </div>
            </div>
          </div>

          <FloatingCapability icon={Bot} title="AI асистенти" meta="24/7 automation" className="-left-8 top-12" />
          <FloatingCapability icon={Workflow} title="AI агенти" meta="smart workflows" className="-right-8 top-[34%]" />
          <FloatingCapability icon={Smartphone} title="Mobile AI" meta="android · ios" className="bottom-20 -left-5" />
        </div>
      </motion.div>

      <motion.a
        href="#ai"
        className="absolute bottom-6 left-1/2 hidden flex-col items-center gap-3 lg:flex"
        initial={{ opacity: 0, y: 16, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        aria-label="Скролни надолу"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Скролни</span>
        <span className="scroll-cue" />
      </motion.a>
    </section>
  );
};
