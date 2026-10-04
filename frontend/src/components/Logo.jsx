export const LogoMark = ({ className = "w-9 h-9" }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="16" fill="hsl(var(--primary))" />
    <path
      d="M26 20 L14 32 L26 44"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38 20 L50 32 L38 44"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="32" r="3.5" fill="hsl(var(--primary-foreground))" />
  </svg>
);

export const Logo = () => (
  <button
    data-testid="logo-home-button"
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
    className="flex items-center gap-2.5 group min-w-0 min-h-11"
  >
    <LogoMark className="w-9 h-9 shrink-0 transition-transform duration-300 group-hover:rotate-6" />
    <span className="font-display text-[11px] min-[375px]:text-[13px] font-semibold text-foreground">
      Гюрсел Исмаилов
    </span>
  </button>
);

export default Logo;