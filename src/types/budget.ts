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
  pageReference?: string;
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

// 10-Year Historical Data Types
export interface HistoricalDepartment {
  id: string;
  name: string;
  color: string;
  amounts: number[];
}

export interface HistoricalKeyEvent {
  fiscalYear: string;
  label: string;
  description: string;
}

export interface BudgetHistoricalData {
  city: string;
  state: string;
  description: string;
  source: {
    documentName: string;
    documentUrl: string;
    accessDate: string;
    freshnessLabel: string;
    notes: string;
  };
  fiscalYears: string[];
  departments: HistoricalDepartment[];
  totals: number[];
  keyEvents: HistoricalKeyEvent[];
}

// Tax Dollar Calculator Types
export interface TaxDollarBreakdown {
  departmentId: string;
  departmentName: string;
  color: string;
  amount: number;
  percentage: number;
  perDollar: number;
  perHundred: number;
}

// Data Dictionary Types
export type ConfidenceLevel = "high" | "medium" | "low";

export interface DataField {
  fieldName: string;
  description: string;
  unit: string;
  precision: string;
  type: "direct" | "derived";
}

export interface SourceMetadata {
  sourceId: string;
  updateFrequency: string;
  methodology: string;
  dataFields: DataField[];
  limitations: string[];
  confidenceLevel: ConfidenceLevel;
  lastVerified: string;
}

// Budget Simulator Types
export interface SimulatorDepartment {
  id: string;
  name: string;
  color: string;
  baseAmount: number;
  currentAmount: number;
  percentChange: number;
  isFixed: boolean;
  fixedReason?: string;
}
