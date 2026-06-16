"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ComplianceTrend } from "../types/manager";

interface ComplianceTrendChartProps {
  data: ComplianceTrend[];
}

export default function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  return (
    <div className="h-[320px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dadce0" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#5f6368", fontSize: 11 }}
            axisLine={{ stroke: "#dadce0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
            tick={{ fill: "#5f6368", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #dadce0",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
            formatter={(value: any) => [`${value}%`, "Compliance"]}
          />
          <Area
            type="monotone"
            dataKey="compliance"
            stroke="#1a73e8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompliance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
