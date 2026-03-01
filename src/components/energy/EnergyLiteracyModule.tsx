"use client";

import { useState } from "react";
import {
  Zap,
  Sun,
  Droplets,
  Lightbulb,
  Truck,
  TreePine,
  ExternalLink,
  Calculator,
  BarChart3,
  Clock,
  Building2,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import PowerMixChart from "./PowerMixChart";
import energyData from "@/data/energy/energy-literacy.json";

const timelineIcons: Record<string, React.ElementType> = {
  Sun,
  Droplets,
  Lightbulb,
  Zap,
  Truck,
  TreePine,
};

const TABS = [
  { id: "story", label: "Cerritos Energy Story", icon: Clock },
  { id: "ceu", label: "CEU Utility", icon: Building2 },
  { id: "mix", label: "Power Mix", icon: BarChart3 },
  { id: "whatif", label: "What If Calculator", icon: Zap },
  { id: "footprint", label: "Your Footprint", icon: Calculator },
] as const;

type TabId = (typeof TABS)[number]["id"];

const cerritos = energyData.cerritosEnergy;
const emissions = energyData.emissionsFactors;
const powerMix = energyData.californiaPowerMix;
const sb100 = energyData.sb100Targets;
const timeline = energyData.timeline;
const ceu = (energyData as Record<string, unknown>).ceuUtility as {
  name: string;
  serves: string;
  discount: string;
  switchCost: string;
  transmission: string;
  powerSources: { name: string; percent: number; type: string }[];
  daggettProduction: number;
  daggettNote: string;
};

export default function EnergyLiteracyModule() {
  const [activeTab, setActiveTab] = useState<TabId>("story");
  const [solarPercent, setSolarPercent] = useState(
    powerMix.components.find((c) => c.name === "Solar")?.percent ?? 18
  );
  const [monthlyKwh, setMonthlyKwh] = useState(500);

  // What-if: replace gas with solar
  const gasPercent =
    powerMix.components.find((c) => c.name === "Natural Gas")?.percent ?? 37.5;
  const maxSolar = gasPercent + (powerMix.components.find((c) => c.name === "Solar")?.percent ?? 18);
  const solarIncrease =
    solarPercent - (powerMix.components.find((c) => c.name === "Solar")?.percent ?? 18);
  const emissionsReduction = (solarIncrease / 100) * emissions.californiaGrid.lbsCO2ePerMwh;
  const treesEquivalent = Math.round((emissionsReduction * 1000) / 48); // 48 lbs CO2/tree/year
  const newCleanPercent = Math.min(
    sb100.currentCleanPercent + solarIncrease,
    100
  );

  // Your footprint
  const annualKwh = monthlyKwh * 12;
  const annualCO2CA = (annualKwh / 1000) * emissions.californiaGrid.lbsCO2ePerMwh;
  const annualCO2CEU = (annualKwh / 1000) * emissions.ceuGrid.lbsCO2ePerMwh;
  const annualCO2National = (annualKwh / 1000) * emissions.nationalGrid.lbsCO2ePerMwh;
  const caDelta = annualCO2National - annualCO2CA;

  return (
    <div>
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

      {/* Cerritos Energy Story */}
      {activeTab === "story" && (
        <div className="space-y-6">
          {/* Key stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={350000} duration={1500} />
              </p>
              <p className="text-xs text-gray-500 mt-1">kWh Solar/Year</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Sun className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={1408} duration={1500} />
                <span className="text-sm font-normal text-gray-500"> sq ft</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                City Hall Solar (1978)
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={60} duration={1200} />
                <span className="text-sm font-normal text-gray-500">%</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">LED Energy Savings</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">
              Cerritos Energy Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((item, i) => {
                const Icon = timelineIcons[item.icon] || Zap;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-civic-primary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-bold text-civic-primary">
                        {item.year}
                      </p>
                      <p className="text-sm text-gray-600">{item.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              City Facilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {cerritos.facilities.map((f) => (
                <p key={f} className="text-xs text-gray-600">
                  • {f}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CEU Utility tab */}
      {activeTab === "ceu" && ceu && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">{ceu.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cerritos operates its own electric utility for businesses, offering a {ceu.discount} compared to SCE. {ceu.transmission}
            </p>
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span className="px-3 py-1 bg-blue-50 rounded-full text-blue-700">Serves: {ceu.serves}</span>
              <span className="px-3 py-1 bg-green-50 rounded-full text-green-700">{ceu.discount}</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">{ceu.switchCost} to switch</span>
            </div>
          </div>

          {/* Power Sources */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">CEU Power Sources</h4>
            <div className="space-y-3">
              {ceu.powerSources.map((source) => (
                <div key={source.name} className="flex items-center gap-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{source.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          source.type === "renewable" ? "bg-green-50 text-green-700" :
                          source.type === "fossil" ? "bg-gray-100 text-gray-600" :
                          "bg-amber-50 text-amber-700"
                        }`}>{source.type}</span>
                        <span className="text-sm font-bold text-gray-900">{source.percent}%</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          source.type === "renewable" ? "bg-green-500" :
                          source.type === "fossil" ? "bg-gray-400" :
                          "bg-amber-400"
                        }`}
                        style={{ width: `${source.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{ceu.daggettNote}</p>
          </div>

          {/* Carbon Intensity Comparison */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Carbon Intensity Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-xs text-red-600 mb-1">CEU Grid</p>
                <p className="text-2xl font-bold text-red-900">{emissions.ceuGrid.lbsCO2ePerMwh}</p>
                <p className="text-xs text-red-600">lbs CO₂e/MWh</p>
                <p className="text-[10px] text-red-400 mt-1">{emissions.ceuGrid.source}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 mb-1">CA Utility Average</p>
                <p className="text-2xl font-bold text-green-900">{emissions.californiaGrid.lbsCO2ePerMwh}</p>
                <p className="text-xs text-green-600">lbs CO₂e/MWh</p>
                <p className="text-[10px] text-green-400 mt-1">{emissions.californiaGrid.source}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">National Average</p>
                <p className="text-2xl font-bold text-gray-900">{emissions.nationalGrid.lbsCO2ePerMwh}</p>
                <p className="text-xs text-gray-500">lbs CO₂e/MWh</p>
                <p className="text-[10px] text-gray-400 mt-1">{emissions.nationalGrid.source}</p>
              </div>
            </div>
            <div className="mt-4 bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Why is CEU higher than the CA average?</strong> CEU&apos;s power mix relies heavily on the Magnolia Power Plant (natural gas). As the Daggett Solar Project expands and battery storage grows, CEU&apos;s carbon intensity is expected to decrease. This is why procurement decisions matter — small changes in the power mix have measurable emissions impacts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Power Mix tab */}
      {activeTab === "mix" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <PowerMixChart
              data={powerMix.components}
              title={`California Power Mix (${powerMix.year})`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                CA Grid Emissions
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {emissions.californiaGrid.lbsCO2ePerMwh}
              </p>
              <p className="text-xs text-gray-500">lbs CO2e per MWh</p>
              <p className="text-xs text-gray-400 mt-1">
                Source: {emissions.californiaGrid.source}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                National Grid Emissions
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {emissions.nationalGrid.lbsCO2ePerMwh}
              </p>
              <p className="text-xs text-gray-500">lbs CO2e per MWh</p>
              <p className="text-xs text-gray-400 mt-1">
                Source: {emissions.nationalGrid.source}
              </p>
            </div>
          </div>

          {/* SB 100 Progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              SB 100 Progress — {sb100.description}
            </h4>
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${sb100.currentCleanPercent}%` }}
              />
              {sb100.milestones.map((m) => (
                <div
                  key={m.year}
                  className="absolute top-0 h-full w-0.5 bg-gray-400"
                  style={{ left: `${m.cleanPercent}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Current: {sb100.currentCleanPercent}% clean
              </span>
              {sb100.milestones.map((m) => (
                <span key={m.year}>{m.label}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* What If Calculator */}
      {activeTab === "whatif" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              What if California added more solar?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Slide to increase solar&apos;s share of the power mix by replacing
              natural gas generation.
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Solar Percentage</span>
                <span className="text-lg font-bold text-amber-600">
                  {solarPercent.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={powerMix.components.find((c) => c.name === "Solar")?.percent ?? 18}
                max={maxSolar}
                step={0.5}
                value={solarPercent}
                onChange={(e) => setSolarPercent(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Current ({(powerMix.components.find((c) => c.name === "Solar")?.percent ?? 18)}%)</span>
                <span>Max ({maxSolar.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">
                  Emissions Reduction
                </p>
                <p className="text-xl font-bold text-amber-900">
                  {emissionsReduction.toFixed(0)} lbs
                </p>
                <p className="text-xs text-amber-600">CO2e/MWh less</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 mb-1">
                  Equivalent Trees
                </p>
                <p className="text-xl font-bold text-green-900">
                  {treesEquivalent.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">per GWh generated</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">SB 100 Progress</p>
                <p className="text-xl font-bold text-blue-900">
                  {newCleanPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-blue-600">clean electricity</p>
              </div>
            </div>

            {/* Progress toward SB 100 */}
            <div className="mt-4">
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${newCleanPercent}%` }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-red-400"
                  style={{ left: "60%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="text-red-500">2030 target (60%)</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Footprint */}
      {activeTab === "footprint" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Calculate Your Electricity Carbon Footprint
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your typical monthly electricity usage to see your annual CO2
              emissions compared to the national average.
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-600">
                  Monthly Electricity Use
                </label>
                <span className="text-lg font-bold text-gray-900">
                  {monthlyKwh} kWh
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(Number(e.target.value))}
                className="w-full accent-civic-primary"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>100 kWh</span>
                <span>Avg ~500 kWh</span>
                <span>2,000 kWh</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 mb-1">CA Grid Average</p>
                <p className="text-xl font-bold text-green-900">
                  {Math.round(annualCO2CA).toLocaleString()} lbs
                </p>
                <p className="text-xs text-green-600">
                  {emissions.californiaGrid.lbsCO2ePerMwh} lbs/MWh
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <p className="text-xs text-amber-600 mb-1">CEU (Cerritos)</p>
                <p className="text-xl font-bold text-amber-900">
                  {Math.round(annualCO2CEU).toLocaleString()} lbs
                </p>
                <p className="text-xs text-amber-600">
                  {emissions.ceuGrid.lbsCO2ePerMwh} lbs/MWh
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">National Average</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(annualCO2National).toLocaleString()} lbs
                </p>
                <p className="text-xs text-gray-500">
                  {emissions.nationalGrid.lbsCO2ePerMwh} lbs/MWh
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">CA vs National</p>
                <p className="text-xl font-bold text-blue-900">
                  {Math.round(caDelta).toLocaleString()} lbs
                </p>
                <p className="text-xs text-blue-600">less CO₂ per year</p>
              </div>
            </div>

            <div className="mt-4 bg-civic-primary-light rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>With 100% clean electricity (SB 100 goal):</strong> Your
                annual emissions from electricity would drop to effectively{" "}
                <strong>0 lbs CO₂</strong> — saving you{" "}
                {Math.round(annualCO2CA).toLocaleString()} lbs per year
                compared to today&apos;s CA grid. CEU businesses would save{" "}
                {Math.round(annualCO2CEU).toLocaleString()} lbs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Sources</h3>
        <div className="space-y-1">
          {energyData.sources.map((source) => (
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
