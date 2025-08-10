import { getDashboardSummary } from "@/lib/summary";
import AdvisorPanel from "@/components/advisor-panel";
import RoiChart from "@/components/roi-chart";
import { buildRoiSeries } from "@/lib/metrics/roi";

export default async function Page() {
  const summary = await getDashboardSummary();
  const series = await buildRoiSeries("month");
  return (
    <main className="p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Cost" value={summary.totalCost} />
        <Card title="Est Value" value={summary.estValue} />
        <Card title="P/L" value={summary.pnl} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">ROI</h2>
        <RoiChart data={series} />
      </section>

      <AdvisorPanel />
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
