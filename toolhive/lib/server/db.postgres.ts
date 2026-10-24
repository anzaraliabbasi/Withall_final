/**
 * Postgres implementation (Neon / Vercel Postgres) — used when
 * DATABASE_URL and POSTGRES_DRIVER=1 are set. Schema: see schema.postgres.sql
 * All queries use parameter placeholders ($1, $2, …) — no string SQL.
 */
import { Pool } from "pg";
import type { Db, ToolUsage, Feedback, ToolRequest } from "./db";

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: { rejectUnauthorized: false } });
  return pool;
}

export class PostgresDb implements Db {
  async init() { await getPool().query("SELECT 1"); }
  async trackToolUse(slug: string, name: string, category: string) {
    await getPool().query(
      `INSERT INTO tool_usage (slug, name, category, uses) VALUES ($1, $2, $3, 1)
       ON CONFLICT (slug) DO UPDATE SET uses = tool_usage.uses + 1, name = $2,
       category = $3, last_used = now()`, [slug, name, category]);
  }
  async topTools(limit: number): Promise<ToolUsage[]> {
    const r = await getPool().query(
      `SELECT slug, name, category, uses FROM tool_usage ORDER BY uses DESC, last_used DESC LIMIT $1`, [limit]);
    return r.rows;
  }
  async totalUses(): Promise<number> {
    const r = await getPool().query(`SELECT COALESCE(SUM(uses),0) AS t FROM tool_usage`);
    return Number(r.rows[0].t);
  }
  async insertFeedback(name: string, email: string, message: string, ip: string) {
    await getPool().query(`INSERT INTO feedback (name, email, message, ip) VALUES ($1, $2, $3, $4)`, [name, email, message, ip]);
  }
  async listFeedback(limit: number): Promise<Feedback[]> {
    const r = await getPool().query(`SELECT id, name, email, message, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM feedback ORDER BY id DESC LIMIT $1`, [limit]);
    return r.rows;
  }
  async insertToolRequest(title: string, description: string, ip: string): Promise<number> {
    const r = await getPool().query(`INSERT INTO tool_requests (title, description, ip) VALUES ($1, $2, $3) RETURNING id`, [title, description, ip]);
    return r.rows[0].id;
  }
  async listToolRequests(): Promise<ToolRequest[]> {
    const r = await getPool().query(`SELECT id, title, description, votes, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM tool_requests ORDER BY votes DESC, id DESC LIMIT 100`);
    return r.rows;
  }
  async upvoteToolRequest(id: number, ip: string): Promise<boolean> {
    const r = await getPool().query(`UPDATE tool_requests SET votes = votes + 1 WHERE id = $1`, [id]);
    await getPool().query(`INSERT INTO admin_log (action, detail) VALUES ('vote', $1)`, [`${id}:${ip}`]);
    return (r.rowCount || 0) > 0;
  }
  async insertSubscriber(email: string) {
    await getPool().query(`INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`, [email]);
  }
  async adminLog(action: string, detail: string) {
    await getPool().query(`INSERT INTO admin_log (action, detail) VALUES ($1, $2)`, [action, detail]);
  }
  async healthCheck(): Promise<boolean> {
    await getPool().query("SELECT 1");
    return true;
  }
}
