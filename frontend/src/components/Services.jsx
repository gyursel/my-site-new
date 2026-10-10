import { Smartphone, Globe, Bot, Database, Rocket, Compass } from "lucide-react";
import { SERVICES, SERVICES_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

const ICONS = { Smartphone, Globe, Bot, Database, Rocket, Compass };

export const Services = () => (
  <section id="services" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32" data-testid="services-section">
    <SectionDecor index="02" />
    <Reveal>
      <p className="eyebrow mb-5">{SERVICES_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={SERVICES_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{SERVICES_SECTION.lead}</p>
    </Reveal>

    <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s, i) => {
        const Icon = ICONS[s.icon];
        return (
          <Reveal key={s.title} delay={(i % 3) * 0.1} variant="blur">
            <article className="glass-card group h-full overflow-hidden" data-testid={`service-card-${i}`}>
              <div className="relative overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover saturate-[1.2] contrast-[1.07] brightness-[1.08] transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120927]/80 via-transparent to-transparent" />
                <div className="icon-tile absolute bottom-4 left-4 !mb-0 backdrop-blur-md">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold md:text-lg">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{s.text}</p>
                <p className="meta-mono mt-4">{s.meta}</p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  </section>
);
