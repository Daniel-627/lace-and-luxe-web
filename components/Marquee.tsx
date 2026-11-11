export default function Marquee({ items }: { items: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10 whitespace-nowrap">
          {t} <span className="text-claret/50">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden rounded-full bg-champagne py-3 font-serif text-lg italic text-claret">
      <div className="flex w-max animate-marquee">{row}{row}</div>
    </div>
  );
}
