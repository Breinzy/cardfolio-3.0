import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const text = await req.text();
  const rows = text.trim().split("\n").slice(1); // skip header
  let createdProducts = 0,
    createdHoldings = 0;
  const errors: Array<{ row: number; message: string }> = [];
  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    if (!line.trim()) continue;
    const [name, set, number, type, condition, grade, quantity, cost_basis_total, acquired_at, source] = line.split(",");
    try {
      const qty = Number(quantity);
      const cost = Number(cost_basis_total);
      const t = type === "SEALED" ? "SEALED" : type === "SINGLE" ? "SINGLE" : null;
      if (!name || t === null) throw new Error("Invalid name/type");
      if (!Number.isFinite(qty) || qty < 0) throw new Error("Invalid quantity");
      if (!Number.isFinite(cost) || cost < 0) throw new Error("Invalid cost");

      let product = await prisma.product.findFirst({ where: { name, set: set || undefined, number: number || undefined } });
      if (!product) {
        product = await prisma.product.create({ data: { name, set: set || undefined, number: number || undefined, type: t } });
        createdProducts++;
      }
      await prisma.holding.create({
        data: {
          productId: product.id,
          condition: condition || undefined,
          grade: grade || undefined,
          quantity: qty,
          costBasisTotal: cost,
          acquiredAt: acquired_at ? new Date(acquired_at) : undefined,
          source: source || undefined,
        },
      });
      createdHoldings++;
    } catch (e) {
      errors.push({ row: i + 2, message: (e as Error).message }); // +2 accounts for 0-index + header row
    }
  }
  return NextResponse.json({ createdProducts, createdHoldings, errors });
}


