import { ArrowRight } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";
import { PortfolioImage } from "@/components/PortfolioImage";

const ANDROID_IMG =
  "https://images.unsplash.com/photo-1558655146-6c222b05fce4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const IOS_IMG =
  "https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const WEB_IMG =
  "https://images.unsplash.com/photo-1625461291092-13d0c45608b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

const STEPS = [
  { n: "01", t: "Консултация", d: "Обсъждаме идеята, целите и обхвата." },
  { n: "02", t: "Дизайн и план", d: "Структура, изгледи и ясен план за работа." },
  { n: "03", t: "Разработка", d: "Чист код, редовни обновления по време на работа." },
  { n: "04", t: "Публикация", d: "Тестове, публикуване и поддръжка след старта." },
];

const ServiceCard = ({ s, delay }) => (
  <Reveal delay={delay} className={s.span}>
    <div
      data-testid={`service-card-${s.id}`}
      className="group h-full rounded-3xl border border-border bg-card overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="relative aspect-[16/9] sm:aspect-[5/2] overflow-hidden">
        <PortfolioImage
          src={s.img}
          sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, calc(100vw - 2rem)"
          alt={s.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <span className="absolute top-4 left-4 font-mono-label text-[10px] uppercase tracking-[0.2em] bg-background/90 backdrop-blur border border-border rounded-full px-3 py-1.5 text-foreground">
          {s.tag}
        </span>
      </div>
      <div className="p-6 sm:p-8 -mt-6 relative">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">{s.title}</h3>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{s.desc}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {s.points.map((p) => (
            <span
              key={p}
              className="text-xs font-semibold text-foreground bg-muted hover:bg-primary/10 hover:text-primary transition-colors rounded-full px-3 py-1.5"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Reveal>
);

export const Services = () => (
  <section id="uslugi" className="py-20 sm:py-28">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHead
        eyebrow="Услуги"
        title="Какво създавам за вас"
        desc="Три основни направления, пълният цикъл — от първата консултация до публикацията в магазина и поддръжката след старта."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.id} s={s} delay={i * 0.08} />
        ))}

        <Reveal delay={0.1} className="lg:col-span-7">
          <div
            data-testid="service-card-process"
            className="h-full rounded-3xl border border-border bg-secondary p-6 sm:p-8 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Как работим заедно
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Прозрачен процес в четири стъпки — без изненади по сроковете и бюджета.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl bg-card border border-border p-4 sm:p-5 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono-label text-[11px] text-primary tracking-[0.2em]">
                    {step.n}
                  </p>
                  <p className="mt-2 font-bold text-foreground text-[15px]">{step.t}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
            <button
              data-testid="services-process-cta"
              onClick={() => scrollToId("kontakti")}
              className="group mt-6 min-h-11 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Започнете с кратко запитване
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const SERVICES = [
  {
    id: "android",
    tag: "Мобилни · Android",
    title: "Android приложения",
    desc: "Бързи и стабилни приложения с Kotlin и Jetpack Compose — от прототип до публикация в Google Play.",
    points: ["Kotlin & Compose", "Material 3", "API интеграции", "Play Store"],
    img: ANDROID_IMG,
    span: "lg:col-span-7",
  },
  {
    id: "ios",
    tag: "Мобилни · iOS",
    title: "iOS приложения",
    desc: "Елегантни приложения в духа на Apple — Swift, SwiftUI и безупречно потребителско изживяване.",
    points: ["Swift & SwiftUI", "App Store стандарт", "Push известия", "App Store"],
    img: IOS_IMG,
    span: "lg:col-span-5",
  },
  {
    id: "web",
    tag: "Уеб",
    title: "Уебсайтове и уеб приложения",
    desc: "Модерни, бързи и SEO-оптимизирани сайтове и уеб приложения, които изглеждат отлично на всякакви екрани.",
    points: ["React & Tailwind", "Бекенд и бази данни", "SEO", "Хостинг"],
    img: WEB_IMG,
    span: "lg:col-span-5",
  },
];

export default Services;