"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  ShieldCheck,
  Gift,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import walletData from "@/data/wallet/wallet-config.json";

const pilot = walletData.pilotBudget;
const rules = walletData.earningRules;
const redemptions = walletData.redemptionOptions;
const sampleTx = walletData.sampleTransactions;
const lesson = walletData.budgetLesson;

const TABS = [
  { id: "overview", label: "Wallet Overview", icon: Wallet },
  { id: "earn", label: "How to Earn", icon: ArrowUpCircle },
  { id: "redeem", label: "Redeem", icon: Gift },
  { id: "budget", label: "Budget Lesson", icon: Lightbulb },
] as const;

type TabId = (typeof TABS)[number]["id"];

const categoryColors: Record<string, { bg: string; text: string }> = {
  water: { bg: "bg-blue-50", text: "text-blue-700" },
  energy: { bg: "bg-amber-50", text: "text-amber-700" },
  waste: { bg: "bg-green-50", text: "text-green-700" },
  parks: { bg: "bg-emerald-50", text: "text-emerald-700" },
  streets: { bg: "bg-purple-50", text: "text-purple-700" },
  general: { bg: "bg-gray-50", text: "text-gray-700" },
};

export default function GreenWalletModule() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const totalEarned = sampleTx
    .filter((t) => t.type === "earn")
    .reduce((s, t) => s + t.amount, 0);
  const totalRedeemed = sampleTx
    .filter((t) => t.type === "redeem")
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const currentBalance = sampleTx[sampleTx.length - 1].balance;
  const budgetUsedPercent = ((totalEarned + totalRedeemed) / pilot.totalAllocation) * 100;

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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-civic-primary to-civic-primary-dark rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium opacity-80">Green Wallet Balance</span>
            </div>
            <p className="text-4xl font-bold">
              $<AnimatedCounter value={currentBalance * 100} duration={1200} />{" "}
              <span className="text-lg font-normal opacity-70">$Eco</span>
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-70">Total Earned</p>
                <p className="text-lg font-bold">${totalEarned.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs opacity-70">Total Redeemed</p>
                <p className="text-lg font-bold">${totalRedeemed.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Budget Meter */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Pilot Budget Used</h3>
              <span className="text-xs text-gray-500">
                ${(totalEarned + totalRedeemed).toFixed(0)} / ${pilot.totalAllocation.toLocaleString()}
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-civic-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Monthly cap: ${pilot.monthlyBudgetCap}/mo | Per-action max: ${pilot.perActionCap.toFixed(2)}
            </p>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {sampleTx.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === "earn" ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="text-sm text-gray-700">{tx.action}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        tx.type === "earn" ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {tx.type === "earn" ? "+" : ""}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">${tx.balance.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Earn Tab */}
      {activeTab === "earn" && (
        <div className="space-y-6">
          <div className="bg-civic-primary-light rounded-xl p-4 border border-civic-primary/20">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-civic-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-civic-primary-dark">
                  Verified Actions Earn More
                </p>
                <p className="text-xs text-gray-600">
                  All rewards require verification — QR scans, teacher sign-offs, or automatic
                  module completion. This ensures credibility for City reporting.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {rules.map((rule) => {
              const colors = categoryColors[rule.category] || categoryColors.general;
              return (
                <div
                  key={rule.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{rule.action}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {rule.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Verification: {rule.verificationMethod} | Max {rule.maxPerWeek}/week
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-civic-accent">
                        +${rule.ecoReward.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">$Eco</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Redeem Tab */}
      {activeTab === "redeem" && (
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>For minors:</strong> All rewards are non-cash (experiences, in-app bonuses,
                service hour certificates). Parental/guardian consent policies apply per school
                district guidelines.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {redemptions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                  <span className="text-lg font-bold text-civic-primary">
                    ${item.cost.toFixed(0)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                <p className="text-xs text-gray-400">Partner: {item.partner}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Lesson Tab */}
      {activeTab === "budget" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>

            <div className="space-y-3">
              {lesson.keyInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <TrendingUp className="w-4 h-4 text-civic-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Budget Calculator */}
          <BudgetCapCalculator />
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] text-gray-400">
          The Green Wallet is a pilot concept for educational purposes. {pilot.currency} rewards are
          simulated and subject to partner availability. No real currency is exchanged. All
          redemptions require identity verification through school systems.
        </p>
      </div>
    </div>
  );
}

function BudgetCapCalculator() {
  const [participants, setParticipants] = useState(200);
  const [avgActionsPerStudent, setAvgActionsPerStudent] = useState(25);
  const avgReward = 3.0;

  const totalActions = participants * avgActionsPerStudent;
  const totalCost = totalActions * avgReward;
  const costPerAction = avgReward;
  const withinBudget = totalCost <= pilot.totalAllocation;
  const sponsorshipNeeded = Math.max(0, totalCost - pilot.totalAllocation);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Budget Cap Simulator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-600">Participants</label>
            <span className="text-sm font-bold text-gray-900">{participants}</span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className="w-full accent-civic-primary"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-600">Actions per Student</label>
            <span className="text-sm font-bold text-gray-900">{avgActionsPerStudent}</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={avgActionsPerStudent}
            onChange={(e) => setAvgActionsPerStudent(Number(e.target.value))}
            className="w-full accent-civic-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600 mb-1">Total Actions</p>
          <p className="text-lg font-bold text-blue-900">{totalActions.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-green-600 mb-1">Total Cost</p>
          <p className="text-lg font-bold text-green-900">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-xs text-purple-600 mb-1">Cost/Action</p>
          <p className="text-lg font-bold text-purple-900">${costPerAction.toFixed(2)}</p>
        </div>
        <div className={`rounded-lg p-3 text-center ${withinBudget ? "bg-civic-accent-light" : "bg-red-50"}`}>
          <p className={`text-xs mb-1 ${withinBudget ? "text-civic-accent" : "text-red-600"}`}>
            {withinBudget ? "Within Budget" : "Sponsorship Needed"}
          </p>
          <p className={`text-lg font-bold ${withinBudget ? "text-civic-accent-dark" : "text-red-900"}`}>
            {withinBudget ? "Yes" : `$${sponsorshipNeeded.toLocaleString()}`}
          </p>
        </div>
      </div>
    </div>
  );
}
