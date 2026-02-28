import { TrendingUp } from "lucide-react";
import BudgetOverview from "@/components/budget/BudgetOverview";
import HistoricalTrendChart from "@/components/budget/HistoricalTrendChart";
import expenditureData from "@/data/budget/expenditures.json";
import revenueData from "@/data/budget/revenue.json";
import glossaryData from "@/data/budget/glossary.json";
import type { BudgetData, GlossaryTerm } from "@/types/budget";

export const metadata = {
  title: "Budget Explorer — EcoQuest GreenLedger",
  description:
    "Explore the City of Cerritos budget with interactive charts, sustainability filters, and youth-friendly explanations.",
};

export default function BudgetPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="section-title">
          Budget <span className="text-gradient">Explorer</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          See how Cerritos spends your tax dollars — real data from the FY
          2025-26 Adopted Budget.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <BudgetOverview
        expenditureData={expenditureData as unknown as BudgetData}
        revenueData={revenueData as unknown as BudgetData}
        glossaryTerms={(glossaryData as { terms: GlossaryTerm[] }).terms}
      />

      {/* 10-Year Historical Trend */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-eco-blue-light flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-eco-blue" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900">
              10-Year Budget History
            </h2>
            <p className="text-sm text-gray-500">
              How Cerritos spending has evolved from FY 2016-17 to FY 2025-26
            </p>
          </div>
        </div>
        <HistoricalTrendChart />
      </div>
    </div>
  );
}
