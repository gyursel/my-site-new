import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } },
};

const MOBILE_VARIANT = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const Reveal = ({ children, delay = 0, variant = "up", duration = 0.7, className = "", ...rest }) => {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const variants = reduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : (isMobile ? MOBILE_VARIANT : VARIANTS[variant]);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ duration: isMobile ? 0.38 : duration, delay: isMobile ? Math.min(delay, 0.08) : delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

const WORD = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const SplitWords = ({ text, delay = 0, stagger = 0.05, className = "", as: Tag = "span" }) => {
  const MotionTag = motion[Tag];
  const words = text.split(" ");
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (reduceMotion || isMobile) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden="true">
          <motion.span className="inline-block" variants={WORD}>
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
};

export const CountUp = ({ value, className = "", ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : String(value);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, mv, target]);

  useEffect(() => {
    if (reduceMotion) {
      if (ref.current) ref.current.textContent = `${target}${suffix}`;
      return undefined;
    }
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [spring, suffix, reduceMotion, target]);

  return (
    <span ref={ref} className={className} {...rest}>
      {match ? `0${suffix}` : value}
    </span>
  );
};
