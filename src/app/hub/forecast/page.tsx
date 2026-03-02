"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import { TrendingUp, Info } from "lucide-react";
import {
  generateTotalForecast,
  generateDepartmentForecasts,
  type ForecastPoint,
} from "@/lib/budget-forecast";

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function ForecastPage() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const totalData = generateTotalForecast();
  const deptForecasts = generateDepartmentForecasts();

  const activeForecast = selectedDept
    ? deptForecasts.find((d) => d.id === selectedDept)
    : null;
  const chartData = activeForecast ? activeForecast.data : totalData;
  const chartTitle = activeForecast
    ? activeForecast.name
    : "Total Budget (All Departments)";
  const chartColor = activeForecast ? activeForecast.color : "#1a365d";

  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-civic-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Budget Forecast
              </h1>
              <p className="text-sm text-gray-500">
                5-year projections using linear regression on 10-year data
              </p>
            </div>
          </div>
        </div>

        {/* Department Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedDept(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedDept
                ? "bg-civic-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Total Budget
          </button>
          {deptForecasts.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedDept === dept.id
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={
                selectedDept === dept.id
                  ? { backgroundColor: dept.color }
                  : undefined
              }
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {chartTitle}
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10 }}
                  interval={1}
                />
                <YAxis
                  tickFormatter={(v: number) => fmt(v)}
                  tick={{ fontSize: 10 }}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Confidence band */}
                <Area
                  dataKey="upper"
                  stroke="none"
                  fill={chartColor}
                  fillOpacity={0.08}
                  name="95% Confidence Upper"
                  legendType="none"
                />
                <Area
                  dataKey="lower"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1}
                  name="95% Confidence Lower"
                  legendType="none"
                />

                {/* Actual line */}
                <Line
                  dataKey="actual"
                  stroke={chartColor}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: chartColor }}
                  name="Actual"
                  connectNulls={false}
                />

                {/* Forecast line */}
                <Line
                  dataKey="forecast"
                  stroke={chartColor}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={{ r: 3, fill: "white", stroke: chartColor, strokeWidth: 2 }}
                  name="Forecast"
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        {activeForecast && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Annual Growth</p>
              <p className="text-lg font-bold text-gray-900">
                {(activeForecast.annualGrowthRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">R² (Fit Quality)</p>
              <p className="text-lg font-bold text-gray-900">
                {activeForecast.r2.toFixed(3)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Current (FY 25-26)</p>
              <p className="text-lg font-bold text-gray-900">
                {fmt(
                  activeForecast.data.find((d) => d.year === "2025-26")
                    ?.actual ?? 0
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Projected (FY 30-31)</p>
              <p className="text-lg font-bold text-gray-900">
                {fmt(
                  activeForecast.data[activeForecast.data.length - 1]
                    ?.forecast ?? 0
                )}
              </p>
            </div>
          </div>
        )}

        {/* Department comparison table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Department Growth Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2 text-gray-600">
                    Department
                  </th>
                  <th className="text-right px-4 py-2 text-gray-600">
                    Annual Growth
                  </th>
                  <th className="text-right px-4 py-2 text-gray-600">
                    R² Fit
                  </th>
                  <th className="text-right px-4 py-2 text-gray-600">
                    FY 30-31 Projected
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...deptForecasts]
                  .sort((a, b) => b.annualGrowthRate - a.annualGrowthRate)
                  .map((dept) => {
                    const projected =
                      dept.data[dept.data.length - 1]?.forecast ?? 0;
                    return (
                      <tr
                        key={dept.id}
                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedDept(dept.id)}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="font-medium text-gray-900">
                              {dept.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-right px-4 py-2.5 text-gray-900 font-medium">
                          {(dept.annualGrowthRate * 100).toFixed(1)}%
                        </td>
                        <td className="text-right px-4 py-2.5 text-gray-600">
                          {dept.r2.toFixed(3)}
                        </td>
                        <td className="text-right px-4 py-2.5 text-gray-900 font-medium">
                          {fmt(projected)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology note */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>Methodology:</strong> Linear regression (ordinary least
                squares) on 10-year historical data from the OpenGov
                Transparency Portal. FY 2023-24 excluded from regression as an
                outlier ($152M due to one-time interfund loan forgiveness).
              </p>
              <p>
                Shaded area shows 95% confidence interval. R² indicates how well
                the linear model fits the data (1.0 = perfect fit). These are
                statistical projections, not official city forecasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
