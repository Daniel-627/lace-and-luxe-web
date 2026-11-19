import Link from "next/link";
import type { Product } from "../lib/types";
import type { Block, HeroSlideData } from "../lib/blocks";
import { A, Rich } from "./Rich";
import HeroSlide from "./HeroSlide";
import HeroSlider from "./HeroSlider";
import { sanityImg } from "../lib/sanity";
import ProductCard from "./ProductCard";
import SmartImage from "./SmartImage";
import Reveal from "./Reveal";
import Marquee from "./Marquee";

const Title = ({ eyebrow, text }: { eyebrow?: string; text?: string }) =>
  !eyebrow && !text ? null : (
    <div className="mb-10 text-center">
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>}
      {text && <h2 className="mt-2 font-serif text-4xl md:text-5xl"><Rich text={text} /></h2>}
    </div>
  );

const THEMES = { claret: "bg-claret text-ivory", champagne: "bg-champagne text-claret", rose: "bg-rose/30 text-claret" } as const;

function Render({ b, products }: { b: Block; products: Product[] }) {
  switch (b._type) {
    case "heroBlock": {
      // Slide 1 is the block's own fields (so existing homepages keep working); extra slides come from the "More slides" list.
      const first: HeroSlideData = { eyebrow: b.eyebrow, headline: b.headline, subheading: b.subheading, primaryLabel: b.primaryLabel, primaryHref: b.primaryHref, secondaryLabel: b.secondaryLabel, secondaryHref: b.secondaryHref, imageUrl: b.imageUrl };
      const extra = (b.slides ?? []).filter((x): x is HeroSlideData => !!x?.headline?.trim());
      const slides = [first, ...extra];
      return (
        <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-claret via-claret to-[#7a3042] text-ivory sm:rounded-[2rem]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-rose/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-80 w-80 animate-float rounded-full bg-champagne/20 blur-3xl" />
          {slides.length > 1
            ? <HeroSlider seconds={b.seconds}>{slides.map((s, k) => <HeroSlide key={k} s={s} first={k === 0} />)}</HeroSlider>
            : <HeroSlide s={first} first />}
        </section>
      );
    }

    case "tickerBlock":
      return b.items?.length ? <Marquee items={b.items} /> : null;

    case "categoryRowBlock": {
      const cats = Array.from(new Map(products.filter((p) => p.category).map((p) => [p.category!.slug, p.category!])).values());
      if (!cats.length) return null;
      return (
        <section>
          <Reveal><Title eyebrow={b.eyebrow} text={b.title} /></Reveal>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {cats.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/shop?category=${c.slug}`} className="group flex flex-col items-center gap-3 text-center">
                  <div className="h-28 w-28 overflow-hidden rounded-full bg-rose/20 ring-1 ring-champagne/50 transition duration-500 group-hover:ring-4 group-hover:ring-champagne/60 md:h-36 md:w-36">
                    <SmartImage src={sanityImg(products.find((p) => p.category?.slug === c.slug)?.image ?? undefined, 400)} alt={c.name} className="transition duration-700 group-hover:scale-110" />
                  </div>
                  <span className="font-serif text-xl">{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      );
    }

    case "productRowBlock": {
      const list = (b.category ? products.filter((p) => p.category?.slug === b.category) : products).slice(0, b.limit ?? 8);
      return (
        <section>
          <Reveal><Title eyebrow={b.eyebrow} text={b.title} /></Reveal>
          {list.length === 0 ? <p className="text-center text-claret/70">Products are on their way.</p> : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
              {list.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 90}><ProductCard p={p} /></Reveal>)}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href={b.category ? `/shop?category=${b.category}` : "/shop"} className="rounded-full border border-claret px-8 py-3 text-sm tracking-wide transition hover:bg-claret hover:text-ivory">View all products</Link>
          </div>
        </section>
      );
    }

    case "bannerPairBlock":
      return (
        <section className={`grid gap-5 ${b.banners?.length === 1 ? "" : "md:grid-cols-2"}`}>
          {(b.banners ?? []).map((x, i) => (
            <Reveal key={i} delay={i * 120}>
              <A href={x.href} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl">
                <SmartImage src={sanityImg(x.imageUrl, 1000)} alt="" className="transition duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-claret/85 via-claret/25 to-transparent" />
                <div className="absolute bottom-7 left-7 text-ivory">
                  {x.title && <h3 className="font-serif text-4xl italic">{x.title}</h3>}
                  {x.subtitle && <p className="mt-1 text-sm text-ivory/80">{x.subtitle}</p>}
                  <span className="mt-4 inline-block border-b border-champagne pb-0.5 text-sm text-champagne transition-all group-hover:pr-3">Explore →</span>
                </div>
              </A>
            </Reveal>
          ))}
        </section>
      );

    case "promoBlock":
      return (
        <Reveal>
          <section className={`overflow-hidden rounded-3xl ${THEMES[b.theme ?? "claret"]}`}>
            <div className={`grid items-center ${b.imageUrl ? "md:grid-cols-2" : ""}`}>
              <div className="p-8 md:p-14">
                {b.code && <p className="mb-4 inline-block rounded-full border border-dashed border-current px-4 py-1 text-xs uppercase tracking-[0.2em]">Code: {b.code}</p>}
                {b.title && <h2 className="font-serif text-4xl md:text-5xl"><Rich text={b.title} /></h2>}
                {b.text && <p className="mt-4 max-w-md opacity-85">{b.text}</p>}
                {b.ctaLabel && <A href={b.ctaHref} className="mt-6 inline-block rounded-full border border-current px-8 py-3 text-sm tracking-wide transition hover:opacity-80">{b.ctaLabel}</A>}
              </div>
              {b.imageUrl && <div className="aspect-[4/3] md:aspect-auto md:h-full"><SmartImage src={sanityImg(b.imageUrl, 1000)} alt="" /></div>}
            </div>
          </section>
        </Reveal>
      );

    case "adBlock":
      return (
        <Reveal>
          <A href={b.href} className="relative block aspect-[16/7] overflow-hidden rounded-3xl bg-rose/15">
            <SmartImage src={sanityImg(b.imageUrl, 1400)} alt={b.alt ?? ""} />
            {b.sponsored !== false && <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">Sponsored</span>}
          </A>
        </Reveal>
      );

    case "textMediaBlock": {
      const left = b.imageSide === "left";
      const isFile = b.videoUrl && /\.(mp4|webm)(\?|$)/i.test(b.videoUrl);
      return (
        <Reveal>
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div className={`aspect-[4/3] overflow-hidden rounded-3xl bg-rose/15 ${left ? "" : "md:order-2"}`}>
              {isFile
                ? <video src={b.videoUrl} controls preload="none" playsInline className="h-full w-full object-cover" />
                : <SmartImage src={sanityImg(b.imageUrl, 1000)} alt="" />}
            </div>
            <div>
              {b.eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-champagne">{b.eyebrow}</p>}
              {b.title && <h2 className="mt-2 font-serif text-4xl md:text-5xl"><Rich text={b.title} /></h2>}
              {b.body && <p className="mt-4 whitespace-pre-line text-claret/80">{b.body}</p>}
              <div className="mt-6 flex flex-wrap gap-4">
                {b.ctaLabel && <A href={b.ctaHref} className="rounded-full bg-claret px-8 py-3 text-sm tracking-wide text-ivory transition hover:bg-claret/90">{b.ctaLabel}</A>}
                {b.videoUrl && !isFile && <A href={b.videoUrl} className="rounded-full border border-claret px-8 py-3 text-sm tracking-wide transition hover:bg-claret hover:text-ivory">Watch the video</A>}
              </div>
            </div>
          </section>
        </Reveal>
      );
    }

    case "promisesBlock":
      return (
        <section className="rounded-3xl bg-rose/15 px-8 py-14 md:px-14">
          <Reveal><Title eyebrow={b.eyebrow} text={b.title} /></Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {(b.items ?? []).map((x, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="font-serif text-5xl italic text-champagne">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-2xl">{x.title}</h3>
                <p className="mt-2 text-sm text-claret/80">{x.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "ctaBlock":
      return (
        <Reveal>
          <section className="rounded-3xl bg-claret px-8 py-16 text-center text-ivory">
            {b.heading && <h2 className="font-serif text-4xl md:text-6xl"><Rich text={b.heading} /></h2>}
            {b.buttonLabel && <A href={b.buttonHref} className="mt-8 inline-block rounded-full bg-champagne px-10 py-3 text-sm tracking-wide text-claret transition hover:bg-ivory">{b.buttonLabel}</A>}
          </section>
        </Reveal>
      );

    default:
      return null;
  }
}

export default function Blocks({ blocks, products }: { blocks: Block[]; products: Product[] }) {
  return <>{blocks.map((b, i) => <Render key={b._key ?? i} b={b} products={products} />)}</>;
}
