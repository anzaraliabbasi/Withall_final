import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, jsonError } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!rateLimit(req, "upvote", 20, 10 * 60_000)) return jsonError(429, "Too many requests");
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId < 1 || numId > 1e9) return jsonError(400, "Bad request");
  const db = await getDb();
  const ok = await db.upvoteToolRequest(numId, req.headers.get("x-forwarded-for") || "");
  return ok ? Response.json({ ok: true }) : jsonError(404, "Not found");
}
