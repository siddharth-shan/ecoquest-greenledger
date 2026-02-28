import { SlidersHorizontal } from "lucide-react";
import BudgetSimulator from "@/components/budget/BudgetSimulator";

export const metadata = {
  title: "Budget Simulator — EcoQuest GreenLedger",
  description:
    "Reallocate the Cerritos city budget and see what trade-offs emerge. Drag sliders to shift spending between departments and understand per-capita impacts.",
};

export default function SimulatorPage() {
  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="section-title mb-0">
            Budget <span className="text-gradient">Simulator</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          What if you were in charge? Drag the sliders to build your own budget.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <BudgetSimulator />
    </div>
  );
}
