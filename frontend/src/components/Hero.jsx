import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO, IMAGES } from "../data/content";

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
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {HERO.rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="intro"
      ref={ref}
      className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-40 lg:grid-cols-12 lg:pt-32"
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

        <h1
          className="mt-3 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl"
          data-testid="hero-headline"
        >
          <Words text={HERO.titleStart} delay={0.25} />
          <RotatingWord />
          <Words text={HERO.titleEnd} delay={0.45} />
        </h1>

        <motion.p className="mt-7 max-w-lg text-base leading-relaxed text-white/65 md:text-lg" {...fade(0.55)} data-testid="hero-lead">
          {HERO.lead.map((part, idx) =>
            typeof part === "string" ? part : <strong key={idx} className="font-semibold text-white">{part.b}</strong>,
          )}
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...fade(0.65)}>
          <a href="#contact" className="btn-primary group" data-testid="hero-primary-cta">
            {HERO.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a href="#ai" className="btn-secondary" data-testid="hero-secondary-cta">
            Виж AI решенията
          </a>
        </motion.div>

        <motion.div className="mt-9 flex flex-wrap gap-2" {...fade(0.75)} data-testid="hero-tags">
          {HERO.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="lg:col-span-6"
        style={{ y }}
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
      >
        <div className="relative mx-auto max-w-md lg:ml-auto" data-testid="hero-portrait">
          <div
            className="absolute -inset-16 rounded-full opacity-80"
            style={{ background: "radial-gradient(closest-side, rgba(139,61,255,0.45), rgba(139,61,255,0.12) 55%, transparent 100%)" }}
            aria-hidden="true"
          />
          <motion.div
            className="relative rounded-2xl border border-[#B16CFF]/40 bg-[#0b0718] p-1.5 shadow-[0_0_40px_rgba(139,61,255,0.35)]"
            whileHover={{ y: -6, rotate: 0.6 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <img
              src={IMAGES.portrait}
              alt="Гюрсел Исмаилов работи на лаптоп"
              className="aspect-[3/2] w-full rounded-xl object-cover object-[68%_20%]"
              loading="eager"
            />
          </motion.div>
          <motion.div
            className="relative -mt-3 mx-3 flex items-center justify-between gap-4 rounded-xl border border-[#B16CFF]/30 bg-[#140b2a]/95 px-4 py-3 backdrop-blur-md"
            {...fade(0.9)}
            data-testid="hero-caption"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#B16CFF]/80">{HERO.caption.code}</p>
              <p className="mt-1 text-xs font-medium text-white/85">{HERO.caption.left}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white">{HERO.caption.rightTitle}</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-white/45">{HERO.caption.rightSub}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#ai"
        className="absolute bottom-6 left-1/2 hidden flex-col items-center gap-3 lg:flex"
        initial={{ opacity: 0, y: 16, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        aria-label="Скролни надолу"
        data-testid="hero-scroll-cue"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Скролни</span>
        <span className="scroll-cue" />
      </motion.a>
    </section>
  );
};
