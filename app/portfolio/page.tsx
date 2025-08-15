import { listHoldings } from "@/lib/holdings";
import PortfolioGrid, { type PortfolioItem } from "@/components/portfolio/grid";

export default async function Page() {
  const holdings = await listHoldings();
  const items: PortfolioItem[] = holdings.map((h) => ({
    id: h.id,
    name: h.product.name,
    set: h.product.set,
    number: h.product.number ?? undefined,
    type: h.product.type as "SINGLE" | "SEALED",
    grade: h.grade ?? undefined,
    quantity: h.quantity,
    estPrice: undefined,
    estValue: undefined,
    imageUrl: undefined,
  }));

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      <PortfolioGrid items={items} />
    </main>
  );
}


