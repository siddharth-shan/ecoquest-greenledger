import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProgress, saveUserProgress, incrementImpactCounter } from "@/lib/kv";
import challengeData from "@/data/challenges/challenges.json";
import type { UserChallengeProgress } from "@/types/challenge";

export async function GET() {
  const session = await auth();
  const challenges = challengeData.challenges;

  let progress: UserChallengeProgress | null = null;
  if (session?.user?.id) {
    progress = await getUserProgress(session.user.id);
  }

  return NextResponse.json({ challenges, progress });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { challengeId, reflection } = body;

  const challenge = challengeData.challenges.find((c) => c.id === challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  let progress = await getUserProgress(session.user.id);
  if (!progress) {
    progress = {
      userId: session.user.id,
      totalPoints: 0,
      completedChallengeIds: [],
      inProgressChallengeIds: [],
      completions: [],
      streak: 0,
      joinedAt: new Date().toISOString(),
    };
  }

  if (!progress.completedChallengeIds.includes(challengeId)) {
    progress.completedChallengeIds.push(challengeId);
    progress.totalPoints += challenge.pointsReward;
    progress.completions.push({
      challengeId,
      userId: session.user.id,
      completedAt: new Date().toISOString(),
      reflection,
      verified: true,
    });

    await saveUserProgress(session.user.id, progress);

    // Increment community impact counter
    const metricMap: Record<string, string> = {
      "Gallons of water saved annually": "water-saved",
      "Gallons of water saved": "water-saved",
      "Lbs of litter collected": "litter-collected",
      "Trees cared for": "trees-cared",
    };
    const counterId = metricMap[challenge.impactMetric.label];
    if (counterId) {
      await incrementImpactCounter(counterId, challenge.impactMetric.unitValue);
    }
    await incrementImpactCounter("challenges-completed", 1);
  }

  return NextResponse.json({ success: true, progress });
}
