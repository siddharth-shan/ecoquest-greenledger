import { Building2, CheckCircle2, ExternalLink, Printer } from "lucide-react";
import { getImpactCounters, getSurveyAggregateResults } from "@/lib/kv";
import { getEquivalence } from "@/lib/impact-equivalences";
import { computeCostPerOutcome } from "@/lib/impact-roi";
import strategicPlanData from "@/data/strategic-plan.json";
import sourcesData from "@/data/sources.json";
import expenditureData from "@/data/budget/expenditures.json";
import ReportCostMetrics from "@/components/report/ReportCostMetrics";
import ReportMethodology from "@/components/report/ReportMethodology";
import type { BudgetData } from "@/types/budget";

const budgetData = expenditureData as unknown as BudgetData;

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const [counters, surveyResults] = await Promise.all([
    getImpactCounters(),
    getSurveyAggregateResults("sustainability-priorities-2025"),
  ]);

  const challengesCompleted =
    counters.find((c) => c.id === "challenges-completed")?.value ?? 0;
  const volunteerHours =
    counters.find((c) => c.id === "park-hours")?.value ?? 0;

  const costOutcomes = computeCostPerOutcome(counters, budgetData.categories);

  const categoryLabels: Record<string, string> = {
    parks: "Parks & Greening",
    water: "Water Conservation",
    waste: "Waste & Recycling",
    energy: "Energy & Facilities",
    streets: "Streets & Transit",
  };

  return (
    <div className="report-page bg-white min-h-screen">
      {/* Print Button (hidden in print) */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => {}}
          className="btn btn-primary flex items-center gap-2"
          id="print-btn"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.getElementById('print-btn').onclick=function(){window.print()}`,
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12 print:px-0 print:py-0">
        {/* Header */}
        <header className="text-center mb-10 pb-8 border-b-2 border-civic-primary">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-civic-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-civic-primary mb-2">
            EcoQuest GreenLedger
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Civic Sustainability Dashboard for Cerritos, CA
          </p>
          <p className="text-sm text-gray-400">
            Student-built civic technology | Prepared February 2026
          </p>
        </header>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Executive Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            GreenLedger is a mobile-first civic dashboard that connects{" "}
            <strong>fiscal transparency</strong> with{" "}
            <strong>environmental sustainability</strong>. Built by Cerritos
            high school students, it transforms the city&apos;s 370-page adopted
            budget into interactive explorations, tracks real sustainability
            metrics from verified city data, and engages residents through
            gamified environmental challenges.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Unlike existing civic tech platforms that address either budget
            transparency <em>or</em> sustainability, GreenLedger uniquely
            bridges both — making it directly relevant to the{" "}
            <strong>Cerritos Strategic Plan 2025-2027</strong>, specifically
            Goals 5, 6, and 7.
          </p>
        </section>

        {/* Strategic Plan Alignment */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Strategic Plan Alignment
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Mapped to {strategicPlanData.planTitle}, adopted{" "}
            {strategicPlanData.adoptedDate}
          </p>

          <div className="space-y-4">
            {strategicPlanData.goals.map((goal) => (
              <div
                key={goal.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-white bg-civic-primary rounded px-2 py-0.5">
                    Goal {goal.number}
                  </span>
                  <span className="font-heading font-bold text-sm text-gray-900">
                    {goal.title}
                  </span>
                </div>
                <ul className="space-y-1">
                  {goal.greenledgerAlignment.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-civic-accent mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement Metrics */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Community Engagement
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-civic-primary">
                {surveyResults.totalResponses}
              </p>
              <p className="text-xs text-gray-600 mt-1">Survey Responses</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-civic-primary">
                {challengesCompleted}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Challenges Completed
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-civic-primary">
                {volunteerHours}
              </p>
              <p className="text-xs text-gray-600 mt-1">Volunteer Hours</p>
            </div>
          </div>
        </section>

        {/* Community Priorities */}
        {surveyResults.totalResponses > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
              Community Priorities
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Ranked by {surveyResults.totalResponses} resident responses (1 =
              highest priority)
            </p>
            <div className="space-y-2">
              {surveyResults.results.map((r, i) => (
                <div
                  key={r.categoryId}
                  className="flex items-center gap-3 py-2 border-b border-gray-100"
                >
                  <span className="text-sm font-bold text-civic-primary w-6 text-center">
                    #{i + 1}
                  </span>
                  <span className="text-sm text-gray-800 flex-1">
                    {categoryLabels[r.categoryId] || r.categoryId}
                  </span>
                  <span className="text-xs text-gray-500">
                    Avg rank: {r.averageRank.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Environmental Impact */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Environmental Impact
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {counters.map((counter) => {
              const equiv = getEquivalence(counter.id, counter.value);
              return (
                <div
                  key={counter.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <p className="text-xl font-bold text-gray-900">
                    {counter.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{counter.label}</p>
                  {equiv && (
                    <p className="text-xs text-civic-accent mt-1">
                      ≈ {equiv.value} {equiv.label}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Cost per Outcome Analysis */}
        <ReportCostMetrics costOutcomes={costOutcomes} />

        {/* Methodology & Limitations */}
        <ReportMethodology />

        {/* Budget Overview */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Cerritos Budget Data (FY 2025-26)
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-lg font-bold text-gray-900">$131.4M</p>
              <p className="text-xs text-gray-600">All-Funds Operating</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-lg font-bold text-gray-900">$101.5M</p>
              <p className="text-xs text-gray-600">General Fund Revenue</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-lg font-bold text-gray-900">$91.5M</p>
              <p className="text-xs text-gray-600">GF Operating Expenditures</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-lg font-bold text-gray-900">$23.0M</p>
              <p className="text-xs text-gray-600">Capital Improvements</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            All figures from the FY 2025-26 Adopted Budget. Interactive
            explorations available at greenledger.vercel.app/hub/budget.
          </p>
        </section>

        {/* Data Sources */}
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-civic-primary mb-3 border-b border-gray-200 pb-2">
            Data Sources
          </h2>
          <div className="space-y-2">
            {sourcesData.sources.map((source) => (
              <div key={source.id} className="flex items-start gap-2">
                <ExternalLink className="w-3 h-3 text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-gray-800 font-medium">
                    {source.documentName}
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    {source.documentUrl}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center border-t-2 border-civic-primary pt-6">
          <p className="text-sm font-heading font-bold text-civic-primary">
            EcoQuest GreenLedger
          </p>
          <p className="text-xs text-gray-500 mt-1">
            A student-built civic technology project for the City of Cerritos
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built with Next.js, TypeScript, and verified public data
          </p>
        </footer>
      </div>
    </div>
  );
}
