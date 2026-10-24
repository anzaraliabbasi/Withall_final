# TASKS.md — Roadmap, Phases & Authentication

> What was done (Phase 1), what's next (Phases 2–3), and the full authentication plan for when accounts arrive.

---

## Phase 1 — MVP (COMPLETE ✅, October 2026)

| Area | Delivered |
|---|---|
| Platform | Next.js 15 SSG shell, 128 prerendered pages, SEO plumbing (sitemap/robots/JSON-LD/canonical/OG) |
| Tools | **117 functional tools** across 9 categories (see PRD §2 table) |
| Design system | ToolHive amber/slate identity, shared UI kit, dark mode, responsive |
| Docs | PRD, Architecture, Rule, Design, Tasks, Project Memory, README (run + deploy steps) |
| Quality | `tsc --noEmit` clean, production build passing, zero secrets, zero server dependencies |

**How it was built:** 8 parallel worker agents against a shared contract (`CONTRACT.md`, `WORKER_SPECS.md`) — see PROJECT_MEMORY.md for the full log and the mapping of every worker to its files.

---

## Phase 2 — Growth & polish (next 1–2 months)

| # | Task | Notes |
|---|---|---|
| 2.1 | **Analytics** (privacy-respecting: Plausible/Umami self-host or GA4 optional) | Add one `<Script>` in `app/layout.tsx`; document consent in Privacy |
| 2.2 | **Tool expansion, batch A** (~20 tools) | Popular asks: video→GIF, audio trimmer (MediaRecorder), tweet character counter expanded, word frequency counter, slug+UTM builder, favicon generator, JSON→CSV, CSV→JSON, cron parser, timestamp converter, EXIF viewer/scrubber |
| 2.3 | **PWA offline** | `next-pwa` or manual service worker: install ToolHive as an app, tools keep working offline (architecture already permits this) |
| 2.4 | **i18n** | English + Urdu first (audience hint: PK); next-intl; tool UI strings already centralized in kit |
| 2.5 | **Per-tool OG images** | Auto-generate branded 1200×630 OG images from tool name (can be a build-time canvas script) |
| 2.6 | **Monetization (optional)** | AdSense/Carbon slots in `layout.tsx` + one ad zone per tool page below the tool; never above the tool |
| 2.7 | **Search upgrade** | Client-side fuzzy index (already) + keyboard palette (⌘K) |
| 2.8 | **QA pass** | Lighthouse ≥95 all categories; test 20 heavy tools on 2GB-RAM Android |

## Phase 3 — Accounts, sync & Pro (month 3+)

| # | Task | Notes |
|---|---|---|
| 3.1 | **Authentication** (full plan below) | Phase 3's headline feature |
| 3.2 | **Favorites + recent tools** | Auth-gated sync, local fallback |
| 3.3 | **Saved presets** | Persist generator settings (gradients, mockup drafts) — first server-side storage (Postgres + blob storage), user-scoped |
| 3.4 | **Workspace/teams** | Share saved mockups with teammates (link-based, signed URLs) |
| 3.5 | **Pro tier** (optional) | Removes any future ads, larger server-side conversions (cloud worker for 500MB+ videos), API access with keys |
| 3.6 | **Uptime + error tracking** | Sentry (client) + Vercel analytics; per-tool error boundary so one tool can't blank the page |

---

## Authentication — the full plan (Phase 3.1)

### Decision: NextAuth.js (Auth.js v5) with OAuth-first, email fallback

- **Provider:** `next-auth` v5 (now `auth.js`) — first-class App Router support.
- **Providers:** Google + GitHub (OAuth, zero friction) + Email magic link (Resend) for users with neither.
- **Session strategy:** JWT in an HttpOnly cookie (stateless default — no DB needed until Phase 3.3).
- **Adapter:** none for Phase 3.1–3.2 (JWT sessions + a tiny `User` table when accounts are first persisted); Prisma + Postgres (Neon/Vercel Postgres) at Phase 3.3.

### What auth enables (and does NOT change)
- **Opt-in only:** every one of the 117 tools stays 100% functional without an account. Auth only adds sync (favorites, presets, history).
- Auth lives in a `app/(auth)/` route group: `/signin`, `/callback/[provider]`, `/signout`.
- Header gains a subtle "Save your favorites" chip; no modal walls.

### Implementation steps (when you start Phase 3.1)
1. `npm i next-auth@beta` and create `auth.ts` exporting `NextAuth(config)` handlers.
2. Set env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `AUTH_GITHUB_ID/SECRET`, `AUTH_RESEND_KEY`.
3. Mount route handler at `app/api/auth/[...nextauth]/route.ts`.
4. Wrap the app in `<SessionProvider>` (client) — header reads session.
5. RLS-style data rules: user rows keyed by `user.id` from the JWT; server actions check `auth()` before any write.
6. Deployment: add the env vars in Vercel → Settings → Environment Variables. Nothing else changes (static pages stay static; session is client-fetched).

### Security notes
- OAuth tokens stay server-side; browser only ever holds the session JWT cookie (HttpOnly, SameSite=Lax).
- No tool ever needs auth or network — auth is additive chrome, not a dependency of the tools.

---

## Maintenance checklist (standing tasks)

- [ ] Quarterly: bump Next.js/React minor versions; rerun `npm run build`.
- [ ] Whenever `tool-names.json` changes: run `python3 scripts/gen-registry.py`, verify build, redeploy.
- [ ] When tools are added: update PRD §2 table, sitemap regenerates automatically.
- [ ] Keep PROJECT_MEMORY.md's "current state" section updated after every work session.
