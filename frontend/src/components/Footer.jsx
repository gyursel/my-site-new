import { Link } from "react-router-dom";
import { ArrowUp, Lock } from "lucide-react";
import { BRAND, TECH_ITEMS } from "../data/content";
import { LogoMark } from "./LogoMark";

export const Footer = () => (
  <footer className="border-t border-white/5 px-6 py-10" data-testid="footer">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <span className="text-sm font-semibold">{BRAND}</span>
        </div>
        <p className="text-sm text-white/40">© {new Date().getFullYear()} {BRAND}. Всички права запазени.</p>
        <div className="flex items-center gap-5">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-white/35 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-[#C9A0FF]" data-testid="footer-admin-link">
            <Lock className="h-3 w-3" aria-hidden="true" /> Админ
          </Link>
          <a
            href="#intro"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors duration-300 hover:text-[#C9A0FF]"
            data-testid="footer-back-to-top"
          >
            Обратно нагоре
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
        {TECH_ITEMS.map((t) => (
          <span key={t} className="font-mono text-[11px] text-white/30">{t}</span>
        ))}
      </div>
    </div>
  </footer>
);
