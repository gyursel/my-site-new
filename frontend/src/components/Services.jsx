import { Smartphone, Globe, Bot, Database, Rocket, Compass } from "lucide-react";
import { SERVICES, SERVICES_SECTION } from "../data/content";
import { Reveal, SplitWords } from "./Reveal";
import { SectionDecor } from "./SectionDecor";

const ICONS = { Smartphone, Globe, Bot, Database, Rocket, Compass };

const IMAGE_TINTS = [
  "from-[#00E5FF]/26 via-[#4D7CFF]/8 to-[#8B3DFF]/24",
  "from-[#8B3DFF]/26 via-[#00E5FF]/8 to-[#B16CFF]/22",
  "from-[#00B8FF]/24 via-transparent to-[#D75CFF]/24",
  "from-[#B16CFF]/24 via-[#2457FF]/8 to-[#00E5FF]/24",
  "from-[#00E5FF]/24 via-[#8B3DFF]/10 to-[#FF5FD2]/18",
  "from-[#7B5CFF]/24 via-[#00E5FF]/8 to-[#B16CFF]/22",
];

export const Services = () => (
  <section id="services" className="relative mx-auto max-w-6xl xl:max-w-[1280px] px-4 py-16 sm:px-6 md:py-28" data-testid="services-section">
    <SectionDecor index="02" />
    <Reveal>
      <p className="eyebrow mb-5">{SERVICES_SECTION.eyebrow}</p>
      <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
        <SplitWords text={SERVICES_SECTION.title} />
      </h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{SERVICES_SECTION.lead}</p>
    </Reveal>

    <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:gap-6">
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
                  className="aspect-[16/9] w-full object-cover saturate-[1.38] contrast-[1.12] brightness-[1.08] transition-[transform,filter] duration-700 group-hover:scale-[1.05] group-hover:saturate-[1.52] group-hover:contrast-[1.16] group-hover:brightness-[1.12]"
                />
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${IMAGE_TINTS[i % IMAGE_TINTS.length]} mix-blend-screen opacity-70 transition-opacity duration-500 group-hover:opacity-90`} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0617]/88 via-transparent to-[#00E5FF]/[0.04]" />
                <div className="icon-tile absolute bottom-4 left-4 !mb-0 backdrop-blur-md">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
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
