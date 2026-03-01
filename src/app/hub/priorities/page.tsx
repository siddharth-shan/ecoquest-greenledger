"use client";

import { useState } from "react";
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
} from "lucide-react";

interface PriorityCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  tagColor: string;
  tagBg: string;
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
  },
  {
    id: "water",
    label: "Water Conservation",
    description:
      "Recycled water expansion, drought-resistant landscaping, and water infrastructure.",
    icon: Droplets,
    tagColor: "text-tag-water",
    tagBg: "bg-tag-water-bg",
  },
  {
    id: "waste",
    label: "Waste & Recycling",
    description:
      "Curbside recycling programs, waste diversion, composting, and CNG fleet vehicles.",
    icon: Recycle,
    tagColor: "text-tag-waste",
    tagBg: "bg-tag-waste-bg",
  },
  {
    id: "energy",
    label: "Energy & Facilities",
    description:
      "Solar panels, LED retrofits, building efficiency, and renewable energy adoption.",
    icon: Zap,
    tagColor: "text-tag-energy",
    tagBg: "bg-tag-energy-bg",
  },
  {
    id: "streets",
    label: "Streets & Transit",
    description:
      "Road maintenance, bike lanes, public transit access, and EV infrastructure.",
    icon: Route,
    tagColor: "text-tag-streets",
    tagBg: "bg-tag-streets-bg",
  },
];

export default function PrioritiesPage() {
  const [categories, setCategories] =
    useState<PriorityCategory[]>(defaultCategories);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      {!submitted ? (
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
      ) : (
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

            <button
              onClick={handleReset}
              className="btn btn-outline text-sm"
            >
              Submit Another Ranking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
