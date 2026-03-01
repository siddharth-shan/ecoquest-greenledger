"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PowerMixComponent {
  name: string;
  percent: number;
  color: string;
}

interface PowerMixChartProps {
  data: PowerMixComponent[];
  title: string;
}

export default function PowerMixChart({ data, title }: PowerMixChartProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percent"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }: { name?: string; percent?: number }) =>
              (percent ?? 0) > 5 ? `${name} ${percent}%` : ""
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            formatter={(value: string) => (
              <span className="text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
