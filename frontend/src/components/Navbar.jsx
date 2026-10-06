import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { BRAND, NAV_LINKS } from "../data/content";
import { LogoMark } from "./LogoMark";
import { useChat } from "../context/ChatContext";

const useScrolled = (threshold = 24) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
};

const useActiveSection = (ids) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
};

const IDS = NAV_LINKS.map((l) => l.id);

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { openWithPrompt } = useChat();
  const scrolled = useScrolled();
  const active = useActiveSection(IDS);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      data-testid="navbar"
      data-scrolled={scrolled}
    >
      <nav className={`nav-shell ${scrolled ? "nav-shell--glass" : ""}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="group flex items-center gap-3" data-testid="nav-logo">
            <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
            <span className="text-sm font-bold tracking-wide">{BRAND}</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-testid={`nav-link-${l.id}`}
                className={`nav-link ${active === l.id ? "nav-link--active" : ""}`}
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button type="button" className="btn-ghost" onClick={() => openWithPrompt("")} data-testid="nav-ask-ai">
              <Sparkles className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" />
              Питай AI
            </button>
            <a href="#contact" className="btn-primary !px-5 !py-2" data-testid="nav-cta">
              Свържи се
            </a>
          </div>

          <button
            className="icon-btn md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
            data-testid="nav-menu-toggle"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel mx-4 mt-2 flex flex-col gap-1 p-4 md:hidden"
            data-testid="nav-mobile-menu"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                data-testid={`nav-mobile-link-${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="rounded-xl px-4 py-3 text-base font-semibold text-white/80 transition-[background-color,color,transform] duration-300 hover:translate-x-1 hover:bg-[#8B3DFF]/15 hover:text-[#C9A0FF]"
              >
                {l.label}
              </motion.a>
            ))}
            <button
              type="button"
              className="btn-ghost justify-start px-4 py-3"
              onClick={() => { setOpen(false); openWithPrompt(""); }}
              data-testid="nav-mobile-ask-ai"
            >
              <Sparkles className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" /> Питай AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
