"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type RoiPoint = { date: string; invested: number; equity: number; realized: number; unrealized: number };

export default function RoiChart({ data }: { data: RoiPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="invested" stroke="#8884d8" />
          <Line type="monotone" dataKey="equity" stroke="#82ca9d" />
          <Line type="monotone" dataKey="realized" stroke="#ff7300" />
          <Line type="monotone" dataKey="unrealized" stroke="#387908" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


