import { NextResponse } from "next/server";
import { z } from "zod";
import { recordBuy, recordSell } from "@/lib/transactions/service";

const Body = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("buy"),
    productId: z.string().min(1),
    qty: z.number().int().min(1),
    unitPrice: z.number().min(0),
    fees: z.number().min(0).optional(),
    shipping: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    date: z.string().datetime(),
  }),
  z.object({
    type: z.literal("sell"),
    productId: z.string().min(1),
    qty: z.number().int().min(1),
    unitPrice: z.number().min(0),
    fees: z.number().min(0).optional(),
    shipping: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    date: z.string().datetime(),
  }),
]);

export async function POST(req: Request) {
  const json = await req.json();
  const body = Body.parse(json);
  if (body.type === "buy") {
    const txn = await recordBuy({
      productId: body.productId,
      qty: body.qty,
      unitPrice: body.unitPrice,
      fees: body.fees,
      shipping: body.shipping,
      tax: body.tax,
      date: new Date(body.date),
    });
    return NextResponse.json(txn, { status: 201 });
  }
  const txn = await recordSell({
    productId: body.productId,
    qty: body.qty,
    unitPrice: body.unitPrice,
    fees: body.fees,
    shipping: body.shipping,
    tax: body.tax,
    date: new Date(body.date),
  });
  return NextResponse.json(txn, { status: 201 });
}


