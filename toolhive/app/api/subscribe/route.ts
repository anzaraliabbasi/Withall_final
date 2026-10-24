import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, safeJson, capString, isEmail, isBot, jsonError } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "subscribe", 5, 10 * 60_000)) return jsonError(429, "Too many requests");
  const body = await safeJson(req, 1000);
  if (!body) return jsonError(400, "Bad request");
  if (isBot(body)) return Response.json({ ok: true });
  const email = capString(body.email, 254);
  if (!isEmail(email)) return jsonError(400, "Valid email required");
  const db = await getDb();
  await db.insertSubscriber(email);
  return Response.json({ ok: true });
}
