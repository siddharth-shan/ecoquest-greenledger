"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";
import type { BudgetCategory } from "@/types/budget";

interface TrendChartProps {
  categories: BudgetCategory[];
  fiscalYears: string[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
      <p className="font-semibold text-sm text-gray-900 mb-2">FY {label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold">{formatCurrencyFull(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({
  categories,
  fiscalYears,
}: TrendChartProps) {
  const data = useMemo(() => {
    return fiscalYears.map((year) => {
      const point: Record<string, string | number> = { year };
      categories.forEach((cat) => {
        const yearData = cat.amounts.find((a) => a.fiscalYear === year);
        point[cat.name] = yearData?.amount || 0;
      });
      return point;
    });
  }, [categories, fiscalYears]);

  return (
    <div>
      <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
        Spending Trends (3 Years)
      </h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {categories.map((cat) => (
                <linearGradient
                  key={cat.id}
                  id={`gradient-${cat.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={cat.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={cat.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="year" fontSize={12} tick={{ fill: "#6b7280" }} />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              fontSize={12}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            {categories.map((cat) => (
              <Area
                key={cat.id}
                type="monotone"
                dataKey={cat.name}
                stroke={cat.color}
                fill={`url(#gradient-${cat.id})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
