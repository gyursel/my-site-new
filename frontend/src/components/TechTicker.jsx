import Marquee from "react-fast-marquee";
import { TECH_ITEMS } from "../data/content";

export const TechTicker = () => (
  <div className="ticker-bar border-y border-[#B16CFF]/20 py-3" data-testid="tech-ticker" aria-hidden="true">
    <Marquee speed={45} gradient={false} pauseOnHover={false}>
      {TECH_ITEMS.map((item) => (
        <span key={item} className="mx-5 flex items-center gap-10 text-sm font-medium text-[#D9C2FF]">
          {item}
          <span className="text-[#B16CFF]">✦</span>
        </span>
      ))}
    </Marquee>
  </div>
);
