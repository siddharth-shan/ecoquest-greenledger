import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSurveyResponse, getSurveyAggregateResults } from "@/lib/kv";
import { parseSurveyAnswers, parseSurveyId } from "@/lib/survey-validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surveyId = parseSurveyId(searchParams.get("surveyId"));

  if (!surveyId) {
    return NextResponse.json(
      { error: "surveyId is required and must be alphanumeric (64 chars max)" },
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const rawSurveyId = (body as { surveyId?: unknown }).surveyId;
  const surveyId = parseSurveyId(
    typeof rawSurveyId === "string" ? rawSurveyId : null
  );
  if (!surveyId) {
    return NextResponse.json(
      { error: "surveyId is required and must be alphanumeric (64 chars max)" },
      { status: 400 }
    );
  }

  const answers = parseSurveyAnswers(
    (body as { answers?: unknown }).answers
  );
  if (!answers) {
    return NextResponse.json(
      { error: "answers must be an object with string/number values" },
      { status: 400 }
    );
  }

  await saveSurveyResponse(surveyId, session.user.id, answers);

  return NextResponse.json({ success: true });
}
