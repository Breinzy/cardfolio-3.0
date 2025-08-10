import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePlanLLM } from "@/lib/ai/router";

const Body = z.object({ budget: z.number().min(0) });

export async function POST(req: Request) {
  const json = await req.json();
  const { budget } = Body.parse(json);
  const plan = await generatePlanLLM({ budget });
  return NextResponse.json(plan);
}


