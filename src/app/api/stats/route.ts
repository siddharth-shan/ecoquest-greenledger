import { NextResponse } from "next/server";
import { getImpactCounters, getSurveyAggregateResults } from "@/lib/kv";

export async function GET() {
  const [counters, surveyResults] = await Promise.all([
    getImpactCounters(),
    getSurveyAggregateResults("sustainability-priorities-2025"),
  ]);

  const challengesCompleted =
    counters.find((c) => c.id === "challenges-completed")?.value ?? 0;
  const volunteerHours =
    counters.find((c) => c.id === "park-hours")?.value ?? 0;

  return NextResponse.json({
    totalSurveyResponses: surveyResults.totalResponses,
    totalChallengesCompleted: challengesCompleted,
    totalVolunteerHours: volunteerHours,
    impactCounters: counters,
    lastUpdated: new Date().toISOString(),
  });
}
