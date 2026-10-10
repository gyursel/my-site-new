import { ABOUT, IMAGES } from "../data/content";
import { CountUp, Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

export const About = () => (
  <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28" data-testid="about-section">
    <SectionDecor index="04" />
    <div className="grid grid-cols-1 items-center gap-9 md:gap-12 lg:grid-cols-12">
      <Reveal variant="left" className="lg:col-span-5">
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
            className="relative aspect-[4/5] w-full rounded-2xl border border-[#B16CFF]/40 object-cover object-[68%_20%] transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </Reveal>

      <Reveal variant="right" delay={0.1} className="lg:col-span-7">
        <p className="eyebrow mb-5">{ABOUT.eyebrow}</p>
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          <SplitWords text={ABOUT.title} />
        </h2>
        {ABOUT.paragraphs.map((p) => (
          <p key={p} className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">{p}</p>
        ))}
        <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-4" data-testid="about-stats">
          {ABOUT.stats.map((s, i) => (
            <Reveal key={s.label} delay={0.2 + i * 0.1} variant="scale">
              <div className="glass-card p-4 sm:p-5">
                <CountUp value={s.value} className="text-3xl font-extrabold text-[#C9A0FF]" data-testid={`about-stat-${i}`} />
                <p className="mt-1 text-xs text-white/55">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
