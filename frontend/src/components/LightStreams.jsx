import { useEffect, useRef } from "react";

export const LightStreams = ({ paused }) => {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let raf;
    let scrollTimer;
    let scrolling = false;
    let w = 0;
    let h = 0;
    const dpr = 1;
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const COUNT = isMobile ? 3 : 5;
    const streams = Array.from({ length: COUNT }, (_, i) => ({
      yBase: (i + 0.5) / COUNT,
      amp: 40 + Math.random() * 90,
      freq: 0.0016 + Math.random() * 0.0016,
      speed: 0.5 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
      hue: i % 3 === 0 ? "0,229,255" : "139,61,255",
      width: 1 + Math.random() * 1.2,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of streams) {
        ctx.beginPath();
        const yb = s.yBase * h;
        for (let x = -20; x <= w + 20; x += 48) {
          const y =
            yb +
            Math.sin(x * s.freq + t * 0.001 * s.speed + s.phase) * s.amp +
            Math.sin(x * s.freq * 0.5 - t * 0.0006 + s.phase * 2) * s.amp * 0.5;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${s.hue},0.07)`;
        ctx.lineWidth = s.width + 5;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${s.hue},0.36)`;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }
    };

    const onScroll = () => {
      scrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrolling = false;
      }, 90);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let last = 0;
    const loop = (t) => {
      if (!pausedRef.current && !scrolling && t - last > 41) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      data-testid="light-streams-canvas"
    />
  );
};
