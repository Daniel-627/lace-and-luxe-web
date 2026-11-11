"use client";
import { useEffect, useRef, useState } from "react";

const PLACEHOLDER = "/placeholder.svg";

/** Shows the image, or the brand placeholder when there is no image or it fails to load. */
export default function SmartImage({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true); // failed before hydration
  }, []);
  return (
    <img
      ref={ref}
      src={!src || failed ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
