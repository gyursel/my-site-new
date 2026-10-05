import { Smartphone, Globe, Bot, Database, Rocket, Compass } from "lucide-react";
import { SERVICES, SERVICES_SECTION } from "../data/content";
import { Reveal } from "./Reveal";

const ICONS = { Smartphone, Globe, Bot, Database, Rocket, Compass };

export const Services = () => (
  <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:py-28" data-testid="services-section">
    <Reveal>
      <p className="eyebrow mb-4">{SERVICES_SECTION.eyebrow}</p>
      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{SERVICES_SECTION.title}</h2>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">{SERVICES_SECTION.lead}</p>
    </Reveal>

    <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s, i) => {
        const Icon = ICONS[s.icon];
        return (
          <Reveal key={s.title} delay={i * 0.07}>
            <article className="glass-card h-full p-6" data-testid={`service-card-${i}`}>
              <div className="icon-tile mb-5">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold md:text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{s.text}</p>
              <p className="meta-mono mt-4">{s.meta}</p>
            </article>
          </Reveal>
        );
      })}
    </div>
  </section>
);
