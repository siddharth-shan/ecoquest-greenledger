"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ListOrdered,
  TreePine,
  Droplets,
  Recycle,
  Zap,
  Route,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Send,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface PriorityCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  tagColor: string;
  tagBg: string;
  barColor: string;
}

const defaultCategories: PriorityCategory[] = [
  {
    id: "parks",
    label: "Parks & Greening",
    description:
      "Tree planting, park maintenance, urban greening, and open space preservation.",
    icon: TreePine,
    tagColor: "text-tag-parks",
    tagBg: "bg-tag-parks-bg",
    barColor: "#22c55e",
  },
  {
    id: "water",
    label: "Water Conservation",
    description:
      "Recycled water expansion, drought-resistant landscaping, and water infrastructure.",
    icon: Droplets,
    tagColor: "text-tag-water",
    tagBg: "bg-tag-water-bg",
    barColor: "#3b82f6",
  },
  {
    id: "waste",
    label: "Waste & Recycling",
    description:
      "Curbside recycling programs, waste diversion, composting, and CNG fleet vehicles.",
    icon: Recycle,
    tagColor: "text-tag-waste",
    tagBg: "bg-tag-waste-bg",
    barColor: "#f59e0b",
  },
  {
    id: "energy",
    label: "Energy & Facilities",
    description:
      "Solar panels, LED retrofits, building efficiency, and renewable energy adoption.",
    icon: Zap,
    tagColor: "text-tag-energy",
    tagBg: "bg-tag-energy-bg",
    barColor: "#a855f7",
  },
  {
    id: "streets",
    label: "Streets & Transit",
    description:
      "Road maintenance, bike lanes, public transit access, and EV infrastructure.",
    icon: Route,
    tagColor: "text-tag-streets",
    tagBg: "bg-tag-streets-bg",
    barColor: "#6b7280",
  },
];

// Budget allocation by sustainability tag (from expenditures.json FY 2025-26)
// Derived from department sustainability tags
const BUDGET_BY_TAG: Record<string, { amount: number; pct: number }> = {
  parks: { amount: 15805251 + 6677286 * 0.3, pct: 19.1 },
  water: { amount: 16537657 * 0.35, pct: 6.3 },
  waste: { amount: 16537657 * 0.25, pct: 4.5 },
  energy: { amount: 11407603 * 0.2 + 12302403 * 0.1, pct: 3.8 },
  streets: { amount: 16537657 * 0.4, pct: 7.2 },
};

interface AggregateResult {
  surveyId: string;
  totalResponses: number;
  results: {
    categoryId: string;
    averageRank: number;
    voteCount: number;
  }[];
}

