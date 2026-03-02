import expenditureData from "@/data/budget/expenditures.json";
import revenueData from "@/data/budget/revenue.json";
import historicalData from "@/data/budget/historical.json";
import glossaryData from "@/data/budget/glossary.json";
import scorecardsData from "@/data/scorecards/scorecards.json";

interface AssistantResponse {
  answer: string;
  sources: string[];
}

const POPULATION = 51460;

// Build search indices
const departments = expenditureData.categories.map((c) => ({
  id: c.id,
  name: c.name,
  tldr: c.tldr,
  amounts: c.amounts,
  lineItems: c.lineItems ?? [],
}));

const revenueCategories = revenueData.categories.map((c) => ({
  id: c.id,
  name: c.name,
  tldr: c.tldr,
  amounts: c.amounts,
  lineItems: c.lineItems ?? [],
}));

const glossary = glossaryData.terms;
const scorecards = scorecardsData.scorecards;
const historical = historicalData;

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function latestAmount(amounts: { fiscalYear: string; amount: number }[]): number {
  const fy2526 = amounts.find((a) => a.fiscalYear === "2025-26");
  return fy2526?.amount ?? amounts[amounts.length - 1]?.amount ?? 0;
}

function yoyChange(amounts: { fiscalYear: string; amount: number }[]): { change: number; pctChange: number } | null {
  const curr = amounts.find((a) => a.fiscalYear === "2025-26")?.amount;
  const prev = amounts.find((a) => a.fiscalYear === "2024-25")?.amount;
  if (curr == null || prev == null || prev === 0) return null;
  return { change: curr - prev, pctChange: (curr - prev) / prev };
}

// Keyword matchers
const keywords: Record<string, string[]> = {
  safety: ["safety", "sheriff", "police", "fire", "law enforcement", "crime", "patrol", "emergency"],
  "public-works": ["public works", "streets", "roads", "parks", "trees", "maintenance", "infrastructure", "water system"],
  "community-cultural-services": ["library", "recreation", "senior", "cultural", "swim", "community services", "sports"],
  theater: ["theater", "theatre", "ccpa", "performing arts", "concerts", "broadway", "shows"],
  "administrative-services": ["administrative", "finance", "hr", "human resources", "technology", "it department"],
  "community-development": ["development", "planning", "zoning", "housing", "transit", "code enforcement", "economic development"],
  "legislative-admin": ["council", "city manager", "attorney", "clerk", "mayor", "legislative", "elected"],
  "sales-tax": ["sales tax", "auto square", "shopping", "retail", "restaurant"],
  revenue: ["revenue", "income", "money coming in", "how much does the city earn", "funding", "where does money come from"],
  spending: ["spending", "expenditure", "spend", "cost", "how much does", "budget for", "allocat"],
  water: ["water", "recycled water", "conservation", "drought", "irrigation"],
  trees: ["tree", "urban forest", "canopy", "arbor", "planting"],
  solar: ["solar", "energy", "power", "electricity", "led", "clean energy"],
  fleet: ["fleet", "cng", "vehicle", "truck", "bus", "transit", "propane"],
  total: ["total budget", "overall budget", "entire budget", "all funds", "how big"],
  percapita: ["per capita", "per resident", "per person", "each resident", "per household"],
  biggest: ["biggest", "largest", "most", "top", "highest", "number one", "#1"],
  change: ["change", "trend", "growing", "increasing", "decreasing", "over time", "historical", "10 year", "ten year"],
  compare: ["compare", "versus", "vs", "difference between"],
};

function matchTopics(question: string): string[] {
  const q = question.toLowerCase();
  const matched: string[] = [];
  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some((w) => q.includes(w))) {
      matched.push(topic);
    }
  }
  return matched;
}

function findDepartment(topics: string[], question: string): typeof departments[number] | null {
  const q = question.toLowerCase();
  // Direct department name match
  for (const dept of departments) {
    if (q.includes(dept.name.toLowerCase())) return dept;
  }
  // Keyword topic match
  const deptTopics = ["safety", "public-works", "community-cultural-services", "theater", "administrative-services", "community-development", "legislative-admin"];
  for (const topic of topics) {
    if (deptTopics.includes(topic)) {
      const deptId = topic === "safety" ? "community-safety" : topic;
      const dept = departments.find((d) => d.id === deptId);
      if (dept) return dept;
    }
  }
  return null;
}

