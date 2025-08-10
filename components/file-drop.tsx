"use client";
import React, { useState } from "react";

export default function FileDrop() {
  const [result, setResult] = useState<string>("");
  const [err, setErr] = useState<string>("");
  return (
    <div className="p-4 border rounded-2xl">
      <div className="text-sm font-medium mb-2">Import Holdings (CSV)</div>
      <input
        type="file"
        accept=".csv"
        onChange={async (e) => {
          setErr("");
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            const text = await f.text();
            const res = await fetch("/api/import/holdings", { method: "POST", body: text });
            const json = await res.json();
            setResult(JSON.stringify(json, null, 2));
            // naive refresh to reflect new rows
            try { location.reload(); } catch {}
          } catch (e) {
            setErr((e as Error).message);
          }
        }}
        className="text-sm"
      />
      {err && <div className="text-red-600 text-xs mt-2">{err}</div>}
      {result && <pre className="mt-3 text-xs whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}


