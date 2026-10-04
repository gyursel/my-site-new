import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import Navbar from "@/components/Navbar";
import SiteVideoBackground from "@/components/SiteVideoBackground";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/sonner";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="app-error" role="alert" className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-lg p-6">
          Нещо се обърка. Моля, презаредете страницата.
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = () => (
  <>
    <Hero />
    <Marquee />
    <Services />
    <Projects />
    <About />
    <Contact />
  </>
);

function App() {
  const desktopPointer = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!desktopPointer || reducedMotion) return;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [desktopPointer, reducedMotion]);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <div data-testid="portfolio-app" className="dark noise bg-background text-foreground antialiased">
          <SiteVideoBackground />
          <Navbar />
          <main id="main-content" className="page-insets">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
          <Toaster theme="dark" position="bottom-center" />
        </div>
      </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;