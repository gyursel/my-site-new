import { Reveal } from "./Reveal";

const VISUALS = [
  {
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2200&q=92",
    eyebrow: "AI SYSTEMS",
    title: "Интелигентни системи, които работят за бизнеса",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2200&q=92",
    eyebrow: "AUTOMATION",
    title: "Автоматизация, данни и AI в една екосистема",
    align: "right",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=92",
    eyebrow: "DIGITAL PRODUCTS",
    title: "Модерни дигитални продукти с premium изживяване",
    align: "left",
  },
];

export const CinematicAIShowcase = ({ index = 0 }) => {
  const item = VISUALS[index % VISUALS.length];

  return (
    <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-6 md:py-10" aria-label={item.title}>
      <Reveal variant={item.align === "right" ? "right" : "left"}>
        <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[28px] border border-[#B16CFF]/30 shadow-[0_24px_80px_rgba(67,24,120,0.28)]">
          <img
            src={item.image}
            srcSet={`${item.image.replace("w=2200", "w=720")} 720w, ${item.image.replace("w=2200", "w=1200")} 1200w, ${item.image} 2200w`}
            sizes="(max-width: 767px) 100vw, 1152px"
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-[220px] w-full object-cover sm:h-[280px] saturate-[1.28] contrast-[1.08] brightness-[1.1] md:h-[390px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090513]/90 via-[#120826]/35 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090513]/75 via-transparent to-transparent" />
          <div className={`absolute inset-x-0 bottom-0 flex p-5 sm:p-7 md:p-10 ${item.align === "right" ? "justify-end text-right" : "justify-start text-left"}`}>
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.34em] text-[#00E5FF] md:text-xs">
                {item.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-extrabold sm:mt-3 sm:text-2xl leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] md:text-4xl">
                {item.title}
              </h3>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#8B3DFF]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#00E5FF]/15 blur-3xl" />
        </div>
      </Reveal>
    </section>
  );
};