export default function PrioritiesPage() {
  const [categories, setCategories] =
    useState<PriorityCategory[]>(defaultCategories);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<AggregateResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(
        "/api/surveys?surveyId=sustainability-priorities-2025"
      );
      if (res.ok) {
        const data = await res.json();
        setAggregate(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...categories];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCategories(updated);
  };

  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const updated = [...categories];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCategories(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const rankings: Record<string, number> = {};
      categories.forEach((cat, i) => {
        rankings[cat.id] = i + 1;
      });

      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: "sustainability-priorities-2025",
          answers: rankings,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "Unauthorized") {
          setError("Please sign in to submit your priorities.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      setSubmitted(true);
      fetchResults();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCategories(defaultCategories);
    setSubmitted(false);
    setError(null);
  };

  const categoryMap = Object.fromEntries(
    defaultCategories.map((c) => [c.id, c])
  );

  // Build chart data: "priority score" = 6 - averageRank (so higher = more preferred)
  const priorityChartData = aggregate?.results.map((r) => {
    const cat = categoryMap[r.categoryId];
    return {
      name: cat?.label ?? r.categoryId,
      priorityScore: Math.round((6 - r.averageRank) * 100) / 100,
      averageRank: r.averageRank,
      color: cat?.barColor ?? "#94a3b8",
    };
  }) ?? [];

  // Build comparison data: priority rank vs budget allocation
  const comparisonData = aggregate?.results.map((r) => {
    const cat = categoryMap[r.categoryId];
    const budget = BUDGET_BY_TAG[r.categoryId];
    // Normalize priority: rank 1 = 100%, rank 5 = 20%
    const priorityPct = Math.round(((6 - r.averageRank) / 5) * 100);
    return {
      name: cat?.label ?? r.categoryId,
      "Community Priority": priorityPct,
      "Budget Allocation": budget?.pct ?? 0,
      color: cat?.barColor ?? "#94a3b8",
    };
  }) ?? [];

  const hasResults = aggregate && aggregate.totalResponses > 0;

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-warm/10 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-civic-warm" />
          </div>
          <h1 className="section-title mb-0">Community Priorities</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Rank the sustainability categories that matter most to you. Your input
          helps show what Cerritos residents care about.
        </p>
        <div className="section-underline mt-3" />
      </div>

      {/* Toggle between survey and results */}
      {hasResults && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowResults(false)}
            className={`btn text-sm ${!showResults ? "btn-primary" : "btn-ghost"}`}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Rankings
          </button>
          <button
            onClick={() => setShowResults(true)}
            className={`btn text-sm ${showResults ? "btn-primary" : "btn-ghost"}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Results
          </button>
        </div>
      )}

      {/* Survey Form */}
      {!showResults && !submitted && (
        <div className="max-w-xl mx-auto">
          <div className="bg-civic-primary-light rounded-xl p-4 mb-6">
            <p className="text-sm text-civic-primary-dark">
              Arrange the categories below from <strong>most important</strong>{" "}
              (#1) to <strong>least important</strong> (#5) using the arrow
              buttons. Then submit your ranking.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                >
                  <div className="text-lg font-bold text-gray-300 w-6 text-center tabular-nums">
                    {index + 1}
                  </div>

                  <div
                    className={`w-10 h-10 rounded-lg ${cat.tagBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${cat.tagColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label={`Move ${cat.label} up`}
                    >
                      <ArrowUp className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === categories.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label={`Move ${cat.label} down`}
                    >
                      <ArrowDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit My Priorities"}
          </button>
        </div>
      )}

      {/* Submitted Confirmation */}
      {!showResults && submitted && (
        <div className="max-w-xl mx-auto">
          <div className="bg-civic-accent-light rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-civic-accent mx-auto mb-3" />
            <h2 className="font-heading font-bold text-xl text-civic-accent-dark mb-2">
              Thanks for your input!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your sustainability priorities have been recorded. Every voice
              helps shape how Cerritos allocates resources.
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Your Rankings
              </h3>
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm font-bold text-gray-400 w-5 text-center">
                      {i + 1}
                    </span>
                    <Icon className={`w-4 h-4 ${cat.tagColor}`} />
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="btn btn-outline text-sm"
              >
                Submit Another Ranking
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="btn btn-primary text-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Community Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Results */}
      {showResults && hasResults && (
        <div className="space-y-8">
          {/* Response count banner */}
          <div className="bg-gradient-to-r from-civic-primary to-civic-accent rounded-xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-white/80" />
                <div>
                  <p className="text-3xl font-bold">{aggregate!.totalResponses}</p>
                  <p className="text-white/80 text-sm">Responses Collected</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">
                  Help us reach <strong className="text-white">100 responses</strong>
                </p>
                <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
                  <div
                    className="h-full bg-civic-highlight rounded-full transition-all"
                    style={{
                      width: `${Math.min((aggregate!.totalResponses / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Priority Rankings Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-civic-primary" />
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Community Priority Rankings
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Higher score = higher community priority (5 = top, 1 = lowest)
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityChartData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 120 }}
                >
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 13 }}
                    width={115}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => [
                      value != null ? value.toFixed(2) : "0",
                      "Priority Score",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="priorityScore" radius={[0, 6, 6, 0]} barSize={28}>
                    {priorityChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priorities vs Spending */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-civic-accent" />
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Priorities vs. Budget Allocation
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are residents&apos; priorities aligned with how the city spends?
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 0, right: 20, bottom: 0, left: 120 }}
                  layout="vertical"
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 13 }}
                    width={115}
                  />
                  <Tooltip
                    formatter={(value: number | undefined, name?: string) => [
                      `${value != null ? value.toFixed(1) : "0"}%`,
                      name ?? "",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Community Priority"
                    fill="#1a365d"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="Budget Allocation"
                    fill="#2b7a78"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Budget allocation % reflects estimated sustainability-related
              spending from the FY 2025-26 Adopted Budget. Community priority
              is normalized from average rankings.
            </p>
          </div>
        </div>
      )}

      {/* Show results prompt if no results yet */}
      {showResults && !hasResults && (
        <div className="max-w-xl mx-auto text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-gray-600 mb-2">
            No results yet
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Be the first to submit your sustainability priorities!
          </p>
          <button
            onClick={() => setShowResults(false)}
            className="btn btn-primary text-sm"
          >
            Submit Your Rankings
          </button>
        </div>
      )}
    </div>
  );
}
