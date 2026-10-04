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
        <span className="ribbon-label whitespace-nowrap">
          {item}
        </span>
        <Asterisk className="ribbon-separator shrink-0" />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section className="tech-ribbon">
    <div className="marquee" data-testid="tech-marquee">
      <div className="marquee-track">
        <Track />
        <Track hidden />
      </div>
    </div>
  </section>
);

export default Marquee;