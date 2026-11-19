import type { HeroSlideData } from "../lib/blocks";
import { sanityImg } from "../lib/sanity";
import SmartImage from "./SmartImage";
import { A, Rich } from "./Rich";

/** One slide of the hero: text and buttons on the left, the arched photo on the right. */
export default function HeroSlide({ s, first }: { s: HeroSlideData; first: boolean }) {
  const Heading = first ? "h1" : "h2";
  const fade = first ? "animate-fade-up" : "";
  return (
    <div className="relative grid items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-10 md:px-14 md:py-20">
      <div>
        {s.eyebrow && <p className={`${fade} text-xs uppercase tracking-[0.35em] text-champagne`}>{s.eyebrow}</p>}
        <Heading className={`${fade} mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-7xl`} style={first ? { animationDelay: ".15s" } : undefined}><Rich text={s.headline} /></Heading>
        {s.subheading && <p className={`${fade} mt-6 max-w-md text-ivory/80`} style={first ? { animationDelay: ".3s" } : undefined}>{s.subheading}</p>}
        <div className={`${fade} mt-8 flex flex-wrap gap-3 sm:gap-4`} style={first ? { animationDelay: ".45s" } : undefined}>
          {s.primaryLabel && <A href={s.primaryHref} className="rounded-full bg-champagne px-7 py-3 text-sm tracking-wide text-claret transition hover:bg-ivory sm:px-8">{s.primaryLabel}</A>}
          {s.secondaryLabel && <A href={s.secondaryHref} className="rounded-full border border-ivory/60 px-7 py-3 text-sm tracking-wide transition hover:bg-ivory hover:text-claret sm:px-8">{s.secondaryLabel}</A>}
        </div>
      </div>
      <div className={`${fade} mx-auto w-full max-w-[16rem] sm:max-w-sm`} style={first ? { animationDelay: ".3s" } : undefined}>
        <div className="aspect-[4/5] rounded-t-full border border-champagne/60 p-2">
          <div className="h-full overflow-hidden rounded-t-full"><SmartImage src={sanityImg(s.imageUrl, 900)} alt="" eager={first} /></div>
        </div>
      </div>
    </div>
  );
}
