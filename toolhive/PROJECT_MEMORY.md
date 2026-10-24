# PROJECT_MEMORY.md — Build Log & Current State

> The durable memory of this project: what was done, how, what's verified, and how to pick the work back up. Update this file at the end of every work session.

---

## Current state (last verified: 2026-10-23)

| Item | Status |
|---|---|
| Platform shell (128 SSG pages, SEO, dark mode, search) | ✅ Built & smoke-tested |
| Tool implementations | ✅ 117/117 files built |
| Component registry | ✅ Generated (`scripts/gen-registry.py`) |
| TypeScript strict check | ✅ `npx tsc --noEmit` clean |
| Production build | ✅ `npm run build` passing — 117 tool pages + 9 categories + statics prerendered |
| Docs (PRD/ARCH/RULE/DESIGN/TASKS/MEMORY) | ✅ This set |
| Deployment | ⏳ Not yet deployed — see README §Deploy (Vercel, ~5 min) |
| Known reduced-scope tools | See "Honest scope notes" below |

**Stack snapshot:** Next.js 15.5.28 · React 19 · TS strict · Tailwind 3.4 · pdf-lib 1.17 · qrcode 1.5 · jsbarcode 3.11 · html-to-image 1.11.

## Origin & goal

Owner asked for a reverse-engineering-inspired rebuild of the 10015.io concept (117 online tools) as an **original** site: original brand ("ToolHive"), original code, original SEO text — same tool coverage and category map, no copied content. Research artifacts (not part of the shipped site, kept for reference in the workspace root): `10015_analysis/master_tools.json`, `REVERSE_ENGINEERING_REPORT.md`.

## Build history (chronological)

1. **Research session (2026-10-21):** analyzed target site — 117 tools / 9 categories, Next.js RSC architecture, client-side lazy libraries. Produced tool catalog + report.
2. **Scaffold:** `npm i next@15.5.28 react@19 tailwindcss@3.4 pdf-lib qrcode jsbarcode html-to-image clsx` (15.3.0 was rejected for CVE-2025-66478; pinned patched 15.5.x). Generated `tool-names.json` (117 slugs + original SEO titles/descriptions).
3. **Shell:** layout + theme bootstrap (no-FOUC dark mode), Header (live search, category menu), Footer, homepage (hero/featured/category grids), tool page template (What-is / How-to / FAQ + `SoftwareApplication`+`FAQPage` JSON-LD), category hubs, sitemap/robots/manifest, about/privacy/terms/contact. **Smoke build passed at this point.**
4. **Design system:** amber `hive` scale + slate neutrals, `ui/kit.tsx` shared primitives (inputs, FileDrop, Output, CodeBox, PhoneFrame, `useMockupExport`).
5. **Parallel tool build:** shared `CONTRACT.md` + `WORKER_SPECS.md` → 8 worker agents: W1 simple(25) W2 coding(13) W3 css(12) W4 image(13) W5 pdf(9) W6 chat/call(15) W7 post/feed(15) W8 profile/comment(15). W1 stalled at a checkpoint with zero files; relaunched as two smaller batches (13 + 12) plus a 3-file cleanup worker (2 svg + 1 youtube-video-page that the first pass missed). All gaps closed.
6. **Integration:** `scripts/gen-registry.py` → `registry.ts` (slug → `next/dynamic`), validated 117/117 registered; `tsc --noEmit` clean; `next build` passing.
7. **Docs:** PRD / ARCHITECTURE / RULE / DESIGN / TASKS / this file.

## File→worker mapping (who owns what)

| Folder | Tools | Notes |
|---|---|---|
| `components/tools/simple/` | 25 | text(8) security(8) color(5) misc(4) — hashes: Web Crypto for SHA-1/256/384/512; **in-file** MD5 + SHA-224 |
| `components/tools/coding/` | 13 | formatters/minifiers are regex-based ("basic" label) |
| `components/tools/css/` | 12 | all live-preview + CodeBox |
| `components/tools/image/` | 13 | Canvas 2D engine |
| `components/tools/pdf/` | 9 | pdf-lib; editor/whiteout use numeric x/y placement (no raster preview) |
| `components/tools/social/` | 45 + `_chat/_post/_feed` helpers | export PNG via `useMockupExport` @2× |

