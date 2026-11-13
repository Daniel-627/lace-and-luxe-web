import { DEFAULT_BLOCKS, isLive, type Block } from "./blocks";

const PROJECT = process.env.SANITY_PROJECT_ID ?? "h8sdwy2z";
const DATASET = process.env.SANITY_DATASET ?? "production";

/** Plain read-only request to Sanity's public CDN. No Sanity packages needed in the shop. */
async function query<T>(groq: string): Promise<T | null> {
  const url = `https://${PROJECT}.apicdn.sanity.io/v2025-01-01/data/query/${DATASET}?perspective=published&query=${encodeURIComponent(groq)}`;
  const r = await fetch(url, { next: { revalidate: 60 } });
  if (!r.ok) return null;
  return ((await r.json()) as { result: T }).result;
}

export const sanityImg = (url?: string, w = 1200) =>
  url && url.includes("cdn.sanity.io") ? `${url}?w=${w}&auto=format&q=80` : url;

const HOME = `*[_id == "homePage"][0]{ blocks[]{ ..., "imageUrl": image.asset->url, banners[]{ ..., "imageUrl": image.asset->url } } }`;

/** Never throws: falls back to the built-in homepage. */
export async function getHomeBlocks(): Promise<Block[]> {
  try {
    const data = await query<{ blocks?: Block[] } | null>(HOME);
    const live = (data?.blocks ?? []).filter(Boolean).filter((b) => isLive(b));
    return live.length ? live : DEFAULT_BLOCKS;
  } catch {
    return DEFAULT_BLOCKS;
  }
}

const DEFAULT_ANNOUNCEMENT = "Order on WhatsApp · Pay with M-Pesa · Discreet packaging";

export async function getAnnouncement(): Promise<string> {
  try {
    const s = await query<{ announcementEnabled?: boolean; announcement?: string } | null>(`*[_id == "siteSettings"][0]{ announcementEnabled, announcement }`);
    if (!s) return DEFAULT_ANNOUNCEMENT;
    if (s.announcementEnabled === false) return "";
    return s.announcement?.trim() || DEFAULT_ANNOUNCEMENT;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}
