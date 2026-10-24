import { getDb } from "@/lib/server/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const ok = await db.healthCheck();
    return Response.json({ status: "ok", database: ok, time: new Date().toISOString() });
  } catch (e) {
    return Response.json({ status: "error", database: false, detail: String(e).slice(0, 120) }, { status: 503 });
  }
}
