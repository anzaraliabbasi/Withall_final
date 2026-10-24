// Applies schema.postgres.sql to DATABASE_URL (used by Docker/Render startup)
import { readFileSync } from "fs";
import pg from "pg";
const url = process.env.DATABASE_URL;
if (!url) { console.log("no DATABASE_URL, skipping"); process.exit(0); }
const sql = readFileSync(new URL("../schema.postgres.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url });
await client.connect();
try { await client.query(sql); console.log("migrations applied"); }
catch (e) { console.error("migration failed:", e.message); process.exit(1); }
finally { await client.end(); }
