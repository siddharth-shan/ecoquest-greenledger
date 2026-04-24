/** Safe segment for KV keys — alphanumeric, underscore, hyphen only. */
const SURVEY_ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export function parseSurveyId(raw: string | null): string | null {
  if (!raw || !SURVEY_ID_PATTERN.test(raw)) return null;
  return raw;
}

const MAX_ANSWER_KEYS = 50;

export function parseSurveyAnswers(
  raw: unknown
): Record<string, string | number> | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const entries = Object.entries(raw as Record<string, unknown>);
  if (entries.length === 0 || entries.length > MAX_ANSWER_KEYS) {
    return null;
  }
  const out: Record<string, string | number> = {};
  for (const [k, v] of entries) {
    if (typeof k !== "string" || k.length > 128) return null;
    if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === "string" && v.length <= 2000) {
      out[k] = v;
    } else {
      return null;
    }
  }
  return out;
}
