"use client";

import { useState } from "react";
import {
  Landmark,
  TrendingUp,
  Calculator,
  Info,
  ExternalLink,
  ChevronRight,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import bondData from "@/data/bonds/green-bonds.json";

const projects = bondData.projects;
const ratingScale = bondData.ratingScale;
const learningObjectives = bondData.learningObjectives;

const TABS = [
  { id: "explore", label: "Explore Bonds", icon: Landmark },
  { id: "portfolio", label: "Build Portfolio", icon: TrendingUp },
  { id: "compare", label: "Compare", icon: Calculator },
  { id: "learn", label: "Learn", icon: Award },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function GreenBondSimulator() {
  const [activeTab, setActiveTab] = useState<TabId>("explore");
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});

  const totalInvested = Object.values(portfolio).reduce((s, v) => s + v, 0);
  const portfolioBudget = 10000;

  const addToPortfolio = (projectId: string, amount: number) => {
    const current = portfolio[projectId] || 0;
    const newTotal = totalInvested - current + amount;
    if (newTotal <= portfolioBudget) {
      setPortfolio({ ...portfolio, [projectId]: amount });
    }
  };

  // Calculate bond returns
  const calcReturns = (project: typeof projects[0], amount: number) => {
    const annualCoupon = amount * (project.couponRate / 100);
    const totalCoupons = annualCoupon * project.bondTermYears;
    const totalReturn = amount + totalCoupons;
    const paybackYears = project.projectCost / project.annualBenefit;
    return { annualCoupon, totalCoupons, totalReturn, paybackYears };
  };

  const comparisonData = projects.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    couponRate: p.couponRate,
    paybackYears: Math.round((p.projectCost / p.annualBenefit) * 10) / 10,
    annualBenefit: p.annualBenefit / 1000,
  }));

  return (
    <div>
      {/* Disclaimer */}
      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Educational simulation only.</strong> {bondData.disclaimer}
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto mb-6 -mx-4 px-4 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === tab.id
                  ? "bg-civic-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Explore Tab */}
      {activeTab === "explore" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {projects.map((project) => {
              const ratingColor = ratingScale.find((r) => r.rating === project.riskRating)?.color || "#6b7280";

              return (
                <div
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setActiveTab("portfolio"); }}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: ratingColor }}
                        >
                          {project.riskRating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{project.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-civic-primary transition-colors" />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Project Cost</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(project.projectCost)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Coupon Rate</p>
                      <p className="text-sm font-bold text-civic-accent">{project.couponRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Term</p>
                      <p className="text-sm font-bold text-gray-900">{project.bondTermYears} yrs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Annual Impact</p>
                      <p className="text-sm font-bold text-green-600">
                        {project.impactPerYear >= 1000000
                          ? `${(project.impactPerYear / 1000000).toFixed(0)}M`
                          : project.impactPerYear.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {project.riskFactors.map((factor, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-50 rounded-full text-gray-500">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Budget indicator */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Portfolio Budget</h3>
              <span className="text-xs text-gray-500">
                ${totalInvested.toLocaleString()} / ${portfolioBudget.toLocaleString()} simulated
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-civic-primary rounded-full transition-all duration-300"
                style={{ width: `${(totalInvested / portfolioBudget) * 100}%` }}
              />
            </div>
          </div>

          {/* Selected Bond Detail */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-1">{selectedProject.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedProject.description}</p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-600">Investment Amount</label>
                <span className="text-sm font-bold text-gray-900">
                  ${investmentAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full accent-civic-primary"
              />
            </div>

            {(() => {
              const r = calcReturns(selectedProject, investmentAmount);
              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 mb-1">Annual Coupon</p>
                    <p className="text-lg font-bold text-blue-900">${r.annualCoupon.toFixed(0)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600 mb-1">Total Coupons</p>
                    <p className="text-lg font-bold text-green-900">${r.totalCoupons.toFixed(0)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600 mb-1">Total Return</p>
                    <p className="text-lg font-bold text-purple-900">${r.totalReturn.toFixed(0)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600 mb-1">Project Payback</p>
                    <p className="text-lg font-bold text-amber-900">{r.paybackYears.toFixed(1)} yrs</p>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => addToPortfolio(selectedProject.id, investmentAmount)}
              className="btn btn-primary w-full"
            >
              Add to Portfolio
            </button>
          </div>

          {/* Portfolio Summary */}
          {Object.keys(portfolio).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Portfolio</h3>
              <div className="space-y-2">
                {Object.entries(portfolio).map(([id, amount]) => {
                  const proj = projects.find((p) => p.id === id);
                  if (!proj) return null;
                  return (
                    <div key={id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-700">{proj.name}</p>
                        <p className="text-xs text-gray-400">{proj.couponRate}% / {proj.bondTermYears} yrs</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${amount.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Weighted Avg Coupon</p>
                <p className="text-sm font-bold text-civic-accent">
                  {(
                    Object.entries(portfolio).reduce((sum, [id, amount]) => {
                      const proj = projects.find((p) => p.id === id);
                      return sum + (proj ? proj.couponRate * amount : 0);
                    }, 0) / totalInvested || 0
                  ).toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === "compare" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Coupon Rate vs Payback Period</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="couponRate" name="Coupon Rate (%)" fill="#1a365d" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="paybackYears" name="Payback (yrs)" fill="#2b7a78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Scale */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bond Rating Scale</h3>
            <div className="space-y-1">
              {ratingScale.map((rating) => (
                <div key={rating.rating} className="flex items-center gap-3 py-1.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white w-12 text-center"
                    style={{ backgroundColor: rating.color }}
                  >
                    {rating.rating}
                  </span>
                  <p className="text-sm text-gray-600">{rating.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learn Tab */}
      {activeTab === "learn" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What is a Municipal Green Bond?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                A <strong>municipal bond</strong> is a debt instrument issued by a city, county, or
                state to fund public projects. When you buy a bond, you lend money to the
                government and receive regular interest payments (called <strong>coupons</strong>)
                plus your principal back at <strong>maturity</strong>.
              </p>
              <p>
                A <strong>green bond</strong> is specifically designated to fund projects with
                environmental benefits — renewable energy, water conservation, waste reduction, and
                transit improvements.
              </p>
              <p>
                In this simulator, you are investing in projects based on real Cerritos
                infrastructure needs, using the City&apos;s actual budget data to frame project costs
                and department responsibilities.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
            <div className="space-y-2">
              {learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-civic-primary-light text-civic-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Key Terms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { term: "Coupon Rate", def: "Annual interest rate paid to bondholders" },
                { term: "Maturity", def: "Date when the principal is returned" },
                { term: "Risk Rating", def: "Assessment of the borrower's ability to repay" },
                { term: "Payback Period", def: "Time for project benefits to cover its cost" },
                { term: "Principal", def: "The original amount invested in the bond" },
                { term: "Yield", def: "Total return on investment over the bond's life" },
              ].map((item) => (
                <div key={item.term} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-civic-primary">{item.term}</p>
                  <p className="text-xs text-gray-600">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Sources</h3>
        <div className="space-y-1">
          {bondData.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-civic-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {source.name} (accessed {source.accessDate})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
