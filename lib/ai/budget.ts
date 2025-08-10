// Minimal stub budget checker (v0)
import { env } from "@/lib/env";

export async function enforceBudget({ estimatedDollars }: { estimatedDollars: number }) {
  const cap = env.aiMonthlyCapDollars;
  if (estimatedDollars > cap) {
    throw new Error("AI budget cap reached");
  }
}


