import Link from "next/link";
import type { ReactNode } from "react";
import { safeHref } from "../lib/blocks";

/** Wrap a word in *stars* for italics; a new line becomes a line break. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, j) => (part.length > 2 && part.startsWith("*") && part.endsWith("*") ? <em key={j}>{part.slice(1, -1)}</em> : part))}
        </span>
      ))}
    </>
  );
}

export function A({ href, className, children }: { href?: string; className?: string; children: ReactNode }) {
  const h = safeHref(href);
  return h.startsWith("/")
    ? <Link href={h} className={className}>{children}</Link>
    : <a href={h} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}
