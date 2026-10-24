import { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { rateLimit, safeJson, jsonError } from "@/lib/server/security";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { tools } = require("@/lib/tools");
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "track", 120, 60_000)) return jsonError(429, "Too many requests");
  const body = await safeJson(req, 500);
  if (!body || typeof body.slug !== "string") return jsonError(400, "Bad request");
  const tool = tools.find((t: { slug: string }) => t.slug === body.slug);
  if (!tool) return jsonError(404, "Unknown tool");
  const db = await getDb();
  await db.trackToolUse(tool.slug, tool.name, tool.category);
  return Response.json({ ok: true });
}
