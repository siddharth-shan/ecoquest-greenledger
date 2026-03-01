"use client";

import { useState } from "react";
import {
  Droplets,
  Ruler,
  TreePine,
  Calendar,
  ExternalLink,
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
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { formatCurrency } from "@/lib/utils";
import waterData from "@/data/water/recycled-water-finance.json";

const program = waterData.program;
const infra = waterData.infrastructure;
const rates = waterData.waterRates;
const scenarios = waterData.scenarios;
const equiv = waterData.equivalences;

function computeSavings(
  potableRate: number,
  recycledRate: number,
  gallons: number
) {
  const annualSavings = (potableRate - recycledRate) * gallons;
  const paybackYears =
    annualSavings > 0 ? infra.estimatedCapitalCost / annualSavings : Infinity;
  const costPerGallonSaved =
    gallons > 0
      ? (infra.estimatedAnnualMaintenance + recycledRate * gallons) / gallons
      : 0;
  const cumulativeSavings = annualSavings * program.yearsOperating;
  return { annualSavings, paybackYears, costPerGallonSaved, cumulativeSavings };
}

export default function WaterFinanceModule() {
  const [potableRate, setPotableRate] = useState(rates.potablePerGallon);
  const [recycledRate, setRecycledRate] = useState(rates.recycledPerGallon);

  const calc = computeSavings(
    potableRate,
    recycledRate,
    program.annualGallonsSaved
  );

  const scenarioChartData = scenarios.map((s) => {
    const adjustedPotable = rates.potablePerGallon * s.potableRateMultiplier;
    const gallons = program.annualGallonsSaved * s.capacityMultiplier;
    const annual = (adjustedPotable - rates.recycledPerGallon) * gallons;
    const tenYear = annual * 10;
    return {
      name: s.name,
      annualSavings: Math.round(annual),
      tenYearSavings: Math.round(tenYear),
    };
  });

  const statCards = [
    {
      icon: Droplets,
      value: 722,
      suffix: "M gal/yr",
      label: "Potable Water Saved",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Ruler,
      value: 25,
      suffix: " miles",
      label: "Distribution Lines",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      icon: TreePine,
      value: 200,
      suffix: "+ acres",
      label: "Parks & Medians Irrigated",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Calendar,
      value: 37,
      suffix: " years",
      label: "Operating Since 1988",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Program Overview */}
      <section>
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
          Program Overview
        </h2>
        <p className="text-sm text-gray-600 mb-4">{program.description}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={card.value} duration={1200} />
                  <span className="text-sm font-normal text-gray-500">
                    {card.suffix}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payback Calculator */}
      <section>
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
          Payback Calculator
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-600">
                  Potable Water Rate
                </label>
                <span className="text-sm font-bold text-gray-900">
                  ${(potableRate * 1000).toFixed(2)}/1,000 gal
                </span>
              </div>
              <input
                type="range"
                min={0.003}
                max={0.015}
                step={0.0005}
                value={potableRate}
                onChange={(e) => setPotableRate(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>$3.00</span>
                <span>$15.00</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-600">
                  Recycled Water Rate
                </label>
                <span className="text-sm font-bold text-gray-900">
                  ${(recycledRate * 1000).toFixed(2)}/1,000 gal
                </span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.006}
                step={0.0005}
                value={recycledRate}
                onChange={(e) => setRecycledRate(Number(e.target.value))}
                className="w-full accent-cyan-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>$1.00</span>
                <span>$6.00</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">Annual Savings</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(calc.annualSavings)}
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 text-center">
              <p className="text-xs text-cyan-600 mb-1">Payback Period</p>
              <p className="text-xl font-bold text-cyan-900">
                {calc.paybackYears === Infinity
                  ? "N/A"
                  : `${calc.paybackYears.toFixed(1)} yrs`}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 mb-1">Cost/Gal Saved</p>
              <p className="text-xl font-bold text-green-900">
                ${calc.costPerGallonSaved.toFixed(4)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-xs text-purple-600 mb-1">
                Cumulative (37 yrs)
              </p>
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(calc.cumulativeSavings)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Comparison */}
      <section>
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
          Scenario Comparison
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarioChartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Legend />
              <Bar
                dataKey="annualSavings"
                name="Annual Savings"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="tenYearSavings"
                name="10-Year Projection"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {scenarios.map((s) => (
              <p key={s.id} className="text-xs text-gray-500">
                <strong>{s.name}:</strong> {s.description}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Equivalences */}
      <section>
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
          What Does 722 Million Gallons Look Like?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {equiv.olympicPools.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Olympic Swimming Pools</p>
            <p className="text-xs text-gray-400 mt-1">
              660,000 gal each (FINA)
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              ~{equiv.householdYears.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Household-Years of Water
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ~55,000 gal/household/year (CA DWR)
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(calc.cumulativeSavings)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Estimated Dollar Savings</p>
            <p className="text-xs text-gray-400 mt-1">Over 37 years of operation</p>
          </div>
        </div>
      </section>

      {/* Sources */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Sources</h3>
        <div className="space-y-1">
          {waterData.sources.map((source) => (
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
        <p className="text-[10px] text-gray-400 mt-2">
          {infra.capitalCostNote} {rates.rateDisclaimer}
        </p>
      </div>
    </div>
  );
}
