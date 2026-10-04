import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 36, className = "" }) => {
  const reduced = useReducedMotion();
  return (
  <motion.div
    className={className}
    initial={reduced ? false : { opacity: 0, y, scale: 0.975 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false, amount: 0.12 }}
    transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay, ease: EASE }}
  >
    {children}
  </motion.div>
  );
};

export const SectionHead = ({ eyebrow, title, desc, align = "left" }) => (
  <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
    <Reveal>
      <p className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 data-testid={`section-title-${eyebrow}`} className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-[1.12]">
        {title}
      </h2>
    </Reveal>
    {desc && (
      <Reveal delay={0.16}>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">{desc}</p>
      </Reveal>
    )}
  </div>
);

export default Reveal;
