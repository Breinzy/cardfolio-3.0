import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { StrategySchema } from "@/lib/schema";

export async function GET() {
  const s = await prisma.strategy.findFirst();
  return NextResponse.json(s ?? null);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const parsed = StrategySchema.parse(body);
  const existing = await prisma.strategy.findFirst();
  const data = {
    risk: parsed.risk,
    horizonYears: parsed.horizonYears,
    monthlyBudget: parsed.monthlyBudget,
    targetAllocJson: parsed.targetAllocJson,
  } as const;
  const result = existing
    ? await prisma.strategy.update({ where: { id: existing.id }, data })
    : await prisma.strategy.create({ data });
  return NextResponse.json(result);
}


