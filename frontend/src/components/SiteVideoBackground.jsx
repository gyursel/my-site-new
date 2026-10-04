import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const SiteVideoBackground = () => {
  const videoRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(!reducedMotion && !navigator.connection?.saveData);
  }, [reducedMotion]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (allowed && !paused && !document.hidden && !failed) {
        video.play().catch(() => setPaused(true));
      } else video.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [allowed, paused, failed]);
  return (
    <>
      <div className="site-video-layer" aria-hidden="true">
        <img src="/videos/electric-background.jpg" alt="" className="hero-video-poster" />
        {allowed && !failed && <video ref={videoRef} className="hero-video" muted loop playsInline preload="metadata" poster="/videos/electric-background.jpg" onError={() => setFailed(true)}>
          <source src="/videos/electric-background.mp4" type="video/mp4" />
        </video>}
      </div>
      <div className="site-video-shade" aria-hidden="true" />
      {allowed && !failed && <button type="button" className="hero-video-toggle site-video-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? "Пусни видео фона" : "Пауза на видео фона"} aria-pressed={paused}>
        {paused ? <Play size={14} /> : <Pause size={14} />}
        <span>{paused ? "Пусни фона" : "Пауза на фона"}</span>
      </button>}
    </>
  );
};


export default SiteVideoBackground;
