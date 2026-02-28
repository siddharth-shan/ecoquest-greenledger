export type SustainabilityTag =
  | "parks"
  | "waste"
  | "water"
  | "energy"
  | "streets"
  | "general";

export interface BudgetYear {
  fiscalYear: string;
  amount: number;
}

export interface SourceCitation {
  documentName: string;
  documentUrl?: string;
  pageNumber?: string;
  accessDate: string;
  freshnessLabel: "current" | "recent" | "historical";
}

export interface BudgetLineItem {
  id: string;
  name: string;
  department: string;
  description: string;
  tldr: string;
  amounts: BudgetYear[];
  sustainabilityTags: SustainabilityTag[];
  source?: SourceCitation;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  tldr: string;
  amounts: BudgetYear[];
  sustainabilityTags: SustainabilityTag[];
  lineItems: BudgetLineItem[];
}

export interface BudgetData {
  city: string;
  state: string;
  populationEstimate: number;
  lastUpdated: string;
  source: SourceCitation;
  fiscalYears: string[];
  categories: BudgetCategory[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

export interface BudgetSummary {
  totalRevenue: number;
  totalExpenditures: number;
  surplus: number;
  populationEstimate: number;
  revenuePerCapita: number;
  expenditurePerCapita: number;
  topExpenditureCategory: string;
  sustainabilitySpendPercent: number;
  fiscalYear: string;
}
