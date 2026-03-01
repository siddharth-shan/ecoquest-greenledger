"use client";

import { useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import type { ImpactCounter } from "@/types/challenge";
import { computeScalingProjection } from "@/lib/impact-roi";
import { formatCurrency } from "@/lib/utils";

interface ScalingCalculatorProps {
  counters: ImpactCounter[];
}

export default function ScalingCalculator({ counters }: ScalingCalculatorProps) {
  const [participants, setParticipants] = useState(200);
  const projections = computeScalingProjection(counters, participants);
  const totalDollarValue = projections.reduce((s, p) => s + p.dollarValue, 0);

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-civic-primary" />
          <h3 className="font-semibold text-gray-900">
            What if more residents participated?
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Slide to see projected community impact at different participation levels.
          Current baseline: ~50 active participants.
        </p>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Target Participants</span>
            <span className="text-lg font-bold text-civic-primary">
              {participants.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className="w-full accent-civic-primary"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>50</span>
            <span>1,000</span>
            <span>2,500</span>
            <span>5,000</span>
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-civic rounded-xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5" />
          <h4 className="font-semibold">Projected Total Economic Value</h4>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(totalDollarValue)}</p>
        <p className="text-sm opacity-80 mt-1">
          at {participants.toLocaleString()} participants ({(participants / 50).toFixed(0)}x current)
        </p>
      </div>

      {/* Projected metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projections.map((proj) => (
          <div
            key={proj.counterId}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <p className="text-sm font-medium text-gray-600 mb-2">
              {proj.counterLabel}
            </p>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs text-gray-400">Current</p>
                <p className="text-lg font-bold text-gray-400">
                  {proj.currentValue.toLocaleString()}
                </p>
              </div>
              <div className="text-civic-primary">→</div>
              <div>
                <p className="text-xs text-civic-accent">Projected</p>
                <p className="text-lg font-bold text-civic-primary">
                  {proj.projectedValue.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ≈ {formatCurrency(proj.dollarValue)} economic value
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
