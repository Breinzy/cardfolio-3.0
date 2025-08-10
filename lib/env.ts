import { z } from "zod";

const EnvSchema = z.object({
  AI_MONTHLY_CAP_DOLLARS: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

export const env = {
  aiMonthlyCapDollars: parsed.success && parsed.data.AI_MONTHLY_CAP_DOLLARS ? Number(parsed.data.AI_MONTHLY_CAP_DOLLARS) : 5,
};


