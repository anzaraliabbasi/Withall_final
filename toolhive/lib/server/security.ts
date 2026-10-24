/**
 * Server-side security helpers for API routes.
 * - Rate limiting (in-memory, per-IP, per-scope)
 * - Input sanitization + validation caps
 * - Honeypot bot check
 * - Admin token guard (env ADMIN_TOKEN; never committed)
 */
import { NextRequest } from "next/server";

/* ---------- rate limiting ---------- */
type Bucket = number[]; // timestamps of allowed hits
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000; // memory guard

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(req: NextRequest, scope: string, limit: number, windowMs: number): boolean {
  const key = `${scope}:${clientIp(req)}`;
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) buckets.clear();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false; // blocked
  }
  hits.push(now);
  buckets.set(key, hits);
  return true; // allowed
}

/* ---------- input sanitization ---------- */
export function capString(v: unknown, maxLen: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/\u0000/g, "").replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export function isEmail(v: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,10}$/.test(v);
}

export async function safeJson(req: NextRequest, maxBytes = 10_000): Promise<Record<string, unknown> | null> {
  const len = Number(req.headers.get("content-length") || "0");
  if (len > maxBytes) return null;
  const text = (await req.text()).slice(0, maxBytes + 1);
  if (text.length > maxBytes) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Honeypot: hidden field that humans leave empty and bots fill. */
export function isBot(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.length > 0;
}

/* ---------- admin guard ---------- */
export function isAdmin(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false; // unset = locked, not open
  return req.headers.get("x-admin-token") === expected;
}

export function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}
