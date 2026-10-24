# Deploying ToolHive WITHOUT Vercel

The project now builds as a self-contained Node server (`output: "standalone"` in next.config.ts): it runs on any Linux host, any Docker host, or any Node PaaS. Pick one route.

## Route A - Render.com (easiest, free tier, ~10 min)
1. Push the project to a GitHub repo.
2. render.com -> New -> Web Service -> connect the repo (or use Blueprint: render.yaml is included).
3. Build: `npm ci && npm run build`  Start: `npm run start`
4. Env vars: DATABASE_URL (from Neon), POSTGRES_DRIVER=1, ADMIN_TOKEN (from `openssl rand -hex 32`), optional NEXT_PUBLIC_GSC_TOKEN.
5. Free plan sleeps after 15 min idle (~30s first-request wake). $7/mo keeps it always-on.
6. DB: free Postgres at neon.tech, then paste schema.postgres.sql in their SQL editor (or the app auto-migrates on start via scripts/migrate-standalone.mjs).

## Route B - Railway.app (~10 min, trial credit, then from $5/mo)
1. railway.app -> New Project -> Deploy from GitHub repo. Auto-detects Next.js.
2. Add Postgres with one click (Railway provides DATABASE_URL). Env vars: POSTGRES_DRIVER=1, ADMIN_TOKEN.
3. Settings -> Networking -> generate a domain or attach your own.

## Route C - Koyeb (free tier)
1. koyeb.com -> Create App -> GitHub -> build type Docker (uses the included Dockerfile).
2. Same env vars. Free instance sleeps on idle.

## Route D - Your own VPS (full control, $4-6/mo at Hetzner/DO/Contabo)
Docker route (recommended):
```
curl -fsSL https://get.docker.com | sh
git clone https://github.com/you/toolhive && cd toolhive
docker build -t toolhive .
docker run -d --restart unless-stopped -p 80:3000 \
  -e DATABASE_URL="postgres://...from-neon..." \
  -e POSTGRES_DRIVER=1 -e ADMIN_TOKEN=$(openssl rand -hex 32) toolhive
```
Plain-Node route (no Docker):
```
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
git clone https://github.com/you/toolhive && cd toolhive
npm ci && npm run build
npm i -g pm2 && pm2 start "npm run start" --name toolhive && pm2 save && pm2 startup
apt install -y nginx certbot python3-certbot-nginx
# nginx: proxy_pass http://127.0.0.1:3000;  then: certbot --nginx -d yourdomain.com
```
The Dockerfile runs DB migrations automatically on start.

## Route E - Cloudflare Pages (free, needs adapter)
Requires swapping pg for Cloudflare hyperdrive/postgres.js via @cloudflare/next-on-pages. Only if you want CF specifically - ask and I will wire it.

## After ANY route: 3 things
1. Replace toolhive.example.com with your real domain in sitemap.ts, robots.ts, app/layout.tsx (metadataBase), app/contact/page.tsx -> redeploy.
2. Visit https://yourdomain/api/health -> expect {"ok":true}.
3. Set NEXT_PUBLIC_GSC_TOKEN for Search Console, submit https://yourdomain/sitemap.xml.

Security travels with the app: HSTS + CSP headers, rate limiting, sanitization, parameterized queries, admin token - all run wherever Node runs.
