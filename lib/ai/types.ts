export type AdvisorInput = { budget: number; constraints?: Record<string, unknown> };
export type AdvisorPlan = {
  sells: { productId: string; qty: number; reason: string }[];
  buys: { productId: string; qty: number; maxPrice?: number; reason: string }[];
  notes: string[];
  confidence?: number; // 0..1
};


