import type { SustainabilityTag, SourceCitation } from "./budget";

export type ScorecardType = "program" | "department" | "issue";
export type TrendDirection = "up" | "down" | "flat";

export interface ScorecardMetric {
  label: string;
  value: number;
  unit: string;
  target?: number;
  trend: TrendDirection;
  yearOverYearChange?: number;
}

export interface Scorecard {
  id: string;
  title: string;
  type: ScorecardType;
  sustainabilityTag: SustainabilityTag;
  description: string;
  tldr: string;
  icon: string;
  metrics: ScorecardMetric[];
  highlights: string[];
  challenges: string[];
  source: SourceCitation;
}
