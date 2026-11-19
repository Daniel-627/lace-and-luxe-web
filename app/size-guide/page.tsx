import { API } from "../../lib/api";

export const metadata = { title: "Size guide" };
export const dynamic = "force-dynamic";

interface Guide { intro: string; sections: { title: string; text: string; table: string }[] }

async function load(): Promise<Guide> {
  try {
    const r = await fetch(`${API}/api/site/size-guide`, { next: { revalidate: 60 } });
    if (r.ok) return await r.json();
  } catch { /* fall through */ }
  return { intro: "", sections: [] };
}

const rows = (t: string) => t.split("\n").map((l) => l.split("|").map((c) => c.trim())).filter((r) => r.some(Boolean));

export default async function SizeGuide() {
  const g = await load();
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="text-center">
        <h1 className="font-serif text-5xl">Size guide</h1>
        {g.intro && <p className="mt-3 text-claret/80">{g.intro}</p>}
      </div>
      {g.sections.map((s, i) => {
        const t = rows(s.table);
        return (
          <section key={i} className="space-y-3">
            <h2 className="font-serif text-3xl">{s.title}</h2>
            {s.text && <p className="whitespace-pre-line text-claret/80">{s.text}</p>}
            {t.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-champagne/40 bg-white/50">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-champagne/40 bg-rose/15">{t[0].map((c, j) => <th key={j} className="px-4 py-2 font-medium">{c}</th>)}</tr></thead>
                  <tbody>{t.slice(1).map((r, k) => <tr key={k} className="border-b border-champagne/20 last:border-0">{r.map((c, j) => <td key={j} className="px-4 py-2">{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
