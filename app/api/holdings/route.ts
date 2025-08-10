import { NextResponse } from "next/server";
import { z } from "zod";
import { createHolding, listHoldings } from "@/lib/holdings";

export async function GET() {
  const holdings = await listHoldings();
  return NextResponse.json(holdings);
}

const CreateBody = z.object({
  productName: z.string().min(1),
  productSet: z.string().optional().nullable(),
  productNumber: z.string().optional().nullable(),
  productType: z.enum(["SINGLE", "SEALED"]),
  condition: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  quantity: z.number().int().min(1),
  costBasisTotal: z.number().min(0),
  acquiredAt: z.string().datetime().optional().nullable(),
  source: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const body = CreateBody.parse(json);
  const created = await createHolding({
    productName: body.productName,
    productSet: body.productSet ?? undefined,
    productNumber: body.productNumber ?? undefined,
    productType: body.productType,
    condition: body.condition ?? undefined,
    grade: body.grade ?? undefined,
    quantity: body.quantity,
    costBasisTotal: body.costBasisTotal,
    acquiredAt: body.acquiredAt ? new Date(body.acquiredAt) : undefined,
    source: body.source ?? undefined,
  });
  return NextResponse.json(created, { status: 201 });
}


