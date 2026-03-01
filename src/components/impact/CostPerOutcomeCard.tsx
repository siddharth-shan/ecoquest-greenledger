"use client";

import type { CostPerOutcome } from "@/types/challenge";
import { formatCurrency } from "@/lib/utils";
import SustainabilityTag from "@/components/shared/SustainabilityTag";

interface CostPerOutcomeCardProps {
  data: CostPerOutcome;
}

export default function CostPerOutcomeCard({ data }: CostPerOutcomeCardProps) {
  const ratio = data.efficiencyRatio;
  const ratingLabel =
    ratio <= 0.8 ? "Excellent" : ratio <= 1.2 ? "Good" : "Above Benchmark";
  const ratingColor =
    ratio <= 0.8
      ? "text-green-700 bg-green-100"
      : ratio <= 1.2
        ? "text-yellow-700 bg-yellow-100"
        : "text-red-700 bg-red-100";
  const barWidth = Math.min((ratio / 2) * 100, 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            {data.counterLabel}
          </h4>
          <p className="text-xs text-gray-500">{data.departmentName}</p>
        </div>
        <SustainabilityTag tag={data.sustainabilityTag} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Community Total</p>
          <p className="text-lg font-bold text-gray-900">
            {data.communityTotal.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">{data.unit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Budget Allocated</p>
          <p className="text-lg font-bold text-civic-primary">
            {formatCurrency(data.budgetAllocated)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Cost per Unit</span>
          <span className="text-sm font-bold text-gray-900">
            ${data.costPerUnit.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Benchmark</span>
          <span className="text-sm text-gray-600">
            ${data.benchmarkCostPerUnit.toFixed(2)}
          </span>
        </div>

        {/* Efficiency bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-civic-primary transition-all duration-500"
            style={{ width: `${barWidth}%` }}
          />
          {/* Benchmark marker at 50% (ratio=1.0) */}
          <div className="absolute top-0 h-full w-0.5 bg-gray-400" style={{ left: "50%" }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">More efficient</span>
          <span className="text-[10px] text-gray-400">Less efficient</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingColor}`}
        >
          {ratingLabel}
        </span>
        <span className="text-[10px] text-gray-400 max-w-[60%] text-right">
          {data.benchmarkSource}
        </span>
      </div>
    </div>
  );
}
