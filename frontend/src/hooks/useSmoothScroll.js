import { useEffect } from "react";
import Lenis from "lenis";

export const useSmoothScroll = () => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const smallScreen = window.innerWidth < 768;

    if (reduced || coarse || smallScreen) {
      window.__lenis = null;
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: { offset: -88 },
    });

    window.__lenis = lenis;
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, []);
};

export const scrollToHash = (hash) => {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -88 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};
