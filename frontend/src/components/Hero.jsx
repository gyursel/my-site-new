import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { useMediaQuery } from "@/hooks/use-media-query";

const EASE = [0.16, 1, 0.3, 1];

const HERO_IMG = "/images/gursel-macbook-workspace.webp";

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "112%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const desktopPointer = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[calc(100svh-5rem)] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid bg-grid-fade" aria-hidden="true" />
      <div className="absolute inset-0 hero-atmosphere pointer-events-none" aria-hidden="true" />

      <div className="hero-layout relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-12 sm:pb-16 lg:pt-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-8 lg:gap-20 items-center">
        <div className="contents lg:block min-w-0">
          <div className="order-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            data-testid="hero-availability"
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2"
          >
            <span className="pulse-dot w-2 h-2 shrink-0 rounded-full bg-primary" />
            <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Наличен за нови проекти
            </span>
          </motion.div>

          <h1 data-testid="hero-title" className="mt-5 lg:mt-7 font-display font-semibold text-foreground leading-[1.12] text-[1.625rem] min-[375px]:text-[2rem] sm:text-5xl xl:text-[3.5rem]">
            <MaskedLine delay={0.2}>ГЮРСЕЛ</MaskedLine>
            <MaskedLine delay={0.32}><span className="text-primary">ИСМАИЛОВ</span></MaskedLine>
          </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            data-testid="hero-description"
            className="order-3 lg:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            Създавам{" "}
            <span className="font-bold text-foreground">Android приложения</span>
            , <span className="font-bold text-foreground">iOS приложения</span>{" "}
            и <span className="font-bold text-foreground">уебсайтове</span> — от
            първата идея до финалната публикация, с чист код и прецизен дизайн.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="order-4 lg:mt-9 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3"
          >
            <button
              data-testid="hero-cta-contact"
              onClick={() => scrollToId("kontakti")}
              className="group min-h-12 inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] shadow-accent"
            >
              Свържи се с мен
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-cta-services"
              onClick={() => scrollToId("uslugi")}
              className="min-h-12 px-7 py-3.5 rounded-full border border-input text-sm font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Разгледай услугите
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="order-5 lg:mt-12 font-mono-label text-[11px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:flex flex-wrap gap-x-6 gap-y-2"
          >
            <span>Kotlin</span>
            <span>Swift</span>
            <span>React</span>
            <span>Tailwind</span>
            <span>FastAPI</span>
          </motion.div>
        </div>

        <motion.div
          style={{ y: desktopPointer && !reducedMotion ? yImg : 0 }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          className="order-2 lg:order-none relative min-w-0 w-full mx-auto"
        >
          <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden border border-border shadow-panel aspect-[79/53] bg-card">
            <img
              data-testid="hero-portrait-image"
              src={HERO_IMG}
              srcSet="/images/gursel-macbook-workspace-360.webp 360w, /images/gursel-macbook-workspace-640.webp 640w, /images/gursel-macbook-workspace-960.webp 960w, /images/gursel-macbook-workspace.webp 1264w"
              sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
              alt="Гюрсел Исмаилов работи на MacBook в модерен кабинет — AI обработка на авторския му портрет"
              width={1264}
              height={848}
              className="w-full h-full object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="mt-5 hidden sm:flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-t border-border pt-5">
            <div data-testid="hero-floating-card-build">
              <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-primary mb-2">
                build(«идея»)
              </p>
              <p className="text-[13px] font-semibold text-foreground">Android · iOS · Уеб</p>
            </div>
            <div data-testid="hero-floating-card-stores">
              <p className="text-[13px] font-bold text-foreground">От идея до сторе</p>
              <p className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest mt-1.5">
                Play Store · App Store
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;