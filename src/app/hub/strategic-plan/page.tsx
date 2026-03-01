"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Monitor,
  PiggyBank,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import strategicPlanData from "@/data/strategic-plan.json";

const goalIcons: Record<string, React.ElementType> = {
  "goal-5": Monitor,
  "goal-6": PiggyBank,
  "goal-7": MessageSquare,
};

const goalColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  "goal-5": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  "goal-6": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  "goal-7": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
};

const featureLinks: Record<string, string> = {
  "Budget Explorer": "/hub/budget",
  "Tax Dollar Calculator": "/hub/tax-dollar",
  "Budget Simulator": "/hub/simulator",
  "Scorecards": "/hub/scorecards",
  "Historical Trends": "/hub/budget",
  "Community Priorities": "/hub/priorities",
  "Civic Actions": "/hub/civic",
  "Budget Q&A": "/hub/ask",
};

export default function StrategicPlanPage() {
  const [expandedGoal, setExpandedGoal] = useState<string | null>("goal-6");

  return (
    <div className="container-custom py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-primary-light flex items-center justify-center">
            <Building2 className="w-5 h-5 text-civic-primary" />
          </div>
          <div>
            <h1 className="section-title mb-0">Strategic Plan Alignment</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          How GreenLedger supports the{" "}
          <strong>City of Cerritos Strategic Plan 2025-2027</strong>, adopted{" "}
          {strategicPlanData.adoptedDate}.
        </p>
        <div className="section-underline mt-3" />
      </div>

      {/* Goal Cards */}
      <div className="space-y-4 mb-8">
        {strategicPlanData.goals.map((goal) => {
          const Icon = goalIcons[goal.id] || Building2;
          const colors = goalColors[goal.id];
          const isExpanded = expandedGoal === goal.id;

          return (
            <div
              key={goal.id}
              className={`rounded-xl border ${colors.border} overflow-hidden transition-all`}
            >
              <button
                onClick={() =>
                  setExpandedGoal(isExpanded ? null : goal.id)
                }
                className={`w-full flex items-center gap-4 p-5 text-left cursor-pointer ${colors.bg} hover:brightness-95 transition-all`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}
                    >
                      Goal {goal.number}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {goal.description}
                  </p>
                </div>
                <ArrowRight
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="p-5 bg-white border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    How GreenLedger Addresses This Goal
                  </h4>
                  <ul className="space-y-2 mb-5">
                    {goal.greenledgerAlignment.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-civic-accent mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Related Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {goal.features.map((feature) => (
                      <Link
                        key={feature}
                        href={featureLinks[feature] || "/hub"}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${colors.badge} hover:brightness-90 transition-all`}
                      >
                        {feature}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Source Citation */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {strategicPlanData.planTitle}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Adopted {strategicPlanData.adoptedDate} by the Cerritos City
              Council
            </p>
            <a
              href={strategicPlanData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-civic-primary hover:text-civic-primary-dark mt-2"
            >
              View Full Strategic Plan
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
