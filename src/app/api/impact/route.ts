import { NextResponse } from "next/server";
import { getImpactCounters } from "@/lib/kv";

export async function GET() {
  const counters = await getImpactCounters();
  return NextResponse.json(counters);
}
