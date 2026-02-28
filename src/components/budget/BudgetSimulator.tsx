"use client";

import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Users,
  AlertTriangle,
  Share2,
} from "lucide-react";
import expenditureData from "@/data/budget/expenditures.json";
import type { BudgetData } from "@/types/budget";
import { CERRITOS_POPULATION } from "@/lib/constants";

const data = expenditureData as unknown as BudgetData;
const FY = "2025-26";

interface SimDepartment {
  id: string;
  name: string;
  color: string;
  baseAmount: number;
  currentAmount: number;
  isFixed: boolean;
  fixedReason?: string;
}

export default function BudgetSimulator() {
  const initialDepts = useMemo((): SimDepartment[] => {
    return data.categories.map((cat) => {
      const yearAmt = cat.amounts.find((a) => a.fiscalYear === FY);
      const amount = yearAmt?.amount || 0;
      const isFixed = cat.id === "community-safety";
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        baseAmount: amount,
        currentAmount: amount,
        isFixed,
        fixedReason: isFixed
          ? "Sheriff & Fire contracts are fixed by LA County — the city cannot easily reduce these."
          : undefined,
      };
    });
  }, []);

  const [departments, setDepartments] = useState<SimDepartment[]>(initialDepts);

  const totalBase = useMemo(
    () => initialDepts.reduce((s, d) => s + d.baseAmount, 0),
    [initialDepts]
  );

  const totalCurrent = departments.reduce((s, d) => s + d.currentAmount, 0);
  const difference = totalCurrent - totalBase;
  const perCapitaBase = totalBase / CERRITOS_POPULATION;
  const perCapitaCurrent = totalCurrent / CERRITOS_POPULATION;

  const handleSliderChange = (id: string, value: number) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, currentAmount: value } : d))
    );
  };

  const handleReset = () => {
    setDepartments(initialDepts);
  };

  const formatM = (v: number) =>
    `$${(v / 1_000_000).toFixed(1)}M`;

  const formatK = (v: number) =>
    `$${(v / 1_000).toFixed(0)}K`;

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100/50">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
          How would YOU balance the budget?
        </h3>
        <p className="text-sm text-gray-600">
          Start with the real FY 2025-26 General Fund operating expenditures (
          {formatM(totalBase)}). Drag the sliders to reallocate spending between
          departments. Watch how changes affect per-capita spending and see
          trade-offs in action.
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-500">Your Total</p>
          <p
            className={`text-xl font-bold ${
              Math.abs(difference) < 100000
                ? "text-eco-green"
                : difference > 0
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {formatM(totalCurrent)}
          </p>
          <p className="text-xs text-gray-400">
            {difference > 0 ? "+" : ""}
            {formatM(difference)} vs actual
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-xs text-gray-500">Per Resident</p>
          <p className="text-xl font-bold text-gray-900">
            ${perCapitaCurrent.toFixed(0)}
          </p>
          <p className="text-xs text-gray-400">
            was ${perCapitaBase.toFixed(0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 mx-auto text-sm font-medium text-eco-green hover:text-eco-green-dark transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <p className="text-xs text-gray-400 mt-1">Back to actual budget</p>
        </div>
      </div>

      {/* Department Sliders */}
      <div className="space-y-4">
        {departments
          .sort((a, b) => b.baseAmount - a.baseAmount)
          .map((dept) => {
            const change = dept.currentAmount - dept.baseAmount;
            const changePercent =
              dept.baseAmount > 0 ? (change / dept.baseAmount) * 100 : 0;
            const minVal = Math.round(dept.baseAmount * 0.5);
            const maxVal = Math.round(dept.baseAmount * 1.5);

            return (
              <div
                key={dept.id}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  dept.isFixed
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="font-medium text-sm text-gray-900">
                      {dept.name}
                    </span>
                    {dept.isFixed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Fixed Contract
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-gray-900">
                      {formatM(dept.currentAmount)}
                    </span>
                    {Math.abs(change) > 10000 && (
                      <span
                        className={`text-xs ml-2 font-medium ${
                          change > 0 ? "text-red-500" : "text-blue-500"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {changePercent.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {dept.isFixed ? (
                  <div className="text-xs text-amber-600 mt-1">
                    {dept.fixedReason}
                  </div>
                ) : (
                  <>
                    <input
                      type="range"
                      min={minVal}
                      max={maxVal}
                      value={dept.currentAmount}
                      onChange={(e) =>
                        handleSliderChange(dept.id, parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-current"
                      style={{ accentColor: dept.color }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formatM(minVal)} (-50%)</span>
                      <span className="text-gray-500 font-medium">
                        Actual: {formatM(dept.baseAmount)}
                      </span>
                      <span>{formatM(maxVal)} (+50%)</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>

      {/* Insight */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading font-bold text-sm text-gray-900 mb-3">
          What you&apos;re learning
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-eco-green mt-0.5">•</span>
            <span>
              <strong>Fixed costs matter:</strong> The Sheriff + Fire contracts
              ($23.4M) are negotiated with LA County and can&apos;t easily change.
              That&apos;s 26% of the budget locked in.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-eco-green mt-0.5">•</span>
            <span>
              <strong>Trade-offs are real:</strong> Increasing one department
              means finding savings elsewhere — or raising taxes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-eco-green mt-0.5">•</span>
            <span>
              <strong>Per-capita impact:</strong> Every $1M change = about $19.43
              per resident. Small percentages = big impacts.
            </span>
          </li>
        </ul>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Data: City of Cerritos FY 2025-26 Adopted Budget — General Fund
        Operating Expenditures | Population: 51,460
      </div>
    </div>
  );
}
