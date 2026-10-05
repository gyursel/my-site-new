import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { Pause, Play } from "lucide-react";
import "@/App.css";
import { LightStreams } from "./components/LightStreams";
import { Navbar } from "./components/Navbar";
import { NewsTicker } from "./components/NewsTicker";
import { NewsPanel } from "./components/NewsPanel";
import { Hero } from "./components/Hero";
import { TechTicker } from "./components/TechTicker";
import { AISolutions } from "./components/AISolutions";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { ChatProvider } from "./context/ChatContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MESH_BG = [
  "radial-gradient(55% 45% at 80% 55%, rgba(0,229,255,0.10), transparent 60%)",
  "radial-gradient(50% 40% at 15% 20%, rgba(139,61,255,0.18), transparent 60%)",
  "radial-gradient(70% 60% at 60% 95%, rgba(76,0,255,0.14), transparent 60%)",
  "#06040D",
].join(", ");

const Landing = ({ paused, setPaused }) => (
  <>
    <Navbar />
    <NewsTicker />
    <NewsPanel />
    <div className="xl:pl-[400px]">
      <main>
        <Hero />
        <TechTicker />
        <AISolutions />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
    {!REDUCED && (
      <button
        onClick={() => setPaused((p) => !p)}
        className="glass-panel fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 !rounded-full px-3 py-2 text-xs text-white/80 transition-[color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-[#C9A0FF] hover:shadow-[0_0_24px_rgba(139,61,255,0.5)]"
        aria-pressed={paused}
        data-testid="bg-pause-button"
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        {paused ? "Пусни фона" : "Спри фона"}
      </button>
    )}
    <ChatWidget />
  </>
);

function App() {
  const [paused, setPaused] = useState(REDUCED);

  useEffect(() => {
    if (REDUCED) return undefined;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" data-testid="background-layer">
        <div className="absolute inset-0" style={{ background: MESH_BG }} />
        <div className="grid-overlay absolute inset-0" />
        {!REDUCED && <LightStreams paused={paused} />}
        <div className="absolute inset-0 bg-[#06040D]/60" />
      </div>

      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Landing paused={paused} setPaused={setPaused} />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>

      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}

export default App;
