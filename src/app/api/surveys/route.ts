import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSurveyResponse, getSurveyAggregateResults } from "@/lib/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surveyId = searchParams.get("surveyId");

  if (!surveyId) {
    return NextResponse.json(
      { error: "surveyId is required" },
      { status: 400 }
    );
  }

  const results = await getSurveyAggregateResults(surveyId);
  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { surveyId, answers } = body;

  await saveSurveyResponse(surveyId, session.user.id, answers);

  return NextResponse.json({ success: true });
}
