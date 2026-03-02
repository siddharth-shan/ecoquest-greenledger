import expenditureData from "@/data/budget/expenditures.json";
import revenueData from "@/data/budget/revenue.json";
import historicalData from "@/data/budget/historical.json";
import scorecardsData from "@/data/scorecards/scorecards.json";

const POPULATION = 51460;

export interface Insight {
  id: string;
  category: "spending" | "revenue" | "trend" | "sustainability" | "alert";
  title: string;
  value: string;
  detail: string;
  icon: string;
  color: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function latestAmount(amounts: { fiscalYear: string; amount: number }[]): number {
  return amounts.find((a) => a.fiscalYear === "2025-26")?.amount ?? amounts[amounts.length - 1]?.amount ?? 0;
}

function prevAmount(amounts: { fiscalYear: string; amount: number }[]): number {
  return amounts.find((a) => a.fiscalYear === "2024-25")?.amount ?? 0;
}

export function generateInsights(): Insight[] {
  const insights: Insight[] = [];

  // --- SPENDING INSIGHTS ---
  const depts = expenditureData.categories;
  const totalGF = depts.reduce((s, d) => s + latestAmount(d.amounts), 0);
  const perCapita = totalGF / POPULATION;

  insights.push({
    id: "total-budget",
    category: "spending",
    title: "Total General Fund Expenditures",
    value: fmt(totalGF),
    detail: `The city spends ${fmt(perCapita)} per resident per year across 7 departments.`,
    icon: "DollarSign",
    color: "blue",
  });

  // Biggest department
  const sortedDepts = [...depts].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
  const topDept = sortedDepts[0];
  const topDeptAmount = latestAmount(topDept.amounts);
  insights.push({
    id: "top-department",
    category: "spending",
    title: `Largest Department: ${topDept.name}`,
    value: fmt(topDeptAmount),
    detail: `${pct(topDeptAmount / totalGF)} of General Fund spending. ${topDept.tldr}`,
    icon: "Shield",
    color: "red",
  });

  // Fastest-growing department
  const deptGrowth = depts.map((d) => {
    const curr = latestAmount(d.amounts);
    const prev = prevAmount(d.amounts);
    return { name: d.name, growth: prev > 0 ? (curr - prev) / prev : 0, change: curr - prev };
  }).sort((a, b) => b.growth - a.growth);

  const fastestGrower = deptGrowth[0];
  if (fastestGrower.growth > 0) {
    insights.push({
      id: "fastest-growing-dept",
      category: "alert",
      title: `Fastest Growing: ${fastestGrower.name}`,
      value: `+${pct(fastestGrower.growth)}`,
      detail: `Increased by ${fmt(fastestGrower.change)} year-over-year. Worth monitoring for budget sustainability.`,
      icon: "TrendingUp",
      color: "amber",
    });
  }

  // --- REVENUE INSIGHTS ---
  const revCats = revenueData.categories;
  const totalRev = revCats.reduce((s, c) => s + latestAmount(c.amounts), 0);

  insights.push({
    id: "total-revenue",
    category: "revenue",
    title: "General Fund Revenue",
    value: fmt(totalRev),
    detail: `Revenue exceeds expenditures by ${fmt(totalRev - totalGF)}, indicating a balanced budget position.`,
    icon: "TrendingUp",
    color: "green",
  });

  // Sales tax dominance
  const salesTax = revCats.find((c) => c.id === "sales-tax");
  if (salesTax) {
    const stAmount = latestAmount(salesTax.amounts);
    insights.push({
      id: "sales-tax-share",
      category: "revenue",
      title: "Sales Tax Dominance",
      value: pct(stAmount / totalRev),
      detail: `Sales tax at ${fmt(stAmount)} is the #1 revenue source. The Auto Square alone generates ~$14.6M — making Cerritos uniquely dependent on car sales.`,
      icon: "ShoppingCart",
      color: "green",
    });
  }

  // Revenue diversification
  const topRevShare = revCats.reduce((max, c) => Math.max(max, latestAmount(c.amounts) / totalRev), 0);
  if (topRevShare > 0.4) {
    insights.push({
      id: "revenue-concentration",
      category: "alert",
      title: "Revenue Concentration Risk",
      value: pct(topRevShare),
      detail: `A single source makes up ${pct(topRevShare)} of revenue. Most financial advisors recommend no single source exceed 30% for fiscal resilience.`,
      icon: "AlertTriangle",
      color: "amber",
    });
  }

  // --- TREND INSIGHTS ---
  const hist = historicalData;
  const tenYrFirst = hist.totals[0];
  const tenYrLast = hist.totals[hist.totals.length - 1];
  const tenYrGrowth = (tenYrLast - tenYrFirst) / tenYrFirst;
  const annualizedGrowth = Math.pow(tenYrLast / tenYrFirst, 1 / (hist.fiscalYears.length - 1)) - 1;

  insights.push({
    id: "10yr-growth",
    category: "trend",
    title: "10-Year Budget Growth",
    value: pct(tenYrGrowth),
    detail: `From ${fmt(tenYrFirst)} to ${fmt(tenYrLast)} over ${hist.fiscalYears.length} years. Annualized growth: ${pct(annualizedGrowth)}.`,
    icon: "BarChart3",
    color: "purple",
  });

  // COVID impact and recovery
  const covidIdx = hist.fiscalYears.indexOf("2020-21");
  if (covidIdx >= 0) {
    const preIdx = covidIdx - 1;
    const covidTotal = hist.totals[covidIdx];
    const preTotal = hist.totals[preIdx];
    const drop = (covidTotal - preTotal) / preTotal;
    insights.push({
      id: "covid-recovery",
      category: "trend",
      title: "COVID-19 Impact & Recovery",
      value: pct(Math.abs(drop)),
      detail: `Budget dropped ${pct(Math.abs(drop))} during COVID (FY 2020-21). Theater fell 69%. The city has since fully recovered and exceeded pre-pandemic levels.`,
      icon: "Activity",
      color: "purple",
    });
  }

  // --- SUSTAINABILITY INSIGHTS ---
  const waterCard = scorecardsData.scorecards.find((s) => s.id === "recycled-water");
  if (waterCard) {
    insights.push({
      id: "water-savings",
      category: "sustainability",
      title: "Water Conservation",
      value: "722M gal/yr",
      detail: "Recycled water program since 1988 saves 722 million gallons of drinking water annually across 200+ acres.",
      icon: "Droplets",
      color: "cyan",
    });
  }

  const treeCard = scorecardsData.scorecards.find((s) => s.id === "urban-forestry");
  if (treeCard) {
    insights.push({
      id: "urban-forest",
      category: "sustainability",
      title: "Urban Forest",
      value: "28,000+ trees",
      detail: "Tree City USA for 25+ consecutive years. ~250 new trees planted annually with $4.5M in parks management.",
      icon: "TreePine",
      color: "green",
    });
  }

  const solarCard = scorecardsData.scorecards.find((s) => s.id === "solar-energy");
  if (solarCard) {
    insights.push({
      id: "solar-pioneer",
      category: "sustainability",
      title: "Solar Energy Pioneer",
      value: "350K kWh/yr",
      detail: "Nation's first solar-heated City Hall (1978). Corporate Yard solar array generates 350,000 kWh/year. LED signals save 60% energy.",
      icon: "Zap",
      color: "amber",
    });
  }

  return insights;
}
