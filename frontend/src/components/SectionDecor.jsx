import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const SectionDecor = ({ index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const x = useTransform(scrollYProgress, [0, 0.35], [160, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="section-divider absolute inset-x-6 top-0 h-px origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="section-number absolute -top-6 right-2 select-none md:right-6"
        style={{ y, x, opacity }}
        data-testid={`section-number-${index}`}
      >
        {index}
      </motion.span>
    </div>
  );
};
