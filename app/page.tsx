import { getProducts } from "../lib/api";
import { getHomeBlocks } from "../lib/sanity";
import Blocks from "../components/Blocks";

export const dynamic = "force-dynamic"; // load when visited, not at build time

export default async function Home() {
  const [products, blocks] = await Promise.all([getProducts(), getHomeBlocks()]);
  return (
    <div className="space-y-24">
      <Blocks blocks={blocks} products={products} />
    </div>
  );
}
