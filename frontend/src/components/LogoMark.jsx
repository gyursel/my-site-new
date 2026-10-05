export const LogoMark = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="gi-grad" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0" stopColor="#C9A0FF" />
        <stop offset="1" stopColor="#8B3DFF" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#gi-grad)" />
    <path
      d="M26 20L14 32l12 12M38 20l12 12-12 12M36 16l-8 32"
      fill="none"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
