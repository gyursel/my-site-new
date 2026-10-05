import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO, IMAGES } from "../data/content";

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

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
          className="block bg-gradient-to-r from-[#C9A0FF] to-[#9A4DFF] bg-clip-text text-transparent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      id="intro"
      ref={ref}
      className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-40 lg:grid-cols-12 lg:pt-32"
      data-testid="hero-section"
    >
      <div className="lg:col-span-6">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[#B16CFF]/40 bg-[#8B3DFF]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#D9C2FF]"
          {...fade(0.05)}
          data-testid="hero-badge"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#C9A0FF] pulse-dot" aria-hidden="true" />
          {HERO.badge}
        </motion.span>

        <motion.p className="mt-6 text-xs font-medium text-white/50" {...fade(0.15)} data-testid="hero-name">
          {HERO.name}
        </motion.p>

        <motion.h1
          className="mt-2 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl"
          {...fade(0.25)}
          data-testid="hero-headline"
        >
          <span className="block">{HERO.titleStart}</span>
          <RotatingWord />
          <span className="block">{HERO.titleEnd}</span>
        </motion.h1>

        <motion.p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 md:text-base" {...fade(0.4)} data-testid="hero-lead">
          {HERO.lead.map((part, idx) =>
            typeof part === "string" ? part : <strong key={idx} className="font-semibold text-white">{part.b}</strong>,
          )}
        </motion.p>

        <motion.div className="mt-8" {...fade(0.5)}>
          <a href="#contact" className="btn-primary group" data-testid="hero-primary-cta">
            {HERO.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div className="mt-8 flex flex-wrap gap-2" {...fade(0.6)} data-testid="hero-tags">
          {HERO.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="lg:col-span-6"
        style={{ y }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mx-auto max-w-md lg:ml-auto" data-testid="hero-portrait">
          <div
            className="absolute -inset-16 rounded-full opacity-80"
            style={{ background: "radial-gradient(closest-side, rgba(139,61,255,0.45), rgba(139,61,255,0.12) 55%, transparent 100%)" }}
            aria-hidden="true"
          />
          <div className="relative rounded-2xl border border-[#B16CFF]/40 bg-[#0b0718] p-1.5 shadow-[0_0_40px_rgba(139,61,255,0.35)]">
            <img
              src={IMAGES.portrait}
              alt="Гюрсел Исмаилов работи на лаптоп"
              className="aspect-[3/2] w-full rounded-xl object-cover object-[68%_20%]"
              loading="eager"
            />
          </div>
          <div
            className="relative -mt-3 mx-3 flex items-center justify-between gap-4 rounded-xl border border-[#B16CFF]/30 bg-[#140b2a]/95 px-4 py-3"
            data-testid="hero-caption"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#B16CFF]/80">{HERO.caption.code}</p>
              <p className="mt-1 text-xs font-medium text-white/85">{HERO.caption.left}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{HERO.caption.rightTitle}</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-white/45">{HERO.caption.rightSub}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
