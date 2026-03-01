import { TrendingUp } from "lucide-react";
import ImpactROIDashboard from "@/components/impact/ImpactROIDashboard";
import expenditureData from "@/data/budget/expenditures.json";
import type { BudgetData } from "@/types/budget";

const budgetData = expenditureData as unknown as BudgetData;

export const metadata = {
  title: "Community Impact — EcoQuest GreenLedger",
};

export default function ImpactPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-primary-light flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-civic-primary" />
          </div>
          <div>
            <h1 className="section-title mb-0">Community Impact</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Every challenge completed adds to Cerritos&apos;s collective
          sustainability impact. Track outcomes, costs, and projected growth.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <ImpactROIDashboard categories={budgetData.categories} />
    </div>
  );
}