## Honest scope notes (tools with reduced capability — by design)

- **pdf-compressor:** lossless structural optimization (object streams + metadata strip), not JPEG re-encoding.
- **scanned-pdf-converter:** optimize/metadata-clean/page-report; no OCR rasterization (no rasterizer dep).
- **handwriting-to-font-converter:** exports glyph sheet (PNG sprite + SVGs) for font editors, not a compiled OTF.
- **pdf-editor / whiteout-pdf / add-text-to-pdf:** coordinate-based operations (page, x, y, w, h) instead of click-on-thumbnail placement.
- **tweet-to-image / instagram-photo-downloader / vimeo-thumbnail-grabber:** honest fallbacks where platforms block scraping — clearly explained in each UI.
- **javascript/html/css minifiers + formatters:** conservative regex implementations, labeled "basic".

## How to resume work on this project (any future session)

1. Read this file, then `RULE.md` §rules, then `WORKER_SPECS.md` if building tools in parallel again.
2. Run: `cd toolhive && npx tsc --noEmit && npm run build` — both must pass before any change is "done".
3. Adding a tool = ① row in `tool-names.json` ② file in the right folder per `CONTRACT.md` ③ `python3 ../scripts/gen-registry.py` (run from `scripts/`, writes `components/tools/registry.ts`) ④ build.
4. Deploy = push to GitHub → Vercel import → set the real domain in 4 places (README §Deploy checklist).
5. Update this file's "Current state" table after finishing.

## Verification commands (copy-paste)

```bash
cd toolhive
npx tsc --noEmit                 # must print nothing
npm run build                    # must end with "✓ Compiled successfully" + 128 pages
npm run dev                      # open http://localhost:3000, click around
python3 ../scripts/gen-registry.py   # after tool changes; prints "MISSING:" if gaps
```

## Backend added (2026-10-23) — Phase 2 core
- DB: `lib/server/db.ts` (node:sqlite local, zero deps) + `lib/server/db.postgres.ts` (Neon via `pg`, enabled with DATABASE_URL + POSTGRES_DRIVER=1). Schema in `schema.postgres.sql`.
- 7 API routes under `app/api/*`: health, track, stats, feedback (POST public / GET admin-token), tool-requests (+ upvote), subscribe.
- Security helpers: `lib/server/security.ts` (rate limit, sanitize, honeypot, admin guard).
- Frontend: TrackView (auto usage ping on every tool page), Trending (homepage), ContactForm, ToolRequests board (`/tool-requests`).
- Bugs fixed this round: kit Btn is type="button" (use native submit in forms), QR/handwriting PDF export via toBlob not fetch(dataUrl), 13 social tools loaded Unsplash avatars → local SVG placeholders (CSP + privacy).
- Verified: 21 API tests, 117-tool sweep (321 clicks, 0 errors), E2E contact/request/upvote, 134 URLs 200, XSS/traversal/honeypot/rate-limit all pass.

## SEO + performance pass (2026-10-24)
- Lighthouse: Performance 96 / Accessibility 100 / Best Practices 100 / SEO 100. LCP 2.6s, CLS 0.
- Added: og.png + twitter card + favicon/PWA icons (public/icons/icon-192/512.png), canonicals on all pages, BreadcrumbList schema, skeleton loader (ToolSkeleton via gen-registry.py), useDebounced hook in kit, QR input debounced, API Cache-Control + in-memory stats cache, SQLite indexes, static asset cache headers, compress:true.
- Contrast fixes: hive-500→700 on light mode (logo, See-all links, footer headings), footer slate-400→500.
- Caveat: lazy-load regex patch once corrupted 3 event handlers (onError) + 1 label — repaired, tsc clean, full sweep re-verified 0 errors.
- Upvote "FAIL" in sweep script is the per-IP rate limiter (working as designed) — endpoint verified 200 + increments.
