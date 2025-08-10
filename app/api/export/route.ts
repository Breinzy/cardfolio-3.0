import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  const data = {
    products: await prisma.product.findMany(),
    holdings: await prisma.holding.findMany(),
    transactions: await prisma.transaction.findMany(),
    prices: await prisma.priceSnapshot.findMany(),
    realized: await prisma.realizedPnl.findMany(),
    strategy: await prisma.strategy.findMany(),
  } as const;
  if (format === "json") {
    const res = NextResponse.json(data);
    res.headers.set("Content-Disposition", `attachment; filename="cardfolio-export.json"`);
    return res;
  }
  const header = "productId,quantity,costBasisTotal\n";
  const csv = header + data.holdings.map((h) => `${h.productId},${h.quantity},${h.costBasisTotal}`).join("\n");
  return new NextResponse(csv, { headers: { "content-type": "text/csv", "Content-Disposition": `attachment; filename="cardfolio-holdings.csv"` } });
}


