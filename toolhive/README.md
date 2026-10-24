# ToolHive 🐝

**Every online tool in one hive.** A free, all-in-one online toolbox with 117 browser-based tools — text, images, PDFs, social media mockups, security, coding, CSS and colors. All processing happens **client-side**: no uploads, no accounts, no limits.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo — no configuration needed (framework auto-detected).
3. After the first deploy, connect your domain in *Settings → Domains* and update the placeholder domain:
   - `app/sitemap.ts` — replace `https://toolhive.example.com`
   - `app/robots.ts` — replace the sitemap URL
   - `app/layout.tsx` — `metadataBase`
   - `app/contact/page.tsx` — the contact email

Or deploy from your machine:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Works equally well on Netlify (`next build`), Cloudflare Pages, or any Node host (`npm run build && npm start`).

## Project structure

```
app/                    # App Router pages
  page.tsx              # Homepage (hero, featured, category grids)
  tools/[slug]/         # Tool page template + SEO content + JSON-LD
  [category]/           # 9 category hub pages
  sitemap.ts robots.ts  # SEO plumbing
components/
  ui/kit.tsx            # Shared UI kit (inputs, FileDrop, mockup export…)
  tools/                # 117 tool implementations, one file per tool
  Header.tsx Footer.tsx ToolCard.tsx
lib/
  tools.ts              # Tool + category registry
  content.ts            # Per-tool SEO text composer
  download.ts           # Download/copy helpers
tool-names.json         # The 117-tool catalog
scripts/gen-registry.py # Regenerates the tool component registry
```

## Adding a tool

1. Create `components/tools/<category>/<your-slug>.tsx` (`"use client"`, default-exported component).
2. Add the slug to `tool-names.json` (name, category, seoTitle, shortDesc).
3. Run `python3 scripts/gen-registry.py`.

## Branding

ToolHive uses an amber (`hive`) accent on warm paper / slate dark. Change `hive` colors in `tailwind.config.ts`, and the logo in `components/Header.tsx` / `components/Footer.tsx`.

## Notes

- Tools that imitate social platforms are for parody, illustration, education and design — see `app/terms/page.tsx`.
- Hashing tools use Web Crypto; MD5/SHA-224 are implemented in-file for completeness.

## Security & SEO kits

- `security/` — threat model, attack-surface inventory, full security checklist (every control mapped: implemented / N/A-by-architecture with Phase-2 plans), and secrets policy. Start with `security/security-checklist.md`.
- `seo/` — post-launch SEO operating kit: GSC workflow (pages losing clicks, queries stuck on page 2, dead pages, internal links), monthly report template, content brief template, 8 AI product prompts, digital PR calendar, Reddit checklist, free-backlinks checklist.

Security controls implemented in code: CSP + full header set in `next.config.ts`, XSS sanitization in `lib/sanitize.ts` (all SVG/HTML preview sites sanitized), source maps disabled, `.env*` gitignored, no secrets anywhere.

## Backend (new)

ToolHive now ships with a full backend — SQLite locally (zero setup), Neon Postgres in production:
- `/api/track` + `/api/stats` — tool usage analytics (powers the homepage "Trending" section)
- `/api/feedback` — contact form (honeypot + rate limited); admin read via `x-admin-token`
- `/api/tool-requests` + upvote — community tool request board at `/tool-requests`
- `/api/subscribe` — newsletter signups
- `/api/health` — uptime/DB check

See **DEPLOY.md** for the 10-minute Vercel + Neon deployment guide.
