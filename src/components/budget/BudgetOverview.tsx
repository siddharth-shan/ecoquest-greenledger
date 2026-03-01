"use client";

import { useState } from "react";
import { BookOpen, Users, DollarSign } from "lucide-react";
import { useBudgetData } from "@/hooks/useBudgetData";
import BudgetChart from "./BudgetChart";
import TrendChart from "./TrendChart";
import TldrCard from "./TldrCard";
import SustainabilityFilter from "./SustainabilityFilter";
import GlossaryModal from "./GlossaryModal";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { BudgetData, GlossaryTerm } from "@/types/budget";

interface BudgetOverviewProps {
  expenditureData: BudgetData;
  revenueData: BudgetData;
  glossaryTerms: GlossaryTerm[];
}

export default function BudgetOverview({
  expenditureData,
  revenueData,
  glossaryTerms,
}: BudgetOverviewProps) {
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const {
    activeFilters,
    setActiveFilters,
    activeFiscalYear,
    setActiveFiscalYear,
    filteredExpenditures,
    filteredRevenue,
    summary,
    isPerCapita,
    setIsPerCapita,
  } = useBudgetData(expenditureData, revenueData);

  if (!summary) return null;

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-civic-primary to-civic-primary-dark rounded-xl p-4 text-white">
          <DollarSign className="w-5 h-5 mb-1 opacity-80" />
          <p className="text-xs opacity-80">Total Budget</p>
          <p className="text-xl font-bold">
            {formatCurrency(summary.totalExpenditures)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-civic-accent to-civic-accent-dark rounded-xl p-4 text-white">
          <Users className="w-5 h-5 mb-1 opacity-80" />
          <p className="text-xs opacity-80">Per Resident</p>
          <p className="text-xl font-bold">
            ${Math.round(summary.expenditurePerCapita).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Sustainability Spend</p>
          <p className="text-xl font-bold text-civic-accent">
            {formatPercent(summary.sustainabilitySpendPercent)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            {summary.surplus >= 0 ? "Surplus" : "Deficit"}
          </p>
          <p
            className={`text-xl font-bold ${
              summary.surplus >= 0 ? "text-civic-accent" : "text-red-500"
            }`}
          >
            {formatCurrency(Math.abs(summary.surplus))}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SustainabilityFilter
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
        <div className="flex items-center gap-3">
          <select
            value={activeFiscalYear}
            onChange={(e) => setActiveFiscalYear(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-civic-primary/20 focus:border-civic-primary outline-none"
          >
            {expenditureData.fiscalYears.map((y) => (
              <option key={y} value={y}>
                FY {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsPerCapita(!isPerCapita)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              isPerCapita
                ? "bg-civic-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Per Capita
          </button>
          <button
            onClick={() => setGlossaryOpen(true)}
            className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 inline mr-1" />
            Glossary
          </button>
        </div>
      </div>

      {/* TL;DR Cards */}
      <div>
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">
          TL;DR — Where the Money Goes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredExpenditures.map((cat) => (
            <TldrCard
              key={cat.id}
              category={cat}
              fiscalYear={activeFiscalYear}
              isPerCapita={isPerCapita}
              population={expenditureData.populationEstimate}
            />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <BudgetChart
            categories={filteredExpenditures}
            fiscalYear={activeFiscalYear}
            title="Spending by Category"
            isPerCapita={isPerCapita}
            population={expenditureData.populationEstimate}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <BudgetChart
            categories={filteredRevenue}
            fiscalYear={activeFiscalYear}
            title="Revenue Sources"
            isPerCapita={isPerCapita}
            population={revenueData.populationEstimate}
          />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <TrendChart
          categories={filteredExpenditures}
          fiscalYears={expenditureData.fiscalYears}
        />
      </div>

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        terms={glossaryTerms}
      />
    </div>
  );
}
