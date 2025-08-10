import { NextResponse } from "next/server";
import { buildRoiSeries } from "@/lib/metrics/roi";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const intervalParam = url.searchParams.get("interval");
  const interval = (intervalParam === "day" || intervalParam === "week" || intervalParam === "month") ? intervalParam : "month";
  const series = await buildRoiSeries(interval);
  return NextResponse.json({ series });
}


