import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSurveyResponse } from "@/lib/kv";

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
