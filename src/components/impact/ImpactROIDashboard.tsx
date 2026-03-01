"use client";

import { useEffect, useState } from "react";
import {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
  Waves,
  Wind,
  UserCheck,
  HandCoins,
  Users,
  DollarSign,
  BarChart3,
  Calculator,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import CostPerOutcomeCard from "./CostPerOutcomeCard";
import ScalingCalculator from "./ScalingCalculator";
import { getEquivalence } from "@/lib/impact-equivalences";
import { computeCostPerOutcome, computeCategoryROI } from "@/lib/impact-roi";
import { formatCurrency } from "@/lib/utils";
import type { ImpactCounter } from "@/types/challenge";
import type { BudgetCategory } from "@/types/budget";
import { CHART_COLORS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  TreePine,
  Recycle,
  Clock,
  Trophy,
};

const equivIconMap: Record<string, React.ElementType> = {
  Waves,
  Wind,
  UserCheck,
  HandCoins,
  Users,
};

const TABS = [
  { id: "community", label: "Community Impact", icon: Trophy },
  { id: "cost", label: "Cost per Outcome", icon: DollarSign },
  { id: "roi", label: "ROI by Category", icon: BarChart3 },
  { id: "scale", label: "Scale Calculator", icon: Calculator },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ImpactROIDashboardProps {
  categories: BudgetCategory[];
}

export default function ImpactROIDashboard({ categories }: ImpactROIDashboardProps) {
  const [counters, setCounters] = useState<ImpactCounter[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("community");

  useEffect(() => {
    fetch("/api/impact")
      .then((r) => r.json())
      .then((data) => {
        setCounters(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const costOutcomes = loaded
    ? computeCostPerOutcome(counters, categories)
    : [];
  const categoryROI = computeCategoryROI(costOutcomes);

  const roiRatingColor: Record<string, string> = {
    excellent: "#16a34a",
    good: "#ca8a04",
    fair: "#dc2626",
  };

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto mb-6 -mx-4 px-4 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === tab.id
                  ? "bg-civic-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Community Impact tab */}
      {activeTab === "community" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counters.map((counter) => {
              const Icon = iconMap[counter.icon] || Trophy;
              const equiv = getEquivalence(counter.id, counter.value);
              const EquivIcon = equiv
                ? equivIconMap[equiv.icon] || Trophy
                : null;

              return (
                <div
                  key={counter.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-civic-light flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-civic-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                    <AnimatedCounter
                      value={loaded ? counter.value : 0}
                      duration={1500}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {counter.label}
                  </p>
                  {equiv && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-civic-accent mt-1 mb-2">
                      {EquivIcon && <EquivIcon className="w-3.5 h-3.5" />}
                      <span>
                        ≈ {equiv.value} {equiv.label}
                      </span>
                    </div>
                  )}
                  <SustainabilityTag tag={counter.sustainabilityTag} />
                </div>
              );
            })}
          </div>

          {loaded && counters.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500">
                <strong>Equivalences:</strong> Water savings at 660,000
                gal/Olympic pool (FINA). CO2 absorption at 48 lbs/tree/year
                (USDA Forest Service). Volunteer value at $31.80/hr (Independent
                Sector 2023). Waste diversion at 4.4 lbs/person-day (EPA).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cost per Outcome tab */}
      {activeTab === "cost" && (
        <div>
          {costOutcomes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {costOutcomes.map((co) => (
                <CostPerOutcomeCard key={co.counterId} data={co} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Loading cost data...
            </div>
          )}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500">
              <strong>Methodology:</strong> Budget allocated = department total ×
              estimated program share %. Cost per unit = budget allocated ÷
              community total. Efficiency ratio = city cost ÷ benchmark cost
              (lower is better). Benchmarks from MWD, USDA, Keep America
              Beautiful, and Independent Sector.
            </p>
          </div>
        </div>
      )}

      {/* ROI by Category tab */}
      {activeTab === "roi" && (
        <div>
          {categoryROI.length > 0 ? (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Budget Efficiency by Sustainability Category
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={categoryROI.map((r) => ({
                      name: r.label,
                      cityAvg: Number(r.avgCostPerUnit.toFixed(2)),
                      benchmark: Number(r.avgBenchmarkCost.toFixed(2)),
                      rating: r.roiRating,
                    }))}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={130}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                    <Bar dataKey="cityAvg" name="City Cost/Unit" radius={[0, 4, 4, 0]}>
                      {categoryROI.map((r, i) => (
                        <Cell
                          key={r.tag}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="benchmark"
                      name="Benchmark"
                      fill="#9ca3af"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categoryROI.map((r) => (
                  <div
                    key={r.tag}
                    className="bg-white rounded-xl border border-gray-100 p-4 text-center"
                  >
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {r.label}
                    </p>
                    <p className="text-2xl font-bold text-civic-primary mb-1">
                      {formatCurrency(r.totalBudgetAllocated)}
                    </p>
                    <span
                      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: roiRatingColor[r.roiRating],
                        backgroundColor:
                          roiRatingColor[r.roiRating] + "20",
                      }}
                    >
                      {r.roiRating.charAt(0).toUpperCase() + r.roiRating.slice(1)} Efficiency
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Loading ROI data...
            </div>
          )}
        </div>
      )}

      {/* Scale Calculator tab */}
      {activeTab === "scale" && (
        <ScalingCalculator counters={counters} />
      )}

      {loaded && counters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Impact counters are loading...</p>
        </div>
      )}
    </div>
  );
}
