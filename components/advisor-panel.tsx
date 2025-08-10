"use client";
import React, { useState } from "react";

type Plan = {
  sells: { productId: string; qty: number; reason: string }[];
  buys: { productId: string; qty: number; maxPrice?: number; reason: string }[];
  notes: string[];
  confidence?: number;
};

export default function AdvisorPanel() {
  const [budget, setBudget] = useState<number>(100);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="p-4 rounded-2xl border space-y-3">
      <div className="text-sm font-semibold">Advisor</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="border rounded px-2 py-1 w-32"
        />
        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              const res = await fetch("/api/advice", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ budget }),
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              setPlan(await res.json());
            } catch (err: unknown) {
              if (err && typeof err === "object" && "message" in err) setError(String((err as { message?: string }).message));
              else setError("Request failed");
            } finally {
              setLoading(false);
            }
          }}
          className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Get Plan"}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {plan && (
        <div className="text-sm">
          <div className="font-medium">Buys</div>
          <ul className="list-disc ml-5">
            {plan.buys.map((b, idx) => (
              <li key={idx}>
                {b.productId} ×{b.qty} {b.maxPrice ? `(<= ${b.maxPrice})` : ""} — {b.reason}
              </li>
            ))}
          </ul>
          {plan.sells.length > 0 && (
            <>
              <div className="font-medium mt-2">Sells</div>
              <ul className="list-disc ml-5">
                {plan.sells.map((s, idx) => (
                  <li key={idx}>
                    {s.productId} ×{s.qty} — {s.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
          {plan.notes.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">{plan.notes.join("; ")}</div>
          )}
        </div>
      )}
    </div>
  );
}


