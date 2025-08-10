import { prisma } from "../db";

export async function getPortfolioSummary(): Promise<{
  totalCost: number;
  estValue: number;
  pnl: number;
  allocByBucket: { sealed: number; singles: number };
}> {
  const products = await prisma.product.findMany({
    include: { holdings: true, prices: { orderBy: { capturedAt: "desc" }, take: 1 } },
  });

  let totalCost = 0;
  let estValue = 0;
  for (const p of products) {
    const qty = p.holdings.reduce((s, h) => s + h.quantity, 0);
    const price = p.prices[0]?.price ? Number(p.prices[0].price) : 0;
    const cost = p.holdings.reduce((s, h) => s + Number(h.costBasisTotal), 0);
    totalCost += cost;
    estValue += qty * price;
  }

  const allocByBucket = { sealed: 0, singles: 0 };
  for (const p of products) {
    const qty = p.holdings.reduce((s, h) => s + h.quantity, 0);
    const price = p.prices[0]?.price ? Number(p.prices[0].price) : 0;
    if (p.type === "SEALED") allocByBucket.sealed += qty * price;
    else allocByBucket.singles += qty * price;
  }

  return { totalCost, estValue, pnl: estValue - totalCost, allocByBucket };
}

export async function getShoppingList(budget: number): Promise<Array<{ productId: string; estPrice: number; rationale: string; score: number }>> {
  const products = await prisma.product.findMany({
    include: { prices: { orderBy: { capturedAt: "desc" }, take: 1 } },
    take: 10,
  });
  return products
    .filter((p) => p.prices.length)
    .map((p) => ({ productId: p.id, estPrice: Number(p.prices[0].price), rationale: "recent price snapshot", score: 0.5 }))
    .filter((x) => x.estPrice <= budget);
}


