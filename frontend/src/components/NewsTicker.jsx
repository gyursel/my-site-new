import Marquee from "react-fast-marquee";
import { useNews } from "../hooks/useNews";

export const NewsTicker = () => {
  const { data: items = [] } = useNews();
  return (
    <div
      className="fixed inset-x-0 top-[57px] z-40 flex items-center overflow-hidden border-b border-white/[0.06] bg-[#0b0718]/92"
      data-testid="news-ticker"
    >
      <span className="flex shrink-0 items-center gap-2 bg-[#8B3DFF] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white pulse-dot" aria-hidden="true" />
        Новини на живо
      </span>
      {items.length > 0 ? (
        <Marquee speed={40} gradient={false} pauseOnHover>
          {items.slice(0, 20).map((n) => (
            <a
              key={n.link}
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="mx-6 flex items-center gap-6 py-1.5 text-xs text-white/70 transition-colors hover:text-white"
              data-testid="news-ticker-item"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#B16CFF]">{n.category}</span>
              {n.title}
              <span className="font-mono text-[10px] text-[#B16CFF]">✦</span>
            </a>
          ))}
        </Marquee>
      ) : (
        <span className="px-4 py-1.5 text-xs text-white/40" data-testid="news-ticker-loading">Зареждане на новините…</span>
      )}
    </div>
  );
};
