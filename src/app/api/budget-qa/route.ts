import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import expenditureData from "@/data/budget/expenditures.json";
import revenueData from "@/data/budget/revenue.json";
import historicalData from "@/data/budget/historical.json";
import glossaryData from "@/data/budget/glossary.json";
import scorecardsData from "@/data/scorecards/scorecards.json";

const SYSTEM_PROMPT = `You are a helpful assistant for the GreenLedger civic platform — a budget transparency tool for Cerritos, CA. You answer questions about the city's budget, finances, and sustainability programs using ONLY the verified data provided below.

RULES:
- ONLY answer using the data provided. Do not make up or hallucinate any figures.
- If the answer is not in the provided data, say so clearly and suggest where the user might find it (e.g., cerritos.gov or the adopted budget PDF).
- Keep answers concise and conversational — this is a public-facing tool for residents and city officials.
- When citing numbers, mention the fiscal year and source document.
- Format currency with dollar signs and commas (e.g., $23,385,534).
- At the end of your response, include a "Sources" section listing which specific data documents your answer draws from. Format each source on its own line starting with "- ".

CERRITOS BUDGET DATA (FY 2025-26 Adopted Budget):

== EXPENDITURES BY DEPARTMENT ==
${JSON.stringify(expenditureData.categories.map(c => ({
  name: c.name,
  id: c.id,
  tldr: c.tldr,
  amounts: c.amounts,
  tags: c.sustainabilityTags,
  lineItems: c.lineItems?.map(li => ({ name: li.name, description: li.description, tldr: li.tldr, amounts: li.amounts }))
})), null, 2)}

== REVENUE BY CATEGORY ==
${JSON.stringify(revenueData.categories.map(c => ({
  name: c.name,
  id: c.id,
  tldr: c.tldr,
  amounts: c.amounts,
  tags: c.sustainabilityTags,
  lineItems: c.lineItems?.map(li => ({ name: li.name, tldr: li.tldr, amounts: li.amounts }))
})), null, 2)}

== HISTORICAL TRENDS (10-YEAR) ==
${JSON.stringify(historicalData, null, 2)}

== FINANCIAL GLOSSARY ==
${JSON.stringify(glossaryData.terms.map(t => ({ term: t.term, definition: t.definition, example: t.example })), null, 2)}

== SUSTAINABILITY SCORECARDS ==
${JSON.stringify(scorecardsData.scorecards.map(s => ({
  title: s.title,
  description: s.description,
  tldr: s.tldr,
  metrics: s.metrics,
  highlights: s.highlights,
})), null, 2)}

KEY FACTS:
- Population: 51,460 (2020 Census)
- All-Funds Operating Budget: $131,387,520
- General Fund Revenue: $101,503,081
- GF Operating Expenditures: $91,493,224
- Capital Improvements: $23.0M
- Cerritos is a "contract city" — it contracts with LA County for sheriff and fire services
- Largest revenue source: Sales Tax at $43.8M (43.2% of GF), heavily driven by Cerritos Auto Square
- 7 departments: Community Safety, Public Works, Community & Cultural Services, Theater (CCPA), Administrative Services, Community Development, Legislative & Administrative`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey });

    // Build messages from history
    const messages: Anthropic.MessageParam[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }
    messages.push({ role: "user", content: message });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const answer = textBlock?.text ?? "Sorry, I couldn't generate a response.";

    // Extract sources from the answer (lines starting with "- " after "Sources" heading)
    const sources: { document: string; detail: string }[] = [];
    const sourcesMatch = answer.match(/sources:?\s*\n([\s\S]*?)$/i);
    if (sourcesMatch) {
      const sourceLines = sourcesMatch[1].split("\n").filter((l) => l.trim().startsWith("-"));
      for (const line of sourceLines) {
        const text = line.replace(/^-\s*/, "").trim();
        if (text) {
          sources.push({ document: text, detail: "" });
        }
      }
    }

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("Budget Q&A error:", error);
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 }
    );
  }
}
