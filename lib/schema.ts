import { z } from "zod";

export const StrategySchema = z.object({
  risk: z.enum(["low", "med", "high"]),
  horizonYears: z.number().int().min(1).max(30),
  monthlyBudget: z.number().min(0),
  targetAllocJson: z.string().refine((s) => {
    try {
      JSON.parse(s);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON"),
});

export type StrategyInput = z.infer<typeof StrategySchema>;


