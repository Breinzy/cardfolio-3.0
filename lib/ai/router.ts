import { enforceBudget } from "./budget";
import type { AdvisorInput, AdvisorPlan } from "./types";
import { runAdvisor as runRule } from "@/lib/advisor";

const MINI = "gpt-5-mini";
const FULL = "gpt-5";

// v0 skeleton: returns rule-based plan; wire OpenAI SDK later (structured outputs)
export async function generatePlanLLM(input: AdvisorInput): Promise<AdvisorPlan> {
  await enforceBudget({ estimatedDollars: 0.02 }); // rough pre-check
  // TODO: call OpenAI with model MINI, parse to AdvisorPlan, check confidence, maybe escalate to FULL
  const firstPass = await runRule({ budget: input.budget });
  if ((firstPass.confidence ?? 0.8) >= 0.7) return firstPass;

  // Escalate (second pass) — for now reuse rule plan
  return { ...firstPass, notes: [...firstPass.notes, "escalated (stub)"], confidence: 0.8 };
}


