import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteHolding, updateHolding } from "@/lib/holdings";

const UpdateBody = z.object({
  condition: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  quantity: z.number().int().min(0).optional().nullable(),
  costBasisTotal: z.number().min(0).optional().nullable(),
  acquiredAt: z.string().datetime().optional().nullable(),
  source: z.string().optional().nullable(),
});

export async function PUT(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await _req.json();
  const body = UpdateBody.parse(json);
  const updated = await updateHolding(id, {
    condition: body.condition ?? undefined,
    grade: body.grade ?? undefined,
    quantity: body.quantity ?? undefined,
    costBasisTotal: body.costBasisTotal ?? undefined,
    acquiredAt: body.acquiredAt ? new Date(body.acquiredAt) : undefined,
    source: body.source ?? undefined,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteHolding(id);
  return NextResponse.json({ ok: true });
}


