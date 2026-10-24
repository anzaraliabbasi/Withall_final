# RULE.md — Development Rules

> Read this before touching the code. These rules keep 117 tools consistent, type-safe and shippable by many contributors (or many AI agents) in parallel.

---

## 1. General Principles

1. **Client-side only.** Tools never call an API, never upload, never fetch at build. If a tool seems to need a server, redesign it (canvas, Web Crypto, pdf-lib, DOM) before adding a backend.
2. **One tool = one file.** `components/tools/<category>/<slug>.tsx`. No props in, no shared mutable state out. A tool must work if it's the only file copied.
3. **The catalog is the source of truth.** `tool-names.json` drives routes, sitemap, search and registry. Adding a tool = ① add catalog row ② add component file ③ run `python3 scripts/gen-registry.py`.
4. **Reuse before reinventing.** UI from `components/ui/kit.tsx`, downloads from `lib/download.ts`, SEO text from `lib/content.ts`. Never copy a kit component into a tool file.
5. **Original content only.** All text (FAQs, descriptions, labels) is written for this project. Never copy copy from competitor sites; never copy their code or assets. Platform *looks* imitate layout patterns (colors/spacing), not their proprietary assets.
6. **Small, focused diffs.** Don't refactor neighboring tools while fixing one. Registry, kit and libs change rarely; tools change independently.

## 2. Technology & Coding Standards

### Stack (do not swap without an architecture note in ARCHITECTURE.md)
Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS 3.4 · pdf-lib / qrcode / jsbarcode / html-to-image.

### TypeScript
- `"use client";` at the top of every tool file; **default-export** one component (no props).
- `strict: true` is non-negotiable. No `any` unless parsing truly unknown input, and then isolate it in one function.
- No unused imports/variables. Run `npx tsc --noEmit` before saying "done".
- Types for shared shapes (e.g. chat `Msg`) live in the folder's `_helper.tsx`, not inline in 15 files.

### Styling
- **Tailwind classes only.** No custom CSS files per tool, no inline `style=` for anything Tailwind can do (inline styles are reserved for dynamic values: widths, colors from state, export-safe mockups).
- Brand scale: `hive-50…900` (amber). Neutral: `slate-*`. Semantic classes `btn-primary`, `btn-outline`, `input-base`, `card` are defined in `globals.css` — use them.
- **Dark mode is mandatory:** every visible surface must have `dark:` variants.
- **Mockup export rule:** inside nodes captured by `useMockupExport`, use explicit hex (inline style or literal classes like `bg-[#25D366]`) — `dark:` classes and theme variables don't serialize reliably to PNG.

### Tool behavior
- **Instant feedback:** state-driven; no submit buttons for transforms.
- **Original file safety:** never mutate the user's `File`; work on copies in memory.
- **Every tool exports its result** (download and/or copy). If a tool only displays, it's not done.
- **Errors are messages, not crashes:** bad JSON, empty input, oversized files → inline hint text, never a white screen.
- **Honest scope:** if a "compressor" is lossless-structural or a "font converter" outputs a glyph sheet, say so in the UI. Never claim what the tool doesn't do.
- External network calls are allowed only inside `youtube-thumbnail-grabber`, `vimeo-thumbnail-grabber`, `instagram-photo-downloader` (documented fetch cases) and Google Fonts `<link>` for typography tools.

### Dependencies
- Pinned in `package.json`. **No new dependency without justification** in the PR/commit: what it does, KB cost, license (MIT/Apache only), and why it can't be done with the existing kit.

## 3. Project Structure Rules

```
app/            routing + SEO only. No tool logic here (thin templates only).
components/ui/  the ONLY shared UI layer. Changes here affect 117 tools — needs a reason.
components/tools/<cat>/   one file per tool + optional _helper.tsx per folder.
lib/            pure functions + typed registries. No JSX except none — keep it logic.
scripts/        build-time utilities (registry generator).
docs (root .md) PRD/ARCHITECTURE/RULE/DESIGN/TASKS/PROJECT_MEMORY — update when reality changes.
```

- Folder helpers are private: `social/_chat.tsx` may be imported by social tools; nothing else may import it. Cross-category sharing = promote to `ui/kit.tsx` (consciously).
- `registry.ts` is **generated** — never hand-edit it; run `scripts/gen-registry.py`.
- Files prefixed `_` are helpers, never tool pages.

## 4. Definition of Done (per tool)

- [ ] Renders on `/tools/<slug>` with correct name/category
- [ ] Real client-side logic — no mock/placeholder behavior
- [ ] Download/copy works; original input untouched
- [ ] Dark mode + mobile (≤360px) look right
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` passes (117 SSG pages, no type errors)

## 5. Git & collaboration

- Commit convention: `feat(tools): add qr-code-generator`, `fix(ui): kit range slider a11y`, `docs: prd v1.1`.
- Never commit generated artifacts: `.next/`, `node_modules/` (see `.gitignore`).
- One logical change per PR/commit; tool batches grouped by category.
