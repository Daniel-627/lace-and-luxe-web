export type Video = { type: "youtube" | "vimeo"; id: string } | { type: "file"; url: string };

/** Understands YouTube, Vimeo and direct video files. Anything else returns null. */
export function parseVideo(raw: string): Video | null {
  try {
    const u = new URL(raw);
    const h = u.hostname.replace(/^www\.|^m\./, "");
    if (h === "youtu.be") { const id = u.pathname.slice(1); return /^[\w-]{6,15}$/.test(id) ? { type: "youtube", id } : null; }
    if (h === "youtube.com") {
      const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,15})/)?.[1];
      return id && /^[\w-]{6,15}$/.test(id) ? { type: "youtube", id } : null;
    }
    if (h === "vimeo.com" || h === "player.vimeo.com") { const id = u.pathname.match(/(\d{5,})/)?.[1]; return id ? { type: "vimeo", id } : null; }
    if (u.protocol === "https:" && /\.(mp4|webm|mov)$/i.test(u.pathname)) return { type: "file", url: raw };
  } catch { /* not a link */ }
  return null;
}

export const videoThumb = (v: Video | null) => (v?.type === "youtube" ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : undefined);
