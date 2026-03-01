import type { CostPerOutcome } from "@/types/challenge";
import { formatCurrency } from "@/lib/utils";

interface ReportCostMetricsProps {
  costOutcomes: CostPerOutcome[];
}

export default function ReportCostMetrics({ costOutcomes }: ReportCostMetricsProps) {
  if (costOutcomes.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
        Cost per Outcome Analysis
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Connecting community impact metrics to city budget allocations, with
        external benchmarks for cost efficiency comparison.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 pr-2 text-gray-700">Metric</th>
              <th className="text-right py-2 px-2 text-gray-700">
                Community Total
              </th>
              <th className="text-right py-2 px-2 text-gray-700">
                Budget Allocated
              </th>
              <th className="text-right py-2 px-2 text-gray-700">
                Cost/Unit
              </th>
              <th className="text-right py-2 px-2 text-gray-700">
                Benchmark
              </th>
              <th className="text-right py-2 pl-2 text-gray-700">Rating</th>
            </tr>
          </thead>
          <tbody>
            {costOutcomes.map((co) => {
              const ratio = co.efficiencyRatio;
              const rating =
                ratio <= 0.8
                  ? "Excellent"
                  : ratio <= 1.2
                    ? "Good"
                    : "Above Avg";
              const ratingColor =
                ratio <= 0.8
                  ? "text-green-700"
                  : ratio <= 1.2
                    ? "text-yellow-700"
                    : "text-red-700";

              return (
                <tr
                  key={co.counterId}
                  className="border-b border-gray-100"
                >
                  <td className="py-2 pr-2 text-gray-800 font-medium">
                    {co.counterLabel}
                    <br />
                    <span className="text-gray-400 font-normal">
                      {co.departmentName}
                    </span>
                  </td>
                  <td className="text-right py-2 px-2 text-gray-900 font-bold">
                    {co.communityTotal.toLocaleString()}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-900">
                    {formatCurrency(co.budgetAllocated)}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-900 font-bold">
                    ${co.costPerUnit.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-2 text-gray-600">
                    ${co.benchmarkCostPerUnit.toFixed(2)}
                  </td>
                  <td
                    className={`text-right py-2 pl-2 font-bold ${ratingColor}`}
                  >
                    {rating}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-gray-400 mt-3">
        Budget allocated = department total × estimated program share %.
        Benchmarks: MWD wholesale water rate, USDA tree maintenance avg, Keep
        America Beautiful cleanup cost, Independent Sector volunteer value.
      </p>
    </section>
  );
}
