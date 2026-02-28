"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";
import type { BudgetCategory } from "@/types/budget";

interface BudgetChartProps {
  categories: BudgetCategory[];
  fiscalYear: string;
  title: string;
  isPerCapita?: boolean;
  population?: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string; tldr: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-semibold text-sm text-gray-900">{data.name}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">
        {formatCurrencyFull(data.value)}
      </p>
      <p className="text-xs text-gray-500 mt-1">{data.payload.tldr}</p>
    </div>
  );
};

export default function BudgetChart({
  categories,
  fiscalYear,
  title,
  isPerCapita = false,
  population = 51460,
}: BudgetChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const data = useMemo(
    () =>
      categories.map((cat) => {
        const yearData = cat.amounts.find((a) => a.fiscalYear === fiscalYear);
        const amount = yearData?.amount || 0;
        return {
          name: cat.name,
          value: isPerCapita ? Math.round(amount / population) : amount,
          color: cat.color,
          tldr: cat.tldr,
        };
      }),
    [categories, fiscalYear, isPerCapita, population]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-gray-900">
          {title}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setChartType("pie")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              chartType === "pie"
                ? "bg-white shadow-sm text-eco-green"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <PieIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              chartType === "bar"
                ? "bg-white shadow-sm text-eco-green"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <XAxis
                type="number"
                tickFormatter={(v: number) => formatCurrency(v)}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                fontSize={11}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
