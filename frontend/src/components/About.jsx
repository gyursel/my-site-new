import { motion } from "framer-motion";
import { Reveal, SectionHead } from "@/components/Reveal";
import { PortfolioImage } from "@/components/PortfolioImage";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

const VALUES = ["Чист код", "Ясна комуникация", "Точни срокове", "Поддръжка след проекта"];

const SKILLS = [
  { label: "Android — Kotlin / Jetpack Compose", pct: 95 },
  { label: "iOS — Swift / SwiftUI", pct: 90 },
  { label: "Уеб — React / Tailwind CSS", pct: 92 },
  { label: "Бекенд — FastAPI / Node.js", pct: 88 },
  { label: "Бази данни — MongoDB / SQL", pct: 86 },
  { label: "UI/UX имплементация", pct: 85 },
];

export const About = () => (
  <section id="za-men" className="py-20 sm:py-28">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      <div>
        <SectionHead
          eyebrow="За мен"
          title="Разработчик, който мисли за вашия бизнес"
        />
        <Reveal delay={0.15}>
          <div className="mt-6 space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              Здравейте! Аз съм Гюрсел — разработчик, който обича детайла.
              Помагам на бизнеси и предприемачи да превърнат идеите си в
              дигитални продукти: мобилни приложения за Android и iOS и
              уебсайтове, които правят впечатление.
            </p>
            <p>
              Работя с модерен стек — Kotlin, Swift и React — и подхождам към
              всеки проект с внимание към производителността, сигурността и
              лесната поддръжка. Комуникирам ясно, спазвам сроковете и оставам
              включен и след предаването на проекта.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {VALUES.map((v) => (
              <span
                key={v}
                className="text-sm font-semibold text-foreground border border-border bg-card rounded-full px-4 py-2"
              >
                {v}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 space-y-5">
          {SKILLS.map((s, i) => (
            <div key={s.label} data-testid={`about-skill-bar-${i}`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="min-w-0 text-sm font-semibold text-foreground">{s.label}</p>
                <p className="shrink-0 font-mono-label text-[11px] text-muted-foreground">{s.pct}%</p>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.1, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Reveal delay={0.2} className="lg:sticky lg:top-28">
        <div className="relative">
          <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-panel aspect-[4/3]">
            <PortfolioImage
              src={ABOUT_IMG}
              sizes="(min-width: 1280px) 568px, (min-width: 1024px) 48vw, calc(100vw - 2rem)"
              alt="Работна среда с няколко монитора за разработка"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
          </div>
          <div className="relative -mt-10 ml-6 mr-2 rounded-2xl bg-card border border-border shadow-xl p-5 sm:p-6">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-primary">
              Фокус
            </p>
            <p className="mt-2 text-sm sm:text-base font-semibold text-foreground leading-relaxed">
              Android · iOS · Уеб — един разработчик за целия продукт, без
              загуба на време между различни изпълнители.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default About;