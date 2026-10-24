import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, jsonError } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let statsCache: { data: unknown; ts: number } | null = null;

export async function GET(req: NextRequest) {
  if (!rateLimit(req, "stats", 60, 60_000)) return jsonError(429, "Too many requests");
  // in-memory 60s cache: expensive aggregate query, not per-hit
  if (statsCache && Date.now() - statsCache.ts < 60_000) {
    return Response.json(statsCache.data, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  }
  const db = await getDb();
  const [top, total] = await Promise.all([db.topTools(10), db.totalUses()]);
  statsCache = { data: { totalToolUses: total, topTools: top }, ts: Date.now() };
  return Response.json(statsCache.data, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
