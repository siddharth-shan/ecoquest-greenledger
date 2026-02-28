import { NextResponse } from "next/server";
import challengeData from "@/data/challenges/challenges.json";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const challenge = challengeData.challenges.find((c) => c.id === id);

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  return NextResponse.json(challenge);
}
