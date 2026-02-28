"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Info } from "lucide-react";
import historicalData from "@/data/budget/historical.json";
import type { BudgetHistoricalData } from "@/types/budget";

const data = historicalData as unknown as BudgetHistoricalData;

function formatMillions(value: number): string {
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

export default function HistoricalTrendChart() {
  const [visibleDepts, setVisibleDepts] = useState<Set<string>>(
    new Set(data.departments.map((d) => d.id))
  );
  const [showTotal, setShowTotal] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const chartData = useMemo(() => {
    return data.fiscalYears.map((fy, i) => {
      const point: Record<string, string | number> = { fiscalYear: fy };
      data.departments.forEach((dept) => {
        point[dept.id] = dept.amounts[i];
      });
      point.total = data.totals[i];
      return point;
    });
  }, []);

  const toggleDept = (id: string) => {
    setVisibleDepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (visibleDepts.size === data.departments.length) {
      setVisibleDepts(new Set());
    } else {
      setVisibleDepts(new Set(data.departments.map((d) => d.id)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleAll}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            visibleDepts.size === data.departments.length
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Departments
        </button>
        <button
          onClick={() => setShowTotal(!showTotal)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            showTotal
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Total Budget
        </button>
        {data.departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => toggleDept(dept.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              backgroundColor: visibleDepts.has(dept.id)
                ? dept.color + "15"
                : "white",
              borderColor: visibleDepts.has(dept.id) ? dept.color : "#e5e7eb",
              color: visibleDepts.has(dept.id) ? dept.color : "#6b7280",
            }}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="fiscalYear"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={formatMillions}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value, name) => {
                const dept = data.departments.find((d) => d.id === name);
                return [
                  formatMillions(Number(value)),
                  dept?.name || (name === "total" ? "Total Budget" : String(name)),
                ];
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />

            {/* Key event reference lines */}
            {data.keyEvents.map((event) => (
              <ReferenceLine
                key={event.fiscalYear}
                x={event.fiscalYear}
                stroke="#9ca3af"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ))}

            {/* Total line */}
            {showTotal && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="#111827"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#111827" }}
                activeDot={{ r: 5 }}
                name="total"
              />
            )}

            {/* Department lines */}
            {data.departments.map((dept) =>
              visibleDepts.has(dept.id) ? (
                <Line
                  key={dept.id}
                  type="monotone"
                  dataKey={dept.id}
                  stroke={dept.color}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: dept.color }}
                  activeDot={{ r: 4 }}
                  name={dept.id}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.keyEvents.map((event) => (
          <button
            key={event.fiscalYear}
            onClick={() =>
              setSelectedEvent(
                selectedEvent === event.fiscalYear ? null : event.fiscalYear
              )
            }
            className={`text-left rounded-xl border p-4 transition-all ${
              selectedEvent === event.fiscalYear
                ? "border-eco-green bg-eco-green-light/30"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">
                FY {event.fiscalYear}
              </span>
              <span className="text-xs font-semibold text-eco-green">
                {event.label}
              </span>
            </div>
            {selectedEvent === event.fiscalYear && (
              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
            )}
          </button>
        ))}
      </div>

      {/* Source */}
      <div className="text-xs text-gray-400 text-center">
        Data: Cerritos OpenGov Transparency Portal | Actuals FY 2016-17 through
        FY 2024-25, Adopted FY 2025-26
      </div>
    </div>
  );
}
