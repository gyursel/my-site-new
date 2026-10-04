import { useEffect, useState } from "react";

// iOS keyboards resize the visual viewport, not necessarily the layout viewport.
export const useVisualViewport = (enabled) => {
  const [style, setStyle] = useState({});
  useEffect(() => {
    if (!enabled) return;
    const viewport = window.visualViewport;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (viewport && viewport.scale !== 1) return;
        setStyle({
          "--visible-height": `${viewport?.height ?? window.innerHeight}px`,
          "--visible-top": `${viewport?.offsetTop ?? 0}px`,
        });
      });
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);
  return enabled ? style : {};
};