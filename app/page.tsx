import { getDashboardSummary } from "@/lib/summary";
// UI stabilization: show only value cards on dashboard

export default async function Page() {
  const summary = await getDashboardSummary();
  return (
    <main className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Cost" value={summary.totalCost} />
        <Card title="Est Value" value={summary.estValue} />
        <Card title="P/L" value={summary.pnl} />
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 rounded-2xl border">
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold">{value.toFixed(2)}</div>
    </div>
  );
}
