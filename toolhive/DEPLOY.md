# Deploying ToolHive (with backend)

## One-time setup

### 1. Push to GitHub
```bash
git init && git add -A && git commit -m "ToolHive with backend"
git remote add origin https://github.com/YOU/toolhive.git && git push -u origin main
```

### 2. Create the production database (Neon — free tier)
1. Sign up at neon.tech → Create project.
2. Copy the connection string (`postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
3. Run the schema once: paste `schema.postgres.sql` into the Neon SQL editor (or `psql "$DATABASE_URL" -f schema.postgres.sql`).

### 3. Deploy on Vercel
1. vercel.com → Add New Project → import your GitHub repo (framework auto-detected: Next.js).
2. Environment Variables:
   - `DATABASE_URL` = your Neon connection string
   - `POSTGRES_DRIVER` = `1`
   - `ADMIN_TOKEN` = output of `openssl rand -hex 32`
3. Deploy. Then replace `toolhive.example.com` with your real domain in: `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` (metadataBase), and the contact/about pages.

## Local development
No database setup needed — `node:sqlite` (built into Node 22.5+) creates `data/toolhive.db` automatically.

## Verify after deploying
```bash
curl https://YOURDOMAIN/api/health        # {"status":"ok","database":true,...}
curl -H "x-admin-token: $ADMIN_TOKEN" https://YOURDOMAIN/api/feedback | head -c 200
```

## Reading the feedback inbox
```bash
curl -s -H "x-admin-token: $ADMIN_TOKEN" https://YOURDOMAIN/api/feedback | python3 -m json.tool
```
