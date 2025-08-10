// Minimal stub budget checker (v0)
export async function enforceBudget({ estimatedDollars }: { estimatedDollars: number }) {
  const cap = Number(process.env.AI_MONTHLY_CAP_DOLLARS ?? 5);
  if (estimatedDollars > cap) {
    throw new Error("AI budget cap reached");
  }
}


