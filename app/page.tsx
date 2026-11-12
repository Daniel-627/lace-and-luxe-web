import Link from "next/link";
import { getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import SmartImage from "../components/SmartImage";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";

// Edit the words on the home page here.
const TICKER = ["Order on WhatsApp", "Pay with M-Pesa", "Discreet packaging", "Delivered across Kenya", "Size help on every product"];
const PROMISES: [string, string][] = [
  ["Order your way", "Pay with M-Pesa at checkout, or send your order on WhatsApp."],
  ["Discreet by design", "Plain packaging and neutral messages. Only you know what is inside."],
  ["Help with sizing", "A size guide on every product, and real people to ask."],
];
const BANNERS: [string, string, string, string][] = [
  ["For her", "Lace, satin and everyday comfort", "/shop", "/images/for-her.jpg"],
  ["For him", "Soft, supportive essentials", "/shop?category=mens-underwear", "/images/for-him.jpg"],
];

const Title = ({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) => (
  <div className="mb-10 text-center">
    <p className="text-xs uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>
    <h2 className="mt-2 font-serif text-4xl md:text-5xl">{children}</h2>
  </div>
);

export const dynamic = "force-dynamic"; // load products when the page is visited, not at build time

export default async function Home() {
  const products = await getProducts();
  const cats = Array.from(new Map(products.filter((p) => p.category).map((p) => [p.category!.slug, p.category!])).values());

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-claret via-claret to-[#7a3042] text-ivory">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-rose/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 h-80 w-80 animate-float rounded-full bg-champagne/20 blur-3xl" />
        <div className="relative grid items-center gap-10 px-8 py-14 md:grid-cols-2 md:px-14 md:py-20">
          <div>
            <p className="animate-fade-up text-xs uppercase tracking-[0.35em] text-champagne">Lace &amp; Luxe Delicates</p>
            <h1 className="mt-5 animate-fade-up font-serif text-5xl leading-[1.05] md:text-7xl" style={{ animationDelay: ".15s" }}>
              Soft lace,<br /><em>quiet</em> luxury.
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-ivory/80" style={{ animationDelay: ".3s" }}>
              Lingerie, sleepwear and everyday essentials, for her and for him.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-4" style={{ animationDelay: ".45s" }}>
              <Link href="/shop" className="rounded-full bg-champagne px-8 py-3 text-sm tracking-wide text-claret transition hover:bg-ivory">Shop now</Link>
              <Link href="/shop?category=mens-underwear" className="rounded-full border border-ivory/60 px-8 py-3 text-sm tracking-wide transition hover:bg-ivory hover:text-claret">Shop for him</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm animate-fade-up" style={{ animationDelay: ".3s" }}>
            <div className="aspect-[4/5] rounded-t-full border border-champagne/60 p-2">
              <div className="h-full overflow-hidden rounded-t-full"><SmartImage src="/images/hero.jpg" alt="" /></div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={TICKER} />

      {/* Categories */}
      {cats.length > 0 && (
        <section>
          <Reveal><Title eyebrow="Shop by category">Find your <em>perfect</em> fit</Title></Reveal>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {cats.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/shop?category=${c.slug}`} className="group flex flex-col items-center gap-3 text-center">
                  <div className="h-28 w-28 overflow-hidden rounded-full bg-rose/20 ring-1 ring-champagne/50 transition duration-500 group-hover:ring-4 group-hover:ring-champagne/60 md:h-36 md:w-36">
                    <SmartImage src={products.find((p) => p.category?.slug === c.slug)?.image} alt={c.name} className="transition duration-700 group-hover:scale-110" />
                  </div>
                  <span className="font-serif text-xl">{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* New arrivals */}
      <section>
        <Reveal><Title eyebrow="Just in">New <em>arrivals</em></Title></Reveal>
        {products.length === 0 ? (
          <p className="text-center text-claret/70">Products are on their way.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {products.slice(0, 8).map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}><ProductCard p={p} /></Reveal>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/shop" className="rounded-full border border-claret px-8 py-3 text-sm tracking-wide transition hover:bg-claret hover:text-ivory">View all products</Link>
        </div>
      </section>

      {/* For her / for him */}
      <section className="grid gap-5 md:grid-cols-2">
        {BANNERS.map(([title, sub, href, img], i) => (
          <Reveal key={title} delay={i * 120}>
            <Link href={href} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl">
              <SmartImage src={img} alt="" className="transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-claret/85 via-claret/25 to-transparent" />
              <div className="absolute bottom-7 left-7 text-ivory">
                <h3 className="font-serif text-4xl italic">{title}</h3>
                <p className="mt-1 text-sm text-ivory/80">{sub}</p>
                <span className="mt-4 inline-block border-b border-champagne pb-0.5 text-sm text-champagne transition-all group-hover:pr-3">Explore →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* Promises */}
      <section className="rounded-3xl bg-rose/15 px-8 py-14 md:px-14">
        <Reveal><Title eyebrow="Why Lace &amp; Luxe">Made to feel <em>effortless</em></Title></Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {PROMISES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 120}>
              <p className="font-serif text-5xl italic text-champagne">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-claret/80">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <Reveal>
        <section className="rounded-3xl bg-claret px-8 py-16 text-center text-ivory">
          <h2 className="font-serif text-4xl md:text-6xl">Find the <em>one</em> you will reach for.</h2>
          <Link href="/shop" className="mt-8 inline-block rounded-full bg-champagne px-10 py-3 text-sm tracking-wide text-claret transition hover:bg-ivory">Start shopping</Link>
        </section>
      </Reveal>
    </div>
  );
}
