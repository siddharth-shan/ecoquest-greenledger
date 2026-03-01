import type { SustainabilityTag } from "./budget";

export type ChallengeStatus = "available" | "in_progress" | "completed";
export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ProofType = "photo" | "reflection" | "both";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  sustainabilityTag: SustainabilityTag;
  difficulty: ChallengeDifficulty;
  pointsReward: number;
  estimatedMinutes: number;
  proofType: ProofType;
  impactMetric: {
    label: string;
    unitValue: number;
  };
  relatedBudgetItemId?: string;
  steps: string[];
  tips: string[];
  cityGoalConnection: string;
  financialSnippet: string;
}

export interface ChallengeCompletion {
  challengeId: string;
  userId: string;
  completedAt: string;
  reflection?: string;
  verified: boolean;
}

export interface UserChallengeProgress {
  userId: string;
  totalPoints: number;
  completedChallengeIds: string[];
  inProgressChallengeIds: string[];
  completions: ChallengeCompletion[];
  streak: number;
  joinedAt: string;
}

export interface ImpactCounter {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: string;
  sustainabilityTag: SustainabilityTag;
}

export interface CostPerOutcome {
  counterId: string;
  counterLabel: string;
  communityTotal: number;
  unit: string;
  departmentName: string;
  budgetAllocated: number;
  costPerUnit: number;
  benchmarkCostPerUnit: number;
  benchmarkSource: string;
  efficiencyRatio: number;
  sustainabilityTag: SustainabilityTag;
}

export interface CategoryROI {
  tag: SustainabilityTag;
  label: string;
  totalBudgetAllocated: number;
  totalCommunityUnits: number;
  avgCostPerUnit: number;
  avgBenchmarkCost: number;
  roiRating: "excellent" | "good" | "fair";
}

export interface ScalingProjection {
  counterId: string;
  counterLabel: string;
  currentValue: number;
  projectedValue: number;
  multiplier: number;
  unit: string;
  dollarValue: number;
}