function findRevenueCategory(topics: string[], question: string): typeof revenueCategories[number] | null {
  const q = question.toLowerCase();
  for (const cat of revenueCategories) {
    if (q.includes(cat.name.toLowerCase())) return cat;
  }
  if (topics.includes("sales-tax")) return revenueCategories.find((c) => c.id === "sales-tax") ?? null;
  return null;
}

function findGlossaryTerm(question: string): typeof glossary[number] | null {
  const q = question.toLowerCase();
  for (const term of glossary) {
    if (q.includes(term.term.toLowerCase())) return term;
  }
  // Check for "what is" / "what does X mean" / "define"
  if (q.includes("what is") || q.includes("what does") || q.includes("define") || q.includes("meaning of")) {
    for (const term of glossary) {
      const words = term.term.toLowerCase().split(/\s+/);
      if (words.every((w) => q.includes(w))) return term;
    }
  }
  return null;
}

function answerDepartment(dept: typeof departments[number]): AssistantResponse {
  const amount = latestAmount(dept.amounts);
  const totalGF = departments.reduce((sum, d) => sum + latestAmount(d.amounts), 0);
  const share = amount / totalGF;
  const change = yoyChange(dept.amounts);
  const perCapita = amount / POPULATION;

  let answer = `**${dept.name}** — FY 2025-26 Budget: **${fmt(amount)}**\n\n`;
  answer += `${dept.tldr}\n\n`;
  answer += `- **Share of General Fund:** ${pct(share)}\n`;
  answer += `- **Per resident:** ${fmt(perCapita)}/year\n`;
  if (change) {
    const direction = change.change > 0 ? "increased" : "decreased";
    answer += `- **Year-over-year:** ${direction} by ${fmt(Math.abs(change.change))} (${pct(Math.abs(change.pctChange))})\n`;
  }

  if (dept.lineItems.length > 0) {
    answer += `\n**Key programs:**\n`;
    for (const li of dept.lineItems) {
      const liAmount = latestAmount(li.amounts);
      answer += `- ${li.name}: ${fmt(liAmount)} — ${li.tldr}\n`;
    }
  }

  return {
    answer,
    sources: ["FY 2025-26 Adopted Budget"],
  };
}

function answerRevenue(cat: typeof revenueCategories[number]): AssistantResponse {
  const amount = latestAmount(cat.amounts);
  const totalRev = revenueCategories.reduce((sum, c) => sum + latestAmount(c.amounts), 0);
  const share = amount / totalRev;
  const change = yoyChange(cat.amounts);

  let answer = `**${cat.name}** — FY 2025-26: **${fmt(amount)}**\n\n`;
  answer += `${cat.tldr}\n\n`;
  answer += `- **Share of total revenue:** ${pct(share)}\n`;
  if (change) {
    const direction = change.change > 0 ? "up" : "down";
    answer += `- **Year-over-year:** ${direction} ${fmt(Math.abs(change.change))} (${pct(Math.abs(change.pctChange))})\n`;
  }

  if (cat.lineItems.length > 0) {
    answer += `\n**Breakdown:**\n`;
    for (const li of cat.lineItems) {
      const liAmount = latestAmount(li.amounts);
      answer += `- ${li.name}: ${fmt(liAmount)}\n`;
    }
  }

  return {
    answer,
    sources: ["FY 2025-26 Adopted Budget — Revenue Summary"],
  };
}

function answerTotal(): AssistantResponse {
  const totalGF = departments.reduce((sum, d) => sum + latestAmount(d.amounts), 0);
  const totalRev = revenueCategories.reduce((sum, c) => sum + latestAmount(c.amounts), 0);
  const perCapita = totalGF / POPULATION;

  let answer = `**Cerritos FY 2025-26 Budget Overview:**\n\n`;
  answer += `- **All-Funds Operating Budget:** $131.4M\n`;
  answer += `- **General Fund Expenditures:** ${fmt(totalGF)}\n`;
  answer += `- **General Fund Revenue:** ${fmt(totalRev)}\n`;
  answer += `- **Capital Improvements (CIP):** $23.0M\n`;
  answer += `- **Per resident:** ${fmt(perCapita)}/year\n`;
  answer += `- **Population:** ${POPULATION.toLocaleString()}\n\n`;

  answer += `**Spending by department:**\n`;
  const sorted = [...departments].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
  for (const dept of sorted) {
    const amount = latestAmount(dept.amounts);
    const share = amount / totalGF;
    answer += `- ${dept.name}: ${fmt(amount)} (${pct(share)})\n`;
  }

  return {
    answer,
    sources: ["FY 2025-26 Adopted Budget", "OpenGov Transparency Portal"],
  };
}

