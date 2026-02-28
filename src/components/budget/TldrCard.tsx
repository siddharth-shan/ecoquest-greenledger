import {
  Shield,
  TreePine,
  Wrench,
  Recycle,
  Building2,
  Droplets,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import SustainabilityTag from "@/components/shared/SustainabilityTag";
import type { BudgetCategory } from "@/types/budget";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  TreePine,
  Wrench,
  Recycle,
  Building2,
  Droplets,
  Briefcase,
  BookOpen,
};

interface TldrCardProps {
  category: BudgetCategory;
  fiscalYear: string;
  isPerCapita?: boolean;
  population?: number;
}

export default function TldrCard({
  category,
  fiscalYear,
  isPerCapita = false,
  population = 51460,
}: TldrCardProps) {
  const Icon = iconMap[category.icon] || Building2;
  const yearData = category.amounts.find((a) => a.fiscalYear === fiscalYear);
  const amount = yearData?.amount || 0;
  const displayAmount = isPerCapita ? Math.round(amount / population) : amount;

  const prevYear = category.amounts[category.amounts.length - 2];
  const changePercent = prevYear
    ? ((amount - prevYear.amount) / prevYear.amount) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: category.color + "15" }}
        >
          <Icon className="w-5 h-5" style={{ color: category.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-gray-900 truncate">
              {category.name}
            </h4>
            {category.sustainabilityTags[0] !== "general" && (
              <SustainabilityTag tag={category.sustainabilityTags[0]} />
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {category.tldr}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {isPerCapita ? `$${displayAmount}` : formatCurrency(displayAmount)}
            </span>
            {isPerCapita && (
              <span className="text-xs text-gray-400">/person</span>
            )}
            {changePercent !== 0 && (
              <span
                className={`text-xs font-medium ${
                  changePercent > 0 ? "text-amber-600" : "text-green-600"
                }`}
              >
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
