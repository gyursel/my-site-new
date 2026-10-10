import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { useSmoothScroll, scrollToHash } from "@/hooks/useSmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { LightStreams } from "@/components/LightStreams";
import { Hero } from "@/components/Hero";
import { TechTicker } from "@/components/TechTicker";
import { AISolutions } from "@/components/AISolutions";
import { CinematicAIShowcase } from "@/components/CinematicAIShowcase";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Estimator } from "@/components/Estimator";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { CustomCursor } from "@/components/CustomCursor";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import CaseStudy from "@/pages/CaseStudy";

const useCardGlow = () => {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return undefined;

    let raf = 0;
    let lastEvent = null;

    const paint = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      const card = e.target.closest?.(".glass-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left - rect.width / 2}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top - rect.height / 2}px`);
    };

    const onMove = (e) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
};

const Home = () => {
  const { open } = useChat();
  useSmoothScroll();
  useCardGlow();
  return (
    <div className="relative" data-testid="home-page">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <LightStreams paused={open} />
        <div className="grid-overlay absolute inset-0" />
        <div className="noise absolute inset-0" />
      </div>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TechTicker />
        <AISolutions />
        <CinematicAIShowcase index={0} />
        <Services />
        <CinematicAIShowcase index={1} />
        <Projects />
        <About />
        <CinematicAIShowcase index={2} />
        <Estimator />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => scrollToHash(hash), 250);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <ScrollToTop />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<CaseStudy />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Toaster theme="dark" position="top-center" richColors toastOptions={{ className: "font-sans" }} />
      </ChatProvider>
    </BrowserRouter>
  );
}