function answerBiggest(topics: string[]): AssistantResponse {
  if (topics.includes("revenue")) {
    const sorted = [...revenueCategories].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
    const top = sorted[0];
    const amount = latestAmount(top.amounts);
    const totalRev = revenueCategories.reduce((sum, c) => sum + latestAmount(c.amounts), 0);

    let answer = `The **biggest source of city revenue** is **${top.name}** at **${fmt(amount)}** (${pct(amount / totalRev)} of total General Fund revenue).\n\n`;
    answer += `${top.tldr}\n\n`;
    answer += `**Top 3 revenue sources:**\n`;
    for (let i = 0; i < 3 && i < sorted.length; i++) {
      const cat = sorted[i];
      answer += `${i + 1}. ${cat.name}: ${fmt(latestAmount(cat.amounts))}\n`;
    }

    return { answer, sources: ["FY 2025-26 Adopted Budget — Revenue Summary"] };
  }

  const sorted = [...departments].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
  const top = sorted[0];
  const amount = latestAmount(top.amounts);
  const totalGF = departments.reduce((sum, d) => sum + latestAmount(d.amounts), 0);

  let answer = `The **biggest spending department** is **${top.name}** at **${fmt(amount)}** (${pct(amount / totalGF)} of General Fund expenditures).\n\n`;
  answer += `${top.tldr}\n\n`;
  answer += `**All departments ranked:**\n`;
  for (let i = 0; i < sorted.length; i++) {
    const dept = sorted[i];
    answer += `${i + 1}. ${dept.name}: ${fmt(latestAmount(dept.amounts))}\n`;
  }

  return { answer, sources: ["FY 2025-26 Adopted Budget"] };
}

function answerHistorical(): AssistantResponse {
  const years = historical.fiscalYears;
  const totals = historical.totals;
  const first = totals[0];
  const last = totals[totals.length - 1];
  const growth = (last - first) / first;

  let answer = `**10-Year Budget Trend (FY ${years[0]} to ${years[years.length - 1]}):**\n\n`;
  answer += `- **${years[0]}:** ${fmt(first)}\n`;
  answer += `- **${years[years.length - 1]}:** ${fmt(last)}\n`;
  answer += `- **Overall change:** ${pct(growth)} (${growth > 0 ? "increase" : "decrease"})\n\n`;

  if (historical.keyEvents.length > 0) {
    answer += `**Notable events:**\n`;
    for (const event of historical.keyEvents) {
      answer += `- **${event.fiscalYear} — ${event.label}:** ${event.description}\n`;
    }
  }

  answer += `\n**Department trends (${years[0]} → ${years[years.length - 1]}):**\n`;
  for (const dept of historical.departments) {
    const dFirst = dept.amounts[0];
    const dLast = dept.amounts[dept.amounts.length - 1];
    const dGrowth = (dLast - dFirst) / dFirst;
    answer += `- ${dept.name}: ${fmt(dFirst)} → ${fmt(dLast)} (${dGrowth > 0 ? "+" : ""}${pct(dGrowth)})\n`;
  }

  return { answer, sources: ["OpenGov Transparency Portal — 10-Year Historical Data"] };
}

function answerPerCapita(): AssistantResponse {
  const totalGF = departments.reduce((sum, d) => sum + latestAmount(d.amounts), 0);
  const perCapita = totalGF / POPULATION;

  let answer = `**Per-Resident Spending Breakdown (FY 2025-26):**\n\n`;
  answer += `Total per resident: **${fmt(perCapita)}/year** (based on population of ${POPULATION.toLocaleString()})\n\n`;

  const sorted = [...departments].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
  for (const dept of sorted) {
    const amount = latestAmount(dept.amounts);
    const pc = amount / POPULATION;
    answer += `- ${dept.name}: **${fmt(pc)}**/resident\n`;
  }

  return { answer, sources: ["FY 2025-26 Adopted Budget", "2020 U.S. Census"] };
}

