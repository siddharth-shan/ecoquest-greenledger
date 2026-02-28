import BudgetOverview from "@/components/budget/BudgetOverview";
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
          See how Cerritos spends your tax dollars — and how much goes to
          sustainability.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <BudgetOverview
        expenditureData={expenditureData as unknown as BudgetData}
        revenueData={revenueData as unknown as BudgetData}
        glossaryTerms={(glossaryData as { terms: GlossaryTerm[] }).terms}
      />
    </div>
  );
}
