import { getPortfolioSummary, getShoppingList } from "./tools";

export async function runAdvisor({ budget }: { budget: number }): Promise<{
  sells: Array<{ productId: string; qty: number; reason: string }>;
  buys: Array<{ productId: string; qty: number; maxPrice?: number; reason: string }>;
  notes: string[];
  confidence?: number;
}> {
  await getPortfolioSummary();
  const candidates = await getShoppingList(budget);
  const buys = candidates.slice(0, 3).map((c) => ({ productId: c.productId, qty: 1, maxPrice: c.estPrice, reason: c.rationale }));
  return { sells: [], buys, notes: ["v0 rule-based plan"], confidence: 0.8 };
}


