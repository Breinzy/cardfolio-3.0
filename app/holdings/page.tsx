"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Holding = {
  id: string;
  product: { name: string };
  condition: string | null;
  grade: string | null;
  quantity: number;
  costBasisTotal: number;
  source: string | null;
};

export default function HoldingsPage() {
  const [data, setData] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/holdings");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = useMemo<ColumnDef<Holding>[]>(
    () => [
      { header: "Product", accessorFn: (row) => row.product.name },
      {
        header: "Qty",
        accessorKey: "quantity",
        cell: ({ row, getValue }) => (
          <InlineNumber
            value={Number(getValue())}
            onSave={async (v) => save(row.original.id, { quantity: v })}
          />
        ),
      },
      {
        header: "Cost",
        accessorKey: "costBasisTotal",
        cell: ({ row, getValue }) => (
          <InlineNumber
            value={Number(getValue())}
            onSave={async (v) => save(row.original.id, { costBasisTotal: v })}
          />
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="text-red-600"
            onClick={async () => {
              await fetch(`/api/holdings/${row.original.id}`, { method: "DELETE" });
              setData((d) => d.filter((h) => h.id !== row.original.id));
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  async function save(id: string, patch: Partial<Pick<Holding, "quantity" | "costBasisTotal">>) {
    const res = await fetch(`/api/holdings/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => d.map((h) => (h.id === id ? { ...h, ...updated } : h)));
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Holdings</h1>
      <AddHoldingForm
        onCreated={(h) => setData((d) => [h, ...d])}
      />
      <div className="h-4" />
      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left p-2 border-b">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="odd:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function InlineNumber({ value, onSave }: { value: number; onSave: (v: number) => Promise<void> }) {
  const [val, setVal] = useState<string>(String(value));
  const [saving, setSaving] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <input
        className="border rounded px-2 py-1 w-24 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700 placeholder-gray-400"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="0"
      />
      <button
        className="px-2 py-1 rounded bg-black text-white disabled:opacity-60"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await onSave(Number(val));
          setSaving(false);
        }}
      >
        Save
      </button>
    </div>
  );
}

function AddHoldingForm({ onCreated }: { onCreated: (h: Holding) => void }) {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState<"SINGLE" | "SEALED">("SINGLE");
  const [quantity, setQuantity] = useState("1");
  const [cost, setCost] = useState("0");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="p-4 border rounded-2xl flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="text-xs">Product</label>
        <input
          className="border rounded px-2 py-1 w-64 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700 placeholder-gray-400"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Type</label>
        <select
          className="border rounded px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={productType}
          onChange={(e) => setProductType(e.target.value === "SEALED" ? "SEALED" : "SINGLE")}
        >
          <option value="SINGLE">SINGLE</option>
          <option value="SEALED">SEALED</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Qty</label>
        <input
          type="number"
          min={0}
          className="border rounded px-2 py-1 w-24 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Cost</label>
        <input
          type="number"
          min={0}
          step="0.01"
          className="border rounded px-2 py-1 w-32 bg-white text-black dark:bg-zinc-900 dark:text-white border-gray-300 dark:border-gray-700"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>
      <button
        className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
        disabled={saving || !productName}
        onClick={async () => {
          try {
            setSaving(true);
            setErr(null);
            const res = await fetch("/api/holdings", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                productName,
                productType,
                quantity: Number(quantity),
                costBasisTotal: Number(cost),
              }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const created = await res.json();
            onCreated(created);
            setProductName("");
            setQuantity("1");
            setCost("0");
          } catch (e) {
            setErr((e as Error).message);
          } finally {
            setSaving(false);
          }
        }}
      >
        Add
      </button>
      {err && <div className="text-red-600 text-xs">{err}</div>}
    </div>
  );
}


