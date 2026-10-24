import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, safeJson, capString, isEmail, isBot, isAdmin, jsonError, clientIp } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/feedback — public contact form (honeypot + rate limited) */
export async function POST(req: NextRequest) {
  if (!rateLimit(req, "feedback", 5, 10 * 60_000)) return jsonError(429, "Too many messages, try later");
  const body = await safeJson(req, 20_000);
  if (!body) return jsonError(400, "Bad request");
  if (isBot(body)) return Response.json({ ok: true }); // silently accept bot bait
  const email = capString(body.email, 254);
  const message = capString(body.message, 5000);
  const name = capString(body.name, 100);
  if (!isEmail(email) || message.length < 5) return jsonError(400, "Valid email and message required");
  const db = await getDb();
  await db.insertFeedback(name, email, message, clientIp(req));
  return Response.json({ ok: true });
}

/** GET /api/feedback — admin only (x-admin-token header); access is logged */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return jsonError(401, "Unauthorized");
  if (!rateLimit(req, "feedback-admin", 30, 60_000)) return jsonError(429, "Too many requests");
  const db = await getDb();
  const rows = await db.listFeedback(200);
  await db.adminLog("feedback.read", `${rows.length} rows`);
  return Response.json({ feedback: rows });
}
