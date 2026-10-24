import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, safeJson, capString, isBot, jsonError, clientIp } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!rateLimit(req, "requests-read", 60, 60_000)) return jsonError(429, "Too many requests");
  const db = await getDb();
  return Response.json({ requests: await db.listToolRequests() }, { headers: { "Cache-Control": "public, max-age=30" } });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "requests-write", 5, 10 * 60_000)) return jsonError(429, "Too many requests");
  const body = await safeJson(req, 5000);
  if (!body) return jsonError(400, "Bad request");
  if (isBot(body)) return Response.json({ ok: true });
  const title = capString(body.title, 120);
  const description = capString(body.description, 1000);
  if (title.length < 3) return jsonError(400, "Title required (3+ chars)");
  const db = await getDb();
  const id = await db.insertToolRequest(title, description, clientIp(req));
  return Response.json({ ok: true, id });
}
