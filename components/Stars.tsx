export default function Stars({ value, className = "" }: { value: number; className?: string }) {
  const n = Math.round(value);
  return <span className={`tracking-wider text-champagne ${className}`} role="img" aria-label={`${value} out of 5 stars`}>{"★".repeat(n)}<span className="text-claret/20">{"★".repeat(5 - n)}</span></span>;
}
