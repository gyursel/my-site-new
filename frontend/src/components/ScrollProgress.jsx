import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{ scaleX, background: "linear-gradient(90deg, #00f3ff, #8af6ff, #087ca8)", boxShadow: "0 0 12px rgba(0,243,255,0.9)" }}
      data-testid="scroll-progress"
      aria-hidden="true"
    />
  );
};
