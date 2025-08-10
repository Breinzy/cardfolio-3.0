import { prisma } from "./db";

export async function getDashboardSummary(): Promise<{ totalCost: number; estValue: number; pnl: number }> {
  const products = await prisma.product.findMany({
    include: { holdings: true, prices: { orderBy: { capturedAt: "desc" }, take: 1 } },
  });

  let totalCost = 0;
  let estValue = 0;
  for (const product of products) {
    const quantity = product.holdings.reduce((sum, h) => sum + h.quantity, 0);
    const latest = product.prices[0]?.price ? Number(product.prices[0].price) : 0;
    const cost = product.holdings.reduce((sum, h) => sum + Number(h.costBasisTotal), 0);
    totalCost += cost;
    estValue += quantity * latest;
  }

  return { totalCost, estValue, pnl: estValue - totalCost };
}


