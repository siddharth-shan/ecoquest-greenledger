// Fallback in-memory store for local development when KV is not configured
const localStore = new Map<string, string>();
const isKvConfigured = !!process.env.KV_REST_API_URL;

async function kvGet<T>(key: string): Promise<T | null> {
  if (isKvConfigured) {
    try {
      const { kv } = await import("@vercel/kv");
      return await kv.get<T>(key);
    } catch {
      return null;
    }
  }
  const val = localStore.get(key);
  return val ? (JSON.parse(val) as T) : null;
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (isKvConfigured) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(key, value);
      return;
    } catch {
      // Fall through to local store
    }
  }
  localStore.set(key, JSON.stringify(value));
}

// ---- Survey Responses ----

export async function saveSurveyResponse(
  surveyId: string,
  userId: string,
  answers: Record<string, string | number>
): Promise<void> {
  const key = `survey:${surveyId}:${userId}`;
  await kvSet(key, {
    surveyId,
    userId,
    answers,
    submittedAt: new Date().toISOString(),
  });

  // Also maintain an index of respondent IDs for aggregation
  const indexKey = `survey:${surveyId}:_index`;
  const existing = await kvGet<string[]>(indexKey);
  const ids = existing || [];
  if (!ids.includes(userId)) {
    ids.push(userId);
    await kvSet(indexKey, ids);
  }
}

// ---- Survey Aggregate Results ----

interface SurveyResponseData {
  surveyId: string;
  userId: string;
  answers: Record<string, number>;
  submittedAt: string;
}

export interface PriorityAggregateResult {
  surveyId: string;
  totalResponses: number;
  results: {
    categoryId: string;
    averageRank: number;
    voteCount: number;
  }[];
}

export async function getSurveyAggregateResults(
  surveyId: string
): Promise<PriorityAggregateResult> {
  const indexKey = `survey:${surveyId}:_index`;
  const userIds = await kvGet<string[]>(indexKey);

  if (!userIds || userIds.length === 0) {
    return { surveyId, totalResponses: 0, results: [] };
  }

  const tallies: Record<string, { total: number; count: number }> = {};

  for (const userId of userIds) {
    const key = `survey:${surveyId}:${userId}`;
    const response = await kvGet<SurveyResponseData>(key);
    if (!response?.answers) continue;

    for (const [categoryId, rank] of Object.entries(response.answers)) {
      if (!tallies[categoryId]) {
        tallies[categoryId] = { total: 0, count: 0 };
      }
      tallies[categoryId].total += Number(rank);
      tallies[categoryId].count += 1;
    }
  }

  const results = Object.entries(tallies)
    .map(([categoryId, { total, count }]) => ({
      categoryId,
      averageRank: Math.round((total / count) * 100) / 100,
      voteCount: count,
    }))
    .sort((a, b) => a.averageRank - b.averageRank);

  return {
    surveyId,
    totalResponses: userIds.length,
    results,
  };
}
