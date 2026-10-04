import { Asterisk } from "lucide-react";

const ITEMS = [
  "Android",
  "Kotlin",
  "Jetpack Compose",
  "iOS",
  "Swift",
  "SwiftUI",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "FastAPI",
  "MongoDB",
  "Firebase",
  "Play Store",
  "App Store",
];

const Track = ({ hidden }) => (
  <div aria-hidden={hidden ? "true" : undefined} className="flex items-center shrink-0">
    {ITEMS.map((item, i) => (
      <span key={`${item}-${i}`} className="flex items-center">
        <span className="font-display text-3xl sm:text-5xl font-medium text-foreground px-6 sm:px-9 whitespace-nowrap">
          {item}
        </span>
        <Asterisk className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section className="py-10 sm:py-14 border-y border-border bg-secondary">
    <div className="marquee" data-testid="tech-marquee">
      <div className="marquee-track">
        <Track />
        <Track hidden />
      </div>
    </div>
  </section>
);

export default Marquee;