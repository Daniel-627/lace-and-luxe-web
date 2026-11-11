"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fades and lifts content in as it scrolls into view. Visible by default if JS is slow. */
export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen
    setArmed(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: armed ? `${delay}ms` : undefined }} className={`reveal ${armed && !shown ? "reveal-hidden" : ""} ${className}`}>
      {children}
    </div>
  );
}
