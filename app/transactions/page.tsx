"use client";
import React, { useEffect, useMemo, useState } from "react";

type Holding = { id: string; product: { id: string; name: string; type: "SINGLE" | "SEALED" } };

export default function TransactionsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/holdings");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setHoldings(await res.json());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const products = useMemo(() => {
    const map = new Map<string, { id: string; name: string; type: "SINGLE" | "SEALED" }>();
    holdings.forEach((h) => {
      if (!map.has(h.product.id)) map.set(h.product.id, h.product);
    });
    return Array.from(map.values());
  }, [holdings]);

  if (loading) return <div className="p-6 text-black dark:text-white">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6 text-black dark:text-white">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>
      <TxForm products={products} />
      <p className="text-xs text-gray-400 mt-3">Note: For new products, add a holding first on the Holdings page.</p>
    </main>
  );
}

function TxForm({ products }: { products: Array<{ id: string; name: string; type: "SINGLE" | "SEALED" }> }) {
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [productId, setProductId] = useState<string>(products[0]?.id ?? "");
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("0");
  const [fees, setFees] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [tax, setTax] = useState("0");
  const [when, setWhen] = useState<string>(new Date().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="p-4 border rounded-2xl grid gap-3 max-w-2xl">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1 text-sm"><input type="radio" checked={type === "buy"} onChange={() => setType("buy")} /> Buy</label>
        <label className="flex items-center gap-1 text-sm"><input type="radio" checked={type === "sell"} onChange={() => setType("sell")} /> Sell</label>
      </div>

      <div className="grid gap-1">
        <label className="text-xs">Product</label>
        <select
          className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Field label="Qty">
          <input type="number" min={1} className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={qty} onChange={(e) => setQty(e.target.value)} />
        </Field>
        <Field label="Unit Price">
          <input type="number" min={0} step="0.01" className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
        </Field>
        <Field label="Fees">
          <input type="number" min={0} step="0.01" className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={fees} onChange={(e) => setFees(e.target.value)} />
        </Field>
        <Field label="Shipping">
          <input type="number" min={0} step="0.01" className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={shipping} onChange={(e) => setShipping(e.target.value)} />
        </Field>
        <Field label="Tax">
          <input type="number" min={0} step="0.01" className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={tax} onChange={(e) => setTax(e.target.value)} />
        </Field>
        <Field label="When">
          <input type="datetime-local" className="border rounded px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700" value={when} onChange={(e) => setWhen(e.target.value)} />
        </Field>
      </div>

      <div>
        <button
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
          disabled={saving || !productId}
          onClick={async () => {
            try {
              setSaving(true);
              setMsg(null);
              const body = {
                type,
                productId,
                qty: Number(qty),
                unitPrice: Number(unitPrice),
                fees: Number(fees),
                shipping: Number(shipping),
                tax: Number(tax),
                date: new Date(when).toISOString(),
              } as const;
              const res = await fetch("/api/transactions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              setMsg(`${type.toUpperCase()} recorded`);
            } catch (e) {
              setMsg((e as Error).message);
            } finally {
              setSaving(false);
            }
          }}
        >
          Save Transaction
        </button>
        {msg && <span className="ml-3 text-sm text-gray-300">{msg}</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs">{label}</span>
      {children}
    </label>
  );
}


