import type { ImpactCounter, CostPerOutcome, CategoryROI, ScalingProjection } from "@/types/challenge";
import type { SustainabilityTag, BudgetCategory } from "@/types/budget";
import { DOLLAR_EQUIVALENCES } from "@/lib/impact-equivalences";
import roiConfig from "@/data/impact/roi-config.json";

const COUNTER_TAG_MAP: Record<string, SustainabilityTag> = {
  "water-saved": "water",
  "trees-cared": "parks",
  "litter-collected": "waste",
  "park-hours": "parks",
};

const TAG_LABELS: Record<string, string> = {
  water: "Water Conservation",
  parks: "Parks & Greening",
  waste: "Waste & Recycling",
  energy: "Energy & Facilities",
};

function getDepartmentBudget(
  categories: BudgetCategory[],
  departmentId: string,
  fiscalYear: string
): number {
  const dept = categories.find((c) => c.id === departmentId);
  if (!dept) return 0;
  const yearData = dept.amounts.find((a) => a.fiscalYear === fiscalYear);
  return yearData?.amount ?? 0;
}

export function computeCostPerOutcome(
  counters: ImpactCounter[],
  categories: BudgetCategory[],
  fiscalYear: string = "2025-26"
): CostPerOutcome[] {
  const mapping = roiConfig.counterBudgetMapping as Record<
    string,
    { departmentId: string; departmentName: string; budgetSharePercent: number }
  >;
  const benchmarks = roiConfig.benchmarks as Record<
    string,
    { costPerUnit: number; unit: string; source: string }
  >;

  return counters
    .filter((c) => mapping[c.id] && benchmarks[c.id])
    .map((counter) => {
      const map = mapping[counter.id];
      const bench = benchmarks[counter.id];
      const deptBudget = getDepartmentBudget(categories, map.departmentId, fiscalYear);
      const budgetAllocated = deptBudget * (map.budgetSharePercent / 100);
      const costPerUnit = counter.value > 0 ? budgetAllocated / counter.value : 0;
      const efficiencyRatio = bench.costPerUnit > 0 ? costPerUnit / bench.costPerUnit : 0;

      return {
        counterId: counter.id,
        counterLabel: counter.label,
        communityTotal: counter.value,
        unit: counter.unit,
        departmentName: map.departmentName,
        budgetAllocated,
        costPerUnit,
        benchmarkCostPerUnit: bench.costPerUnit,
        benchmarkSource: bench.source,
        efficiencyRatio,
        sustainabilityTag: COUNTER_TAG_MAP[counter.id] ?? "general",
      };
    });
}

export function computeCategoryROI(costOutcomes: CostPerOutcome[]): CategoryROI[] {
  const groups: Record<string, CostPerOutcome[]> = {};
  for (const co of costOutcomes) {
    const tag = co.sustainabilityTag;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(co);
  }

  return Object.entries(groups).map(([tag, items]) => {
    const totalBudget = items.reduce((s, i) => s + i.budgetAllocated, 0);
    const totalUnits = items.reduce((s, i) => s + i.communityTotal, 0);
    const avgCost = totalUnits > 0 ? totalBudget / totalUnits : 0;
    const avgBench =
      items.reduce((s, i) => s + i.benchmarkCostPerUnit, 0) / items.length;
    const ratio = avgBench > 0 ? avgCost / avgBench : 1;

    let roiRating: "excellent" | "good" | "fair" = "fair";
    if (ratio <= 0.8) roiRating = "excellent";
    else if (ratio <= 1.2) roiRating = "good";

    return {
      tag: tag as SustainabilityTag,
      label: TAG_LABELS[tag] ?? tag,
      totalBudgetAllocated: totalBudget,
      totalCommunityUnits: totalUnits,
      avgCostPerUnit: avgCost,
      avgBenchmarkCost: avgBench,
      roiRating,
    };
  });
}

export function computeScalingProjection(
  counters: ImpactCounter[],
  targetParticipants: number,
  currentParticipants: number = 50
): ScalingProjection[] {
  const multiplier = currentParticipants > 0 ? targetParticipants / currentParticipants : 1;

  return counters
    .filter((c) => DOLLAR_EQUIVALENCES[c.id])
    .map((counter) => {
      const projected = Math.round(counter.value * multiplier);
      const dollarVal = DOLLAR_EQUIVALENCES[counter.id];
      return {
        counterId: counter.id,
        counterLabel: counter.label,
        currentValue: counter.value,
        projectedValue: projected,
        multiplier,
        unit: counter.unit,
        dollarValue: projected * (dollarVal?.dollarPerUnit ?? 0),
      };
    });
}
