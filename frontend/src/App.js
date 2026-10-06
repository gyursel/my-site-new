import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { NewsTicker } from "@/components/NewsTicker";
import { NewsPanel } from "@/components/NewsPanel";
import { LightStreams } from "@/components/LightStreams";
import { Hero } from "@/components/Hero";
import { TechTicker } from "@/components/TechTicker";
import { AISolutions } from "@/components/AISolutions";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const useCardGlow = () => {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.(".glass-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left - r.width / 2}px`);
      card.style.setProperty("--my", `${e.clientY - r.top - r.height / 2}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
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
      <NewsTicker />
      <NewsPanel />
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
      <ChatWidget />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Toaster theme="dark" position="top-center" richColors toastOptions={{ className: "font-sans" }} />
      </ChatProvider>
    </BrowserRouter>
  );
}
