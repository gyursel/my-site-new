import { useState } from "react";
import { Newspaper, Minus, ExternalLink } from "lucide-react";
import { useNews } from "../hooks/useNews";

export const NewsPanel = () => {
  const { data: items = [], isLoading } = useNews();
  const [open, setOpen] = useState(true);

  const list = items.slice(0, 30);
  const duration = Math.max(60, list.length * 5);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-panel fixed left-4 top-[92px] z-40 inline-flex items-center gap-2 !rounded-full px-3 py-2 text-xs font-medium text-white/85 transition-[color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:text-[#C9A0FF] hover:shadow-[0_0_24px_rgba(139,61,255,0.5)]"
        data-testid="news-panel-toggle"
        aria-expanded={false}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A0FF] pulse-dot" aria-hidden="true" />
        Новини
      </button>
    );
  }

  return (
    <aside
      className="glass-panel fixed left-4 top-[92px] z-40 hidden w-[360px] flex-col overflow-hidden xl:flex"
      data-testid="news-panel"
      aria-label="Новини на живо"
    >
      <div className="flex items-center justify-between border-b border-[#B16CFF]/25 px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A0FF]">
          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" /> Новини
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#C9A0FF] pulse-dot" aria-hidden="true" />
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="icon-btn !p-1 text-white/50 hover:text-white"
          aria-label="Скрий новините"
          data-testid="news-panel-close"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="news-scroll relative h-[min(640px,calc(100vh-190px))] overflow-hidden" data-testid="news-panel-list">
        {isLoading && <p className="p-4 text-xs text-white/40">Зареждане на новините…</p>}
        {list.length > 0 && (
          <div className="news-track" style={{ animationDuration: `${duration}s` }}>
            {[...list, ...list].map((n, i) => (
              <a
                key={`${n.link}-${i}`}
                href={n.link}
                target="_blank"
                rel="noreferrer"
                className="news-item group block border-b border-white/[0.06] px-4 py-3.5"
                data-testid="news-panel-item"
              >
                <p className="font-mono text-[9px] font-medium uppercase tracking-[0.25em] text-[#B16CFF]">{n.category}</p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-white/85 transition-colors group-hover:text-white">{n.title}</p>
                <p className="mt-1.5 flex items-center gap-1 font-mono text-[9px] text-white/40">
                  {n.source} <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
