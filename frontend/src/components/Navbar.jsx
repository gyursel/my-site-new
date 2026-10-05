import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { BRAND, NAV_LINKS } from "../data/content";
import { LogoMark } from "./LogoMark";
import { useChat } from "../context/ChatContext";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { openWithPrompt } = useChat();

  return (
    <header className="fixed inset-x-0 top-0 z-50" data-testid="navbar">
      <nav className="border-b border-white/[0.06] bg-[#06040D]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
            <LogoMark className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-wide">{BRAND}</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-testid={`nav-link-${l.id}`}
                className="nav-link"
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

      {open && (
        <div className="glass-panel mx-4 mt-2 flex flex-col gap-1 p-4 md:hidden" data-testid="nav-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-testid={`nav-mobile-link-${l.id}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-white/80 transition-[background-color,color,transform] duration-300 hover:translate-x-1 hover:bg-[#8B3DFF]/15 hover:text-[#C9A0FF]"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="btn-ghost justify-start px-4 py-3"
            onClick={() => { setOpen(false); openWithPrompt(""); }}
            data-testid="nav-mobile-ask-ai"
          >
            <Sparkles className="h-4 w-4 text-[#C9A0FF]" aria-hidden="true" /> Питай AI
          </button>
        </div>
      )}
    </header>
  );
};