function answerScorecard(topic: string): AssistantResponse {
  const topicMap: Record<string, string> = {
    water: "recycled-water",
    trees: "urban-forestry",
    solar: "solar-energy",
    fleet: "clean-fleet",
  };
  const id = topicMap[topic];
  const card = scorecards.find((s) => s.id === id);
  if (!card) return answerSustainabilityOverview();

  let answer = `**${card.title}**\n\n${card.tldr}\n\n`;
  answer += `**Key metrics:**\n`;
  for (const m of card.metrics) {
    answer += `- ${m.label}: **${m.value.toLocaleString()} ${m.unit}**\n`;
  }
  answer += `\n**Highlights:**\n`;
  for (const h of card.highlights) {
    answer += `- ${h}\n`;
  }

  return { answer, sources: [card.source.documentName] };
}

function answerSustainabilityOverview(): AssistantResponse {
  let answer = `**Cerritos Sustainability Programs:**\n\n`;
  for (const card of scorecards) {
    if (card.type === "governance") continue;
    answer += `**${card.title}:** ${card.tldr}\n\n`;
  }
  return { answer, sources: ["City of Cerritos — Current Green Efforts", "City of Cerritos — Recycled Water Program"] };
}

function answerGlossary(term: typeof glossary[number]): AssistantResponse {
  let answer = `**${term.term}**\n\n${term.definition}\n\n`;
  if (term.example) {
    answer += `**Example:** ${term.example}\n`;
  }
  return { answer, sources: ["GreenLedger Financial Glossary"] };
}

function answerRevenueOverview(): AssistantResponse {
  const totalRev = revenueCategories.reduce((sum, c) => sum + latestAmount(c.amounts), 0);

  let answer = `**Cerritos Revenue Sources (FY 2025-26):**\n\n`;
  answer += `Total General Fund Revenue: **${fmt(totalRev)}**\n\n`;

  const sorted = [...revenueCategories].sort((a, b) => latestAmount(b.amounts) - latestAmount(a.amounts));
  for (const cat of sorted) {
    const amount = latestAmount(cat.amounts);
    answer += `- **${cat.name}:** ${fmt(amount)} (${pct(amount / totalRev)})\n`;
  }

  answer += `\nCerritos is unique because sales tax (not property tax) is the #1 revenue source, driven largely by the Cerritos Auto Square — one of the largest auto malls in the world.`;

  return { answer, sources: ["FY 2025-26 Adopted Budget — Revenue Summary"] };
}

export function askBudgetQuestion(question: string): AssistantResponse {
  const topics = matchTopics(question);

  // Check glossary first
  const glossaryTerm = findGlossaryTerm(question);
  if (glossaryTerm && topics.length <= 1) {
    return answerGlossary(glossaryTerm);
  }

  // Sustainability topics
  for (const st of ["water", "trees", "solar", "fleet"]) {
    if (topics.includes(st)) return answerScorecard(st);
  }

  // Revenue queries
  const revCat = findRevenueCategory(topics, question);
  if (revCat) return answerRevenue(revCat);

  if (topics.includes("revenue") && topics.includes("biggest")) return answerBiggest(["revenue"]);
  if (topics.includes("revenue")) return answerRevenueOverview();

  // Department queries
  const dept = findDepartment(topics, question);
  if (dept) return answerDepartment(dept);

  // General queries
  if (topics.includes("biggest")) return answerBiggest(topics);
  if (topics.includes("change")) return answerHistorical();
  if (topics.includes("percapita")) return answerPerCapita();
  if (topics.includes("total")) return answerTotal();
  if (topics.includes("spending")) return answerTotal();

  // Sustainability overview
  const q = question.toLowerCase();
  if (q.includes("sustainab") || q.includes("green") || q.includes("environment")) {
    return answerSustainabilityOverview();
  }

  // Default: total budget overview
  return {
    answer: `I can help you explore the Cerritos budget! Here's what I can answer about:\n\n` +
      `- **Departments:** Community Safety, Public Works, Library & Recreation, Theater, Administrative Services, Community Development, Legislative\n` +
      `- **Revenue:** Sales tax, property income, fees, state revenue, and more\n` +
      `- **Trends:** 10-year historical spending data\n` +
      `- **Sustainability:** Water conservation, urban forest, solar energy, clean fleet\n` +
      `- **Per capita:** How much the city spends per resident\n` +
      `- **Definitions:** Financial terms like General Fund, CIP, Bond\n\n` +
      `Try asking something like "How much does Cerritos spend on community safety?" or "What's the biggest source of revenue?"`,
    sources: [],
  };
}
