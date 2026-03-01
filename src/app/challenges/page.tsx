"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import SustainabilityFilter from "@/components/budget/SustainabilityFilter";
import challengeData from "@/data/challenges/challenges.json";
import type { Challenge, ChallengeStatus } from "@/types/challenge";
import type { SustainabilityTag } from "@/types/budget";

const challenges = challengeData.challenges as unknown as Challenge[];

export default function ChallengesPage() {
  const [activeFilters, setActiveFilters] = useState<SustainabilityTag[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((data) => {
        if (data.progress?.completedChallengeIds) {
          setCompletedIds(data.progress.completedChallengeIds);
        }
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeFilters.length === 0
      ? challenges
      : challenges.filter((c) => activeFilters.includes(c.sustainabilityTag));

  const getStatus = (id: string): ChallengeStatus => {
    if (completedIds.includes(id)) return "completed";
    return "available";
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-civic-highlight/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-civic-highlight" />
          </div>
          <div>
            <h1 className="section-title mb-0">Challenges</h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Take real-world sustainability actions tied to Cerritos city goals.
          Earn points, track impact, and level up.
        </p>
        <div className="section-underline mt-3" />
      </div>

      <div className="mb-6">
        <SustainabilityFilter
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            status={getStatus(challenge.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No challenges match your filter. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}
