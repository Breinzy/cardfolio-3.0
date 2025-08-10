import { describe, it, expect } from "vitest";
import { applySellFIFO } from "./fifo";

describe("FIFO", () => {
  it("allocates across lots in order", () => {
    const lots = [
      { qty: 1, unitCost: 100 },
      { qty: 2, unitCost: 120 },
    ];
    const { allocations, costBasisAllocated } = applySellFIFO(lots, 2);
    expect(allocations).toEqual([
      { qty: 1, unitCost: 100 },
      { qty: 1, unitCost: 120 },
    ]);
    expect(costBasisAllocated).toBe(220);
  });
});


