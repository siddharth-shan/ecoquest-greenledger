"use client";

import { useState } from "react";
import {
  TreePine,
  DollarSign,
  Wind,
  Zap,
  Home,
  Thermometer,
  CloudRain,
  Calculator,
  Award,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { formatCurrency } from "@/lib/utils";
import forestData from "@/data/forest/urban-forest.json";

const program = forestData.program;
const valuation = forestData.assetValuation;
const benefits = forestData.benefits;
const species = forestData.speciesData;
const plannerScenarios = forestData.plannerScenarios;

const TABS = [
  { id: "overview", label: "Forest Overview", icon: TreePine },
  { id: "benefits", label: "Financial Benefits", icon: DollarSign },
  { id: "planner", label: "Planting Planner", icon: Calculator },
  { id: "species", label: "Species Guide", icon: Award },
] as const;

type TabId = (typeof TABS)[number]["id"];

const benefitIcons: Record<string, React.ElementType> = {
  Wind,
  CloudRain,
  Zap,
  Home,
  Thermometer,
};

const benefitColors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function UrbanForestModule() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [planYears, setPlanYears] = useState(10);
  const [selectedScenario, setSelectedScenario] = useState(plannerScenarios[0]);
  const [treesPerYear, setTreesPerYear] = useState(selectedScenario.treesPerYear);

  // Planner calculations
  const totalNewTrees = treesPerYear * planYears;
  const plantingCost = totalNewTrees * valuation.plantingCostPerTree;
  const maintenanceCost = totalNewTrees * valuation.annualMaintenanceCostPerTree * planYears;
  const totalCost = plantingCost + maintenanceCost;
  const annualBenefitPerTree = benefits.reduce((sum, b) => sum + b.annualValuePerTree, 0);
  const totalNewBenefits = totalNewTrees * annualBenefitPerTree * (planYears / 2); // avg over growth period
  const roi = totalNewBenefits > 0 ? ((totalNewBenefits - totalCost) / totalCost) * 100 : 0;

  const benefitChartData = benefits.map((b) => ({
    name: b.name.split(" ").slice(0, 2).join(" "),
    annual: Math.round(b.totalAnnualValue / 1000),
  }));

  return (
    <div>
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-3">
            <TreePine className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedCounter value={30000} duration={1500} />+
          </p>
          <p className="text-xs text-gray-500">City Trees</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <TreePine className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedCounter value={250} duration={1200} />
          </p>
          <p className="text-xs text-gray-500">Planted/Year</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedCounter value={26} duration={1000} />
          </p>
          <p className="text-xs text-gray-500">Tree City USA Years</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            $<AnimatedCounter value={105} duration={1200} />M
          </p>
          <p className="text-xs text-gray-500">Est. Forest Value</p>
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Cerritos Urban Forest</h3>
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
            <div className="bg-civic-primary-light rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Municipal Asset Perspective:</strong> At an average replacement value of $
                {valuation.averageTreeValue.toLocaleString()} per tree, the City&apos;s 30,000+ trees
                represent approximately <strong>{formatCurrency(valuation.totalForestValue)}</strong>{" "}
                in infrastructure value — managed by the Public Works department (
                {formatCurrency(program.departmentBudget)} FY 2025-26 budget).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Asset Valuation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Avg Tree Value</p>
                <p className="text-lg font-bold text-gray-900">${valuation.averageTreeValue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Annual Maintenance/Tree</p>
                <p className="text-lg font-bold text-gray-900">${valuation.annualMaintenanceCostPerTree}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Planting Cost/Tree</p>
                <p className="text-lg font-bold text-gray-900">${valuation.plantingCostPerTree}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Replacement Cost/Tree</p>
                <p className="text-lg font-bold text-gray-900">${valuation.replacementCostPerTree}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Annual Appreciation</p>
                <p className="text-lg font-bold text-gray-900">{valuation.annualAppreciation}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Annual Benefit/Tree</p>
                <p className="text-lg font-bold text-green-700">${annualBenefitPerTree.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">{valuation.valuationNote}</p>
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === "benefits" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Annual Benefits by Category ($K)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={benefitChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}K`} />
                <Tooltip formatter={(value) => `$${Number(value)}K/year`} />
                <Bar dataKey="annual" name="Annual Value ($K)" radius={[4, 4, 0, 0]}>
                  {benefitChartData.map((_, i) => (
                    <Cell key={i} fill={benefitColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4">
            {benefits.map((benefit, i) => {
              const Icon = benefitIcons[benefit.icon] || TreePine;
              return (
                <div
                  key={benefit.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: benefitColors[i] + "15" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: benefitColors[i] }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{benefit.name}</h4>
                        <p className="text-sm font-bold" style={{ color: benefitColors[i] }}>
                          {formatCurrency(benefit.totalAnnualValue)}/yr
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{benefit.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-50 rounded-full text-gray-600">
                          ${benefit.annualValuePerTree.toFixed(2)}/tree/yr
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-50 rounded-full text-gray-600">
                          {benefit.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-civic-primary-light rounded-xl p-4 border border-civic-primary/20">
            <p className="text-sm text-gray-700">
              <strong>Total annual benefits from Cerritos&apos;s urban forest:</strong>{" "}
              <span className="text-civic-primary font-bold">
                {formatCurrency(benefits.reduce((s, b) => s + b.totalAnnualValue, 0))}
              </span>{" "}
              — that&apos;s ${annualBenefitPerTree.toFixed(2)} per tree per year in quantifiable value.
            </p>
          </div>
        </div>
      )}

      {/* Planner Tab */}
      {activeTab === "planner" && (
        <div className="space-y-6">
          {/* Scenario presets */}
          <div className="flex flex-wrap gap-2">
            {plannerScenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedScenario(s);
                  setTreesPerYear(s.treesPerYear);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedScenario.id === s.id
                    ? "border-civic-primary bg-civic-primary-light text-civic-primary"
                    : "border-gray-200 hover:border-civic-primary text-gray-600"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Capital Planning Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Trees Per Year</label>
                  <span className="text-sm font-bold text-gray-900">{treesPerYear}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1000}
                  step={25}
                  value={treesPerYear}
                  onChange={(e) => setTreesPerYear(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>100</span>
                  <span>Current: 250</span>
                  <span>1,000</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Plan Horizon</label>
                  <span className="text-sm font-bold text-gray-900">{planYears} years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={planYears}
                  onChange={(e) => setPlanYears(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600 mb-1">New Trees</p>
                <p className="text-xl font-bold text-green-900">{totalNewTrees.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 mb-1">Total Investment</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(totalCost)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-600 mb-1">Est. Benefits</p>
                <p className="text-xl font-bold text-amber-900">{formatCurrency(totalNewBenefits)}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${roi > 0 ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-xs mb-1 ${roi > 0 ? "text-green-600" : "text-red-600"}`}>ROI</p>
                <p className={`text-xl font-bold ${roi > 0 ? "text-green-900" : "text-red-900"}`}>
                  {roi.toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Planting Cost</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(plantingCost)}</p>
                <p className="text-[10px] text-gray-400">
                  {totalNewTrees.toLocaleString()} trees x ${valuation.plantingCostPerTree}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Maintenance Cost</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(maintenanceCost)}</p>
                <p className="text-[10px] text-gray-400">
                  ${valuation.annualMaintenanceCostPerTree}/tree/yr x {planYears} yrs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">{selectedScenario.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{selectedScenario.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-700">
                {selectedScenario.treesPerYear} trees/yr
              </span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-700">
                {formatCurrency(selectedScenario.annualBudget)}/yr budget
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Species Tab */}
      {activeTab === "species" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Common tree species in Cerritos, with maintenance and environmental performance data for
            capital planning.
          </p>
          {species.map((tree) => (
            <div
              key={tree.name}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{tree.name}</h4>
                  <span className="text-xs text-gray-500">{tree.category}</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-700">
                  {tree.co2Annually} lbs CO₂/yr
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="text-center bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500">Lifespan</p>
                  <p className="text-sm font-bold text-gray-900">{tree.lifespan} yrs</p>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500">Canopy</p>
                  <p className="text-sm font-bold text-gray-900">{tree.canopySpread} ft</p>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500">Maintenance</p>
                  <p className="text-sm font-bold text-gray-900">{tree.maintenanceCost}</p>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500">Planting Cost</p>
                  <p className="text-sm font-bold text-gray-900">${tree.plantingCost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sources */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Sources</h3>
        <div className="space-y-1">
          {forestData.sources.map((source) => (
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
