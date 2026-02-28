"use client";

import { useMemo, useState } from "react";
import type {
  BudgetData,
  BudgetCategory,
  SustainabilityTag,
  BudgetSummary,
} from "@/types/budget";
import { CERRITOS_POPULATION } from "@/lib/constants";

interface UseBudgetDataReturn {
  expenditures: BudgetData | null;
  revenue: BudgetData | null;
  activeFilters: SustainabilityTag[];
  setActiveFilters: (filters: SustainabilityTag[]) => void;
  activeFiscalYear: string;
  setActiveFiscalYear: (year: string) => void;
  filteredExpenditures: BudgetCategory[];
  filteredRevenue: BudgetCategory[];
  summary: BudgetSummary | null;
  isPerCapita: boolean;
  setIsPerCapita: (v: boolean) => void;
}

export function useBudgetData(
  expenditureData: BudgetData,
  revenueData: BudgetData
): UseBudgetDataReturn {
  const [activeFilters, setActiveFilters] = useState<SustainabilityTag[]>([]);
  const [activeFiscalYear, setActiveFiscalYear] = useState<string>(
    expenditureData.fiscalYears[expenditureData.fiscalYears.length - 1]
  );
  const [isPerCapita, setIsPerCapita] = useState(false);

  const filteredExpenditures = useMemo(() => {
    if (activeFilters.length === 0) return expenditureData.categories;
    return expenditureData.categories.filter((cat) =>
      cat.sustainabilityTags.some((tag) => activeFilters.includes(tag))
    );
  }, [expenditureData.categories, activeFilters]);

  const filteredRevenue = useMemo(() => {
    if (activeFilters.length === 0) return revenueData.categories;
    return revenueData.categories;
  }, [revenueData.categories, activeFilters]);

  const summary = useMemo((): BudgetSummary => {
    const population = expenditureData.populationEstimate || CERRITOS_POPULATION;

    const totalExpenditures = expenditureData.categories.reduce((sum, cat) => {
      const yearAmount = cat.amounts.find(
        (a) => a.fiscalYear === activeFiscalYear
      );
      return sum + (yearAmount?.amount || 0);
    }, 0);

    const totalRevenue = revenueData.categories.reduce((sum, cat) => {
      const yearAmount = cat.amounts.find(
        (a) => a.fiscalYear === activeFiscalYear
      );
      return sum + (yearAmount?.amount || 0);
    }, 0);

    const sustainabilityTags: SustainabilityTag[] = [
      "parks",
      "waste",
      "water",
      "energy",
      "streets",
    ];
    const sustainabilitySpend = expenditureData.categories
      .filter((cat) =>
        cat.sustainabilityTags.some((tag) => sustainabilityTags.includes(tag))
      )
      .reduce((sum, cat) => {
        const yearAmount = cat.amounts.find(
          (a) => a.fiscalYear === activeFiscalYear
        );
        return sum + (yearAmount?.amount || 0);
      }, 0);

    const topCategory = [...expenditureData.categories].sort((a, b) => {
      const aAmount =
        a.amounts.find((x) => x.fiscalYear === activeFiscalYear)?.amount || 0;
      const bAmount =
        b.amounts.find((x) => x.fiscalYear === activeFiscalYear)?.amount || 0;
      return bAmount - aAmount;
    })[0];

    return {
      totalRevenue,
      totalExpenditures,
      surplus: totalRevenue - totalExpenditures,
      populationEstimate: population,
      revenuePerCapita: totalRevenue / population,
      expenditurePerCapita: totalExpenditures / population,
      topExpenditureCategory: topCategory?.name || "",
      sustainabilitySpendPercent: sustainabilitySpend / totalExpenditures,
      fiscalYear: activeFiscalYear,
    };
  }, [expenditureData, revenueData, activeFiscalYear]);

  return {
    expenditures: expenditureData,
    revenue: revenueData,
    activeFilters,
    setActiveFilters,
    activeFiscalYear,
    setActiveFiscalYear,
    filteredExpenditures,
    filteredRevenue,
    summary,
    isPerCapita,
    setIsPerCapita,
  };
}
