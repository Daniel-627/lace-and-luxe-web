"use client";
import { useEffect, useState } from "react";
import type { Media } from "../lib/types";
import { sanityImg } from "../lib/img";
import { parseVideo, videoThumb } from "../lib/video";
import SmartImage from "./SmartImage";
import VideoPlayer from "./VideoPlayer";

export default function ProductGallery({ media, fallback, colour, name }: { media: Media[]; fallback: string | null; colour: string; name: string }) {
  const c = colour.toLowerCase();
  let items = [...media.filter((m) => m.colour?.toLowerCase() === c), ...media.filter((m) => !m.colour)];
  if (items.length === 0 && media.length) items = media; // only other colours have photos: show them rather than nothing
  if (items.length === 0 && fallback) items = [{ id: 0, kind: "IMAGE", url: fallback, colour: null, position: 0 }];

  const [i, setI] = useState(0);
  useEffect(() => setI(0), [colour]);
  const cur = items[Math.min(i, items.length - 1)];
  const step = (d: number) => setI((x) => (x + d + items.length) % items.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-rose/15">
        {cur?.kind === "VIDEO" ? <VideoPlayer key={cur.url} url={cur.url} /> : <SmartImage key={cur?.url ?? "none"} src={sanityImg(cur?.url, 1000)} alt={name} />}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-ivory/85 text-claret">←</button>
            <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-ivory/85 text-claret">→</button>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((m, idx) => (
            <button key={`${m.id}-${idx}`} type="button" onClick={() => setI(idx)} aria-label={`Show ${m.kind === "VIDEO" ? "video" : "photo"} ${idx + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${idx === i ? "border-claret" : "border-transparent opacity-70"}`}>
              {m.kind === "VIDEO"
                ? <><SmartImage src={videoThumb(parseVideo(m.url))} alt="" /><span className="absolute inset-0 flex items-center justify-center bg-claret/40 text-ivory">▶</span></>
                : <SmartImage src={sanityImg(m.url, 200)} alt="" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
