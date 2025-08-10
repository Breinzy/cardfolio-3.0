import { prisma } from "@/lib/db";
import { applySellFIFO } from "./fifo";

export async function recordBuy(input: {
  productId: string;
  qty: number;
  unitPrice: number;
  fees?: number;
  shipping?: number;
  tax?: number;
  date: Date;
}) {
  const total = input.unitPrice * input.qty;
  const netTotal = total + (input.fees ?? 0) + (input.shipping ?? 0) + (input.tax ?? 0);

  const txn = await prisma.transaction.create({
    data: {
      productId: input.productId,
      type: "buy",
      qty: input.qty,
      unitPrice: input.unitPrice,
      total,
      fees: input.fees ?? 0,
      shipping: input.shipping ?? 0,
      tax: input.tax ?? 0,
      netTotal,
      date: input.date,
    },
  });

  await prisma.holding.create({
    data: {
      productId: input.productId,
      quantity: input.qty,
      costBasisTotal: netTotal,
      acquiredAt: input.date,
      source: "buy",
    },
  });

  return txn;
}

export async function recordSell(input: {
  productId: string;
  qty: number;
  unitPrice: number; // sale price per unit
  fees?: number;
  shipping?: number;
  tax?: number; // taxes on sale
  date: Date;
}) {
  // Gather available lots (FIFO by createdAt)
  const lots = await prisma.holding.findMany({
    where: { productId: input.productId },
    orderBy: { createdAt: "asc" },
  });
  const totalAvailable = lots.reduce((s, h) => s + h.quantity, 0);
  if (totalAvailable < input.qty) throw new Error("Insufficient quantity to sell");

  const preparedLots = lots.map((h) => ({ holdingId: h.id, qty: h.quantity, unitCost: Number(h.costBasisTotal) / Math.max(1, h.quantity) }));
  const { allocations, costBasisAllocated } = applySellFIFO(preparedLots, input.qty);

  const grossProceeds = input.unitPrice * input.qty;
  const feesTotal = input.fees ?? 0;
  const shippingTotal = input.shipping ?? 0;
  const taxTotal = input.tax ?? 0;
  const netProceeds = grossProceeds - feesTotal - shippingTotal - taxTotal;
  const realized = netProceeds - costBasisAllocated;

  const txn = await prisma.transaction.create({
    data: {
      productId: input.productId,
      type: "sell",
      qty: input.qty,
      unitPrice: input.unitPrice,
      total: grossProceeds,
      fees: feesTotal,
      shipping: shippingTotal,
      tax: taxTotal,
      netTotal: netProceeds,
      date: input.date,
    },
  });

  // Reduce lots
  for (const a of allocations) {
    if (!a.holdingId) continue;
    const h = await prisma.holding.findUnique({ where: { id: a.holdingId } });
    if (!h) continue;
    const remainingQty = h.quantity - a.qty;
    const remainingCost = Number(h.costBasisTotal) - a.qty * a.unitCost;
    if (remainingQty <= 0) {
      await prisma.holding.delete({ where: { id: h.id } });
    } else {
      await prisma.holding.update({ where: { id: h.id }, data: { quantity: remainingQty, costBasisTotal: remainingCost } });
    }
  }

  await prisma.realizedPnl.create({
    data: {
      productId: input.productId,
      transactionId: txn.id,
      qty: input.qty,
      proceedsTotal: grossProceeds,
      feesTotal,
      taxTotal,
      shippingTotal,
      costBasisAllocated: costBasisAllocated,
      realizedPnl: realized,
      date: input.date,
    },
  });

  return txn;
}


