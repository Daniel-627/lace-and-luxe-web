"use client";
import { useState } from "react";
import { parseVideo, videoThumb } from "../lib/video";

/** Shows a picture and a play button. The video itself loads only when tapped, to save data. */
export default function VideoPlayer({ url }: { url: string }) {
  const v = parseVideo(url);
  const [on, setOn] = useState(false);
  if (!v) return <a href={url} target="_blank" rel="noopener noreferrer" className="flex h-full items-center justify-center bg-claret text-ivory underline">Watch the video</a>;
  if (v.type === "file") return <video src={v.url} controls preload="none" playsInline className="h-full w-full bg-black object-cover" />;
  if (on) {
    const src = v.type === "youtube" ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0` : `https://player.vimeo.com/video/${v.id}?autoplay=1`;
    return <iframe src={src} title="Product video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" />;
  }
  const thumb = videoThumb(v);
  return (
    <button type="button" onClick={() => setOn(true)} aria-label="Play video" className="relative block h-full w-full bg-claret">
      {thumb && <img src={thumb} alt="" className="h-full w-full object-cover opacity-80" />}
      <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory/90 text-2xl text-claret">▶</span></span>
    </button>
  );
}
