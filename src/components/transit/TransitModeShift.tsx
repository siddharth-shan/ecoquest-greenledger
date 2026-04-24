"use client";

import { useState } from "react";
import {
  Bus,
  Bike,
  Car,
  Leaf,
  MapPin,
  Calculator,
  Trophy,
  ExternalLink,
  Clock,
  DollarSign,
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
import transitData from "@/data/transit/cow-routes.json";

const program = transitData.program;
const routes = transitData.routes;
const modeShift = transitData.modeShiftData;
const challenges = transitData.challenges;
const scenarios = transitData.impactCalculator.scenarioPresets;

const TABS = [
  { id: "routes", label: "COW Routes", icon: Bus },
  { id: "calculator", label: "Impact Calculator", icon: Calculator },
  { id: "challenges", label: "Mode-Shift Challenges", icon: Trophy },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TransitModeShift() {
  const [activeTab, setActiveTab] = useState<TabId>("routes");
  const [tripsPerWeek, setTripsPerWeek] = useState(10);
  const [avgMiles, setAvgMiles] = useState(3.5);
  const [weeks, setWeeks] = useState(36);
  const [shiftMode, setShiftMode] = useState<"transit" | "walk-bike">("transit");

  // Calculations
  const totalTrips = tripsPerWeek * weeks;
  const totalMiles = totalTrips * avgMiles;
  const carEmissions = totalMiles * modeShift.averageCarEmissionsPerMile;
  const transitEmissions = shiftMode === "transit" ? totalTrips * modeShift.transitEmissionsPerTrip : 0;
  const emissionsSaved = carEmissions - transitEmissions;
  const gasSaved = totalMiles / modeShift.fuelEconomyMpg;
  const moneySaved = gasSaved * modeShift.averageGasPrice;
  const costPerMile = modeShift.annualCarCostPerMile;
  const totalCarCostSaved = totalMiles * costPerMile;

  const comparisonData = [
    { mode: "Drive Alone", co2: Math.round(carEmissions), cost: Math.round(totalMiles * costPerMile), color: "#ef4444" },
    { mode: shiftMode === "transit" ? "COW Transit" : "Walk/Bike", co2: Math.round(transitEmissions), cost: shiftMode === "transit" ? Math.round(totalTrips * 1.0) : 0, color: "#22c55e" },
  ];

  return (
    <div>
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedCounter value={program.locations} duration={1200} />+
          </p>
          <p className="text-xs text-gray-500">Stops Served</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{program.headwayMinutes} min</p>
          <p className="text-xs text-gray-500">Headway</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-3">
            <Bus className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
          <p className="text-xs text-gray-500">Routes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{program.meanCommuteMinutes} min</p>
          <p className="text-xs text-gray-500">Avg Commute</p>
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

      {/* Routes Tab */}
      {activeTab === "routes" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">About Cerritos on Wheels (COW)</h3>
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                {program.operatingDays}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                {program.operatingHours}
              </span>
              <span className="px-3 py-1 bg-green-50 rounded-full text-green-700">
                GTFS Data Available
              </span>
              <span className="px-3 py-1 bg-blue-50 rounded-full text-blue-700">
                Funded by {program.funding}
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: route.color + "20" }}
                  >
                    <Bus className="w-5 h-5" style={{ color: route.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{route.name}</h4>
                    <p className="text-xs text-gray-500">{route.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {route.keyStops.map((stop) => (
                    <span
                      key={stop}
                      className="text-xs px-2.5 py-1 rounded-full border"
                      style={{ borderColor: route.color + "40", color: route.color, backgroundColor: route.color + "10" }}
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="space-y-6">
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  setTripsPerWeek(s.tripsPerWeek);
                  setAvgMiles(s.avgMilesPerTrip);
                  setWeeks(s.weeksPerYear);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-civic-primary hover:bg-civic-primary-light transition-colors text-gray-600"
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Mode Shift Calculator</h3>

            {/* Mode selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShiftMode("transit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                  shiftMode === "transit"
                    ? "bg-civic-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Bus className="w-4 h-4" /> COW Transit
              </button>
              <button
                onClick={() => setShiftMode("walk-bike")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                  shiftMode === "walk-bike"
                    ? "bg-civic-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Bike className="w-4 h-4" /> Walk/Bike
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Trips/Week</label>
                  <span className="text-sm font-bold text-gray-900">{tripsPerWeek}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={tripsPerWeek}
                  onChange={(e) => setTripsPerWeek(Number(e.target.value))}
                  className="w-full accent-civic-primary"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Avg Miles/Trip</label>
                  <span className="text-sm font-bold text-gray-900">{avgMiles}</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={avgMiles}
                  onChange={(e) => setAvgMiles(Number(e.target.value))}
                  className="w-full accent-civic-primary"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Weeks/Year</label>
                  <span className="text-sm font-bold text-gray-900">{weeks}</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={52}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-full accent-civic-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Leaf className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-600 mb-1">CO₂ Saved</p>
                <p className="text-xl font-bold text-green-900">
                  {Math.round(emissionsSaved).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">lbs/year</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Car className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600 mb-1">VMT Avoided</p>
                <p className="text-xl font-bold text-blue-900">
                  {Math.round(totalMiles).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">miles/year</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <DollarSign className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-amber-600 mb-1">Gas Saved</p>
                <p className="text-xl font-bold text-amber-900">
                  ${Math.round(moneySaved).toLocaleString()}
                </p>
                <p className="text-xs text-amber-600">/year</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <DollarSign className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-600 mb-1">Total Cost Saved</p>
                <p className="text-xl font-bold text-purple-900">
                  ${Math.round(totalCarCostSaved).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600">/year (AAA avg)</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Emissions Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="mode" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="co2" name="CO₂ (lbs)" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-900">{challenge.name}</h4>
                <span className="text-sm font-bold text-civic-accent">{challenge.points} pts</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{challenge.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-700">
                  ~{challenge.estimatedCO2Saved} lbs CO₂ saved
                </span>
                <span className="text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-700">
                  +${challenge.ecoReward.toFixed(2)} $Eco
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-50 rounded-full text-gray-600">
                  {challenge.verificationMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sources */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Sources</h3>
        <div className="space-y-1">
          {transitData.sources.map((source) => (
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
