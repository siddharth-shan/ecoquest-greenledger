"use client";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Activity,
  Droplets,
  TreePine,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react";
import { generateInsights, type Insight } from "@/lib/budget-insights";

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Activity,
  Droplets,
  TreePine,
  Zap,
  Shield,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
};

const categoryLabels: Record<string, string> = {
  spending: "Spending Analysis",
  revenue: "Revenue Analysis",
  trend: "Historical Trends",
  sustainability: "Sustainability",
  alert: "Key Alerts",
};

const categoryOrder = ["alert", "spending", "revenue", "trend", "sustainability"];

function InsightCard({ insight }: { insight: Insight }) {
  const Icon = iconMap[insight.icon] || Lightbulb;
  const colors = colorMap[insight.color] || colorMap.blue;

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{insight.title}</p>
          <p className={`text-xl font-bold ${colors.text} mt-0.5`}>
            {insight.value}
          </p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {insight.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const insights = generateInsights();

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: insights.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-civic-primary flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Budget Insights
              </h1>
              <p className="text-sm text-gray-500">
                AI-generated findings from Cerritos budget data
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {insights.length} insights auto-generated from FY 2025-26 Adopted
            Budget and 10-year historical data
          </p>
        </div>

        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            <strong>Methodology:</strong> Insights are computed from verified
            budget data (FY 2025-26 Adopted Budget) and 10-year historical
            trends (OpenGov Transparency Portal). Year-over-year changes compare
            FY 2024-25 to FY 2025-26. Per-capita figures use the 2020 Census
            population of 51,460. All calculations run in your browser — no data
            is sent to external servers.
          </p>
        </div>
      </div>
    </div>
  );
}
