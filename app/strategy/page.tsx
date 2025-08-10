"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { StrategySchema } from "@/lib/schema";

type Strategy = {
  id: string;
  risk: string;
  horizonYears: number;
  monthlyBudget: number;
  targetAllocJson: string;
};

export default function StrategyPage() {
  const [, setStrategy] = useState<Strategy | null>(null);
  const [form, setForm] = useState({ risk: "med", horizonYears: 5, monthlyBudget: 500, targetAllocJson: "{}" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/strategy");
      const s = await res.json();
      if (s) {
        setStrategy(s);
        setForm({
          risk: s.risk,
          horizonYears: s.horizonYears,
          monthlyBudget: Number(s.monthlyBudget),
          targetAllocJson: s.targetAllocJson,
        });
      }
    })();
  }, []);

  return (
    <main className="p-6 text-black dark:text-white">
      <h1 className="text-xl font-semibold mb-4">Strategy</h1>
      <div className="p-4 border rounded-2xl grid gap-3 max-w-xl">
        <div className="grid gap-1">
          <label className="text-xs">Risk</label>
          <select
            className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={form.risk}
            onChange={(e) => setForm((f) => ({ ...f, risk: e.target.value }))}
          >
            <option value="low">low</option>
            <option value="med">med</option>
            <option value="high">high</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label className="text-xs">Horizon (years)</label>
          <input
            type="number"
            className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={form.horizonYears}
            onChange={(e) => setForm((f) => ({ ...f, horizonYears: Number(e.target.value) }))}
          />
        </div>
        <div className="grid gap-1">
          <label className="text-xs">Monthly Budget</label>
          <input
            type="number"
            step="0.01"
            className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={form.monthlyBudget}
            onChange={(e) => setForm((f) => ({ ...f, monthlyBudget: Number(e.target.value) }))}
          />
        </div>
        <div className="grid gap-1">
          <label className="text-xs">Target Allocation (JSON)</label>
          <textarea
            className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700 h-32"
            value={form.targetAllocJson}
            onChange={(e) => setForm((f) => ({ ...f, targetAllocJson: e.target.value }))}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <button
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            disabled={saving}
            onClick={async () => {
              try {
                setSaving(true);
                setError(null);
                StrategySchema.parse(form);
                const res = await fetch("/api/strategy", {
                  method: "PUT",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const s = await res.json();
                setStrategy(s);
              } catch (e) {
                const msg = e instanceof z.ZodError ? e.issues.map((er) => er.message).join("; ") : (e as Error).message;
                setError(msg);
              } finally {
                setSaving(false);
              }
            }}
          >
            Save Strategy
          </button>
        </div>
      </div>
    </main>
  );
}


