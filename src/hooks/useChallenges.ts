"use client";

import { useState, useCallback } from "react";
import type { Challenge, ChallengeStatus } from "@/types/challenge";

interface UseChallengesReturn {
  challenges: Challenge[];
  filteredChallenges: Challenge[];
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  challengeStatuses: Record<string, ChallengeStatus>;
  startChallenge: (id: string) => void;
  completeChallenge: (
    id: string,
    reflection?: string
  ) => Promise<void>;
  totalPoints: number;
}

export function useChallenges(
  allChallenges: Challenge[]
): UseChallengesReturn {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [challengeStatuses, setChallengeStatuses] = useState<
    Record<string, ChallengeStatus>
  >({});

  const filteredChallenges =
    activeFilter
      ? allChallenges.filter((c) => c.sustainabilityTag === activeFilter)
      : allChallenges;

  const startChallenge = useCallback((id: string) => {
    setChallengeStatuses((prev) => ({ ...prev, [id]: "in_progress" }));
  }, []);

  const completeChallenge = useCallback(
    async (id: string, reflection?: string) => {
      try {
        const res = await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId: id, reflection }),
        });

        if (res.ok) {
          setChallengeStatuses((prev) => ({ ...prev, [id]: "completed" }));
        }
      } catch (error) {
        console.error("Failed to complete challenge:", error);
      }
    },
    []
  );

  const totalPoints = allChallenges
    .filter((c) => challengeStatuses[c.id] === "completed")
    .reduce((sum, c) => sum + c.pointsReward, 0);

  return {
    challenges: allChallenges,
    filteredChallenges,
    activeFilter,
    setActiveFilter,
    challengeStatuses,
    startChallenge,
    completeChallenge,
    totalPoints,
  };
}
