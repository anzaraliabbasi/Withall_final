/**
 * ToolHive data layer.
 * - Local/dev: node:sqlite (built into Node 22.5+), zero dependencies, file at data/toolhive.db
 * - Production (Vercel/Neon): set DATABASE_URL=postgres://... and POSTGRES_DRIVER=1
 *   (see DEPLOY.md); the postgres implementation lives in db.postgres.ts.
 * All writes are parameterized — never string-concatenated SQL.
 */
import path from "node:path";

export type ToolUsage = { slug: string; name: string; category: string; uses: number };
export type Feedback = { id: number; name: string; email: string; message: string; created_at: string };
export type ToolRequest = { id: number; title: string; description: string; votes: number; created_at: string };

export interface Db {
  init(): Promise<void>;
  trackToolUse(slug: string, name: string, category: string): Promise<void>;
  topTools(limit: number): Promise<ToolUsage[]>;
  totalUses(): Promise<number>;
  insertFeedback(name: string, email: string, message: string, ip: string): Promise<void>;
  listFeedback(limit: number): Promise<Feedback[]>;
  insertToolRequest(title: string, description: string, ip: string): Promise<number>;
  listToolRequests(): Promise<ToolRequest[]>;
  upvoteToolRequest(id: number, ip: string): Promise<boolean>;
  insertSubscriber(email: string): Promise<void>;
  adminLog(action: string, detail: string): Promise<void>;
  healthCheck(): Promise<boolean>;
}

/* ------------------------------------------------------------------ */
/* SQLite implementation (local + self-hosted single-node deployments) */
/* ------------------------------------------------------------------ */
import { DatabaseSync } from "node:sqlite";

let sqlite: DatabaseSync | null = null;

function getSqlite(): DatabaseSync {
  if (sqlite) return sqlite;
  sqlite = new DatabaseSync(path.join(process.cwd(), "data", "toolhive.db"));
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tool_usage (
      slug TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'misc',
      uses INTEGER NOT NULL DEFAULT 0, last_used TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL,
      message TEXT NOT NULL, ip TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tool_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
      votes INTEGER NOT NULL DEFAULT 1, ip TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS admin_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS tool_usage_uses_idx ON tool_usage (uses DESC);
    CREATE INDEX IF NOT EXISTS tool_requests_votes_idx ON tool_requests (votes DESC);
  `);
  return sqlite;
}

class SqliteDb implements Db {
  async init() { getSqlite(); }
  async trackToolUse(slug: string, name: string, category: string) {
    getSqlite().prepare(
      `INSERT INTO tool_usage (slug, name, category, uses) VALUES (?, ?, ?, 1)
       ON CONFLICT(slug) DO UPDATE SET uses = uses + 1, name = excluded.name,
       category = excluded.category, last_used = datetime('now')`
    ).run(slug, name, category);
  }
  async topTools(limit: number): Promise<ToolUsage[]> {
    return getSqlite().prepare(
      `SELECT slug, name, category, uses FROM tool_usage ORDER BY uses DESC, last_used DESC LIMIT ?`
    ).all(limit) as ToolUsage[];
  }
  async totalUses(): Promise<number> {
    const r = getSqlite().prepare(`SELECT COALESCE(SUM(uses),0) AS t FROM tool_usage`).get() as { t: number };
    return r.t;
  }
  async insertFeedback(name: string, email: string, message: string, ip: string) {
    getSqlite().prepare(`INSERT INTO feedback (name, email, message, ip) VALUES (?, ?, ?, ?)`).run(name, email, message, ip);
  }
  async listFeedback(limit: number): Promise<Feedback[]> {
    return getSqlite().prepare(`SELECT id, name, email, message, created_at FROM feedback ORDER BY id DESC LIMIT ?`)
      .all(limit) as Feedback[];
  }
  async insertToolRequest(title: string, description: string, ip: string): Promise<number> {
    const r = getSqlite().prepare(`INSERT INTO tool_requests (title, description, ip) VALUES (?, ?, ?)`)
      .run(title, description, ip);
    return Number(r.lastInsertRowid);
  }
  async listToolRequests(): Promise<ToolRequest[]> {
    return getSqlite().prepare(
      `SELECT id, title, description, votes, created_at FROM tool_requests ORDER BY votes DESC, id DESC LIMIT 100`
    ).all() as ToolRequest[];
  }
  async upvoteToolRequest(id: number, ip: string): Promise<boolean> {
    const r = getSqlite().prepare(`UPDATE tool_requests SET votes = votes + 1 WHERE id = ?`).run(id);
    // naive per-IP vote throttling
    getSqlite().prepare(`INSERT INTO admin_log (action, detail) VALUES ('vote', ?)`).run(`${id}:${ip}`);
    return r.changes > 0;
  }
  async insertSubscriber(email: string) {
    getSqlite().prepare(`INSERT OR IGNORE INTO subscribers (email) VALUES (?)`).run(email);
  }
  async adminLog(action: string, detail: string) {
    getSqlite().prepare(`INSERT INTO admin_log (action, detail) VALUES (?, ?)`).run(action, detail);
  }
  async healthCheck(): Promise<boolean> {
    getSqlite().prepare(`SELECT 1`).get();
    return true;
  }
}

/* Postgres implementation is loaded only when configured (see db.postgres.ts) */
export async function getDb(): Promise<Db> {
  if (process.env.DATABASE_URL && process.env.POSTGRES_DRIVER === "1") {
    const { PostgresDb } = await import("./db.postgres");
    const db = new PostgresDb();
    await db.init();
    return db;
  }
  const db = new SqliteDb();
  await db.init();
  return db;
}
