import { prisma } from "@/lib/db";

export async function buildRoiSeries(_interval: "month" | "week" | "day" = "month") {
  const txns = await prisma.transaction.findMany({ orderBy: { date: "asc" } });
  const snaps = await prisma.priceSnapshot.findMany({ orderBy: { capturedAt: "asc" } });

  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const buckets = new Set<string>();
  txns.forEach((t) => buckets.add(key(t.date)));
  snaps.forEach((s) => buckets.add(key(s.capturedAt as unknown as Date)));
  const keys = Array.from(buckets).sort();

  let invested = 0;
  const series: Array<{ date: string; invested: number; equity: number; unrealized: number; realized: number; pnl_total: number }> = [];
  for (const k of keys) {
    const [y, m] = k.split("-").map(Number);
    const cutoff = new Date(y, (m ?? 1) - 1, 31, 23, 59, 59);

    invested = txns
      .filter((t) => t.type === "buy" && t.date <= cutoff)
      .reduce((s, t) => s + Number(t.netTotal), 0);

    const realized = (await prisma.realizedPnl.findMany({ where: { date: { lte: cutoff } } })).reduce((s, r) => s + Number(r.realizedPnl), 0);

    const products = await prisma.product.findMany({
      include: {
        holdings: true,
        prices: { where: { capturedAt: { lte: cutoff } }, orderBy: { capturedAt: "desc" }, take: 1 },
      },
    });

    let market = 0,
      remainingCost = 0;
    for (const p of products) {
      const qty = p.holdings.reduce((s, h) => s + h.quantity, 0);
      const latest = p.prices[0]?.price ? Number(p.prices[0].price) : 0;
      market += qty * latest;
      remainingCost += p.holdings.reduce((s, h) => s + Number(h.costBasisTotal), 0);
    }

    const equity = realized + (market - remainingCost);
    const unrealized = equity - realized;
    series.push({ date: `${y}-${String(m).padStart(2, "0")}-01`, invested, equity, unrealized, realized, pnl_total: equity });
  }
  return series;
}


