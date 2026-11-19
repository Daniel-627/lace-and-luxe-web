"use client";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Crossfading carousel for the hero. The slides themselves are rendered on the server and passed in as children,
 * so the first one is in the page straight away. Autoplay pauses on hover, focus and touch, can be paused with the
 * button, and does not run at all for visitors who asked their device to reduce motion.
 */
export default function HeroSlider({ children, seconds = 6 }: { children: ReactNode; seconds?: number }) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = () => setReduced(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);

  // A fresh timer after every change, so tapping a dot never causes an immediate jump.
  useEffect(() => {
    if (paused || hold || reduced || n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), Math.min(15, Math.max(3, seconds)) * 1000);
    return () => clearTimeout(t);
  }, [i, paused, hold, reduced, n, seconds]);

  const go = (k: number) => setI(((k % n) + n) % n);
  const arrow = "hidden h-10 w-10 items-center justify-center rounded-full border border-ivory/40 bg-claret/30 text-lg text-ivory backdrop-blur transition hover:bg-ivory hover:text-claret md:flex";

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label="Featured"
      className="relative"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)} onBlur={() => setHold(false)}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; setHold(true); }}
      onTouchEnd={(e) => {
        const from = startX.current; startX.current = null; setHold(false);
        if (from === null) return;
        const dx = e.changedTouches[0].clientX - from;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      {/* All slides share one grid cell, so the hero is always as tall as the tallest slide and never jumps. */}
      <div className="grid">
        {slides.map((s, k) => (
          <div
            key={k} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i}
            {...(k !== i ? ({ inert: "" } as Record<string, string>) : {})}
            className={`col-start-1 row-start-1 transition-opacity duration-700 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {s}
          </div>
        ))}
      </div>

      <button type="button" onClick={() => go(i - 1)} aria-label="Previous slide" className={`${arrow} absolute left-3 top-1/2 -translate-y-1/2`}>‹</button>
      <button type="button" onClick={() => go(i + 1)} aria-label="Next slide" className={`${arrow} absolute right-3 top-1/2 -translate-y-1/2`}>›</button>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1 sm:bottom-4">
        {slides.map((_, k) => (
          <button key={k} type="button" onClick={() => go(k)} aria-label={`Show slide ${k + 1}`} aria-current={k === i} className="p-2">
            <span className={`block h-2 rounded-full transition-all ${k === i ? "w-6 bg-champagne" : "w-2 bg-ivory/50"}`} />
          </button>
        ))}
        {!reduced && (
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="ml-2 rounded-full border border-ivory/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-ivory/80">
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
