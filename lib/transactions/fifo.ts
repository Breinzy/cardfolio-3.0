export type LotAllocation = { holdingId?: string; qty: number; unitCost: number };
export type Lot = { holdingId?: string; qty: number; unitCost: number };

export function applySellFIFO(availableLots: Lot[], sellQty: number): {
  allocations: LotAllocation[];
  costBasisAllocated: number;
} {
  if (sellQty <= 0) return { allocations: [], costBasisAllocated: 0 };
  const allocations: LotAllocation[] = [];
  let remaining = sellQty;
  let costBasisAllocated = 0;
  for (const lot of availableLots) {
    if (remaining <= 0) break;
    if (lot.qty <= 0) continue;
    const take = Math.min(lot.qty, remaining);
    allocations.push({ holdingId: lot.holdingId, qty: take, unitCost: lot.unitCost });
    costBasisAllocated += take * lot.unitCost;
    remaining -= take;
  }
  if (remaining > 0) throw new Error("Insufficient quantity to sell");
  return { allocations, costBasisAllocated };
}


