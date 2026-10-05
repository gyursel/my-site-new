import { ABOUT, IMAGES } from "../data/content";
import { Reveal } from "./Reveal";

export const About = () => (
  <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-28" data-testid="about-section">
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <Reveal className="lg:col-span-5">
        <div className="relative mx-auto max-w-sm">
          <div
            className="absolute -inset-16 rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, rgba(139,61,255,0.4), rgba(139,61,255,0.1) 55%, transparent 100%)" }}
            aria-hidden="true"
          />
          <img
            src={IMAGES.portrait}
            alt="Гюрсел Исмаилов"
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-2xl border border-[#B16CFF]/40 object-cover object-[68%_20%]"
          />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-7">
        <p className="eyebrow mb-4">{ABOUT.eyebrow}</p>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{ABOUT.title}</h2>
        {ABOUT.paragraphs.map((p) => (
          <p key={p} className="mt-5 text-sm leading-relaxed text-white/65 md:text-base">{p}</p>
        ))}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="about-stats">
          {ABOUT.stats.map((s) => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-2xl font-extrabold text-[#C9A0FF]">{s.value}</p>
              <p className="mt-1 text-xs text-white/55">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
