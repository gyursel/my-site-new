import { LogoMark } from "@/components/Logo";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

const NAV = [
  { id: "uslugi", label: "Услуги" },
  { id: "proekti", label: "Проекти" },
  { id: "za-men", label: "За мен" },
  { id: "kontakti", label: "Контакти" },
];

export const Footer = () => (
  <footer data-testid="site-footer" className="page-insets bg-background text-foreground border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-[calc(6rem+var(--safe-bottom))] sm:pb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="w-10 h-10 shrink-0" />
            <span className="font-display text-sm sm:text-base font-semibold">Гюрсел Исмаилов</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
            Android приложения, iOS приложения и уебсайтове — от идеята до
            публикацията, с чист код и внимание към детайла.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Навигация
          </p>
          {NAV.map((n) => (
            <button
              key={n.id}
              data-testid={`footer-link-${n.id}`}
              onClick={() => scrollToId(n.id)}
              className="min-h-11 text-left text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Контакти
          </p>
          <a
            href="mailto:hello@gursel.dev"
            data-testid="footer-email-link"
            className="min-h-11 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <Mail className="w-4 h-4" /> hello@gursel.dev
          </a>
          <a
            href="tel:+359880000000"
            data-testid="footer-phone-link"
            className="min-h-11 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <Phone className="w-4 h-4" /> +359 88 000 0000
          </a>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="#"
              data-testid="footer-social-linkedin"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-input flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="footer-social-github"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full border border-input flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 select-none overflow-hidden" aria-hidden="true">
        <p className="font-display font-semibold text-2xl sm:text-4xl lg:text-6xl xl:text-7xl leading-tight text-primary/10">
          ГЮРСЕЛ ИСМАИЛОВ
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <p data-testid="footer-copyright" className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Гюрсел Исмаилов. Всички права запазени.
        </p>
        <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Android · iOS · Уеб
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;