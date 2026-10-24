-- ToolHive production schema (Neon / Vercel Postgres)
CREATE TABLE IF NOT EXISTS tool_usage (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'misc',
  uses INTEGER NOT NULL DEFAULT 0,
  last_used TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tool_requests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  votes INTEGER NOT NULL DEFAULT 1,
  ip TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_log (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tool_usage_uses_idx ON tool_usage (uses DESC);
CREATE INDEX IF NOT EXISTS tool_requests_votes_idx ON tool_requests (votes DESC);
