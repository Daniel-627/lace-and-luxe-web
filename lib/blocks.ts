type Common = { _key?: string; enabled?: boolean; startsAt?: string; endsAt?: string };

export type Block = Common & (
  | { _type: "heroBlock"; eyebrow?: string; headline: string; subheading?: string; primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string; imageUrl?: string }
  | { _type: "tickerBlock"; items: string[] }
  | { _type: "categoryRowBlock"; eyebrow?: string; title?: string }
  | { _type: "productRowBlock"; eyebrow?: string; title?: string; category?: string; limit?: number }
  | { _type: "bannerPairBlock"; banners: { title?: string; subtitle?: string; href?: string; imageUrl?: string }[] }
  | { _type: "promoBlock"; title?: string; text?: string; code?: string; ctaLabel?: string; ctaHref?: string; theme?: "claret" | "champagne" | "rose"; imageUrl?: string }
  | { _type: "adBlock"; imageUrl?: string; href?: string; alt?: string; sponsored?: boolean }
  | { _type: "textMediaBlock"; eyebrow?: string; title?: string; body?: string; imageUrl?: string; videoUrl?: string; imageSide?: "left" | "right"; ctaLabel?: string; ctaHref?: string }
  | { _type: "promisesBlock"; eyebrow?: string; title?: string; items: { title?: string; text?: string }[] }
  | { _type: "ctaBlock"; heading?: string; buttonLabel?: string; buttonHref?: string }
);

/** Only the shop's own pages or https links are allowed from the CMS. */
export const safeHref = (h?: string) => (h && /^(\/(?!\/)|https?:\/\/)/.test(h) ? h : "#");

export const isLive = (b: Block, now = Date.now()) =>
  b.enabled !== false && (!b.startsAt || Date.parse(b.startsAt) <= now) && (!b.endsAt || Date.parse(b.endsAt) > now);

/** Shown when Sanity has no home page yet, or is unreachable. */
export const DEFAULT_BLOCKS: Block[] = [
  { _type: "heroBlock", eyebrow: "Lace & Luxe Delicates", headline: "Soft lace,\n*quiet* luxury.", subheading: "Lingerie, sleepwear and everyday essentials, for her and for him.", primaryLabel: "Shop now", primaryHref: "/shop", secondaryLabel: "Shop for him", secondaryHref: "/shop?category=mens-underwear", imageUrl: "/images/hero.jpg" },
  { _type: "tickerBlock", items: ["Order on WhatsApp", "Pay with M-Pesa", "Discreet packaging", "Delivered across Kenya", "Size help on every product"] },
  { _type: "categoryRowBlock", eyebrow: "Shop by category", title: "Find your *perfect* fit" },
  { _type: "productRowBlock", eyebrow: "Just in", title: "New *arrivals*", limit: 8 },
  { _type: "bannerPairBlock", banners: [
    { title: "For her", subtitle: "Lace, satin and everyday comfort", href: "/shop", imageUrl: "/images/for-her.jpg" },
    { title: "For him", subtitle: "Soft, supportive essentials", href: "/shop?category=mens-underwear", imageUrl: "/images/for-him.jpg" },
  ] },
  { _type: "promisesBlock", eyebrow: "Why Lace & Luxe", title: "Made to feel *effortless*", items: [
    { title: "Order your way", text: "Pay with M-Pesa at checkout, or send your order on WhatsApp." },
    { title: "Discreet by design", text: "Plain packaging and neutral messages. Only you know what is inside." },
    { title: "Help with sizing", text: "A size guide on every product, and real people to ask." },
  ] },
  { _type: "ctaBlock", heading: "Find the *one* you will reach for.", buttonLabel: "Start shopping", buttonHref: "/shop" },
];
