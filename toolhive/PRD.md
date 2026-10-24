# PRD — ToolHive

> **Version:** 1.0 · **Status:** MVP shipped (117 tools) · **Date:** October 2026

---

## 1. Product Overview

**ToolHive** is a free, all-in-one online toolbox: **117 browser-based utilities** covering text, images, PDFs, social media mockups, security, coding, CSS and colors — collected under one fast, clean, searchable website with a consistent design system.

**Tagline:** *Every online tool in one hive.*

**Positioning:** Most "free online tool" sites are ad-heavy, slow, upload your files to a server, and cap usage behind signups and paywalls. ToolHive flips this: **every tool runs 100% client-side in the browser**, so it is faster, private by architecture, unlimited by nature, and costs almost nothing to operate.

## 2. Website Overview

| Aspect | Detail |
|---|---|
| Tool count (MVP) | 117 tools across 9 categories |
| Processing | 100% client-side (JavaScript in the visitor's browser) |
| Accounts | None required; no login anywhere |
| Payments | None; all tools free, no premium tier in MVP |
| Ads | Not included in MVP (can be layered later without code changes) |
| Offline behavior | After a tool page loads, it keeps working without internet |
| SEO | Per-tool landing pages with unique title, meta, FAQ and JSON-LD structured data; sitemap + robots generated automatically |

**Categories & tool counts**

| Category | Tools | Examples |
|---|---|---|
| Social Media | 45 | WhatsApp/Telegram/iMessage chat generators, Instagram/TikTok/YouTube post & story generators, profile & comment generators |
| Coding | 13 | JSON tree viewer, formatters, minifiers, encoders, code-to-image |
| Image | 13 | Cropper, resizer, filters, color extractor, SVG converters |
| CSS | 12 | Gradient, box-shadow, glassmorphism, loader, clip-path generators |
| PDF | 9 | Merge, split, compress, edit, sign, fill forms, whiteout |
| Text | 8 | Text-to-handwriting, case converter, bionic reading, letter counter |
| Security | 8 | Password generator, MD5/SHA-1/SHA-2 family hashes, JWT codec |
| Color | 5 | Palette engine, hex/rgba converters, shades, mixer |
| Miscellaneous | 4 | QR code, barcode, list randomizer, test IBAN |

## 3. Problem Statement

1. **Fragmentation:** everyday small tasks (resize an image, split a PDF, make a QR code, mock up a tweet) are scattered across dozens of single-tool sites, each with its own cluttered UI and privacy posture.
2. **Privacy risk:** most competitor tools upload your files or text to a server to process them — a real risk for contracts, IDs, and private conversations.
3. **Dark patterns:** signups, watermarks, "3 free uses per day", and full-screen ads are the norm.
4. **Mobile experience:** most tool sites are unusable on phones.

**Why now:** modern browsers (Canvas, Web Crypto, pdf-lib in WASM-free JS, File API) can do nearly all of this locally at native speed. Server-side processing is no longer needed for 95% of small-file utilities.

## 4. Goals

### Business / product goals
- **G1** — Ship a production-ready MVP with 117 working tools in one consistent UI.
- **G2** — Achieve organic search growth via per-tool SEO pages and structured data.
- **G3** — Keep infrastructure cost near zero: static hosting (Vercel/Netlify), no file servers, no processing workers.
- **G4** — Build a brand ("ToolHive") that is memorable and extensible to future tools.

### Non-goals (MVP)
- User accounts, cloud sync, or history (planned Phase 3 — see TASKS.md).
- Server-side processing for files too large for the browser.
- Native mobile apps (the web app is fully responsive).

### Success metrics (suggested)
- Tool completion rate (opened → interacted) > 40%
- Tools per session > 1.5
- Core Web Vitals: LCP < 2.5s on 4G, CLS < 0.1
- Organic landing page indexation: all 117 tool pages + 9 category pages in Google within 30 days

## 5. Target Users

| Persona | Need | Tools they hit first |
|---|---|---|
| **Students** (12–24) | Quick homework help: handwriting conversion, letter counting, lorem ipsum, randomizer | Text, misc |
| **Social media managers** | Mock up posts/chats for clients & approvals without using real accounts | Social (45 tools) |
| **Front-end developers** | Generate CSS, minify code, test JSON, share code screenshots | CSS, coding |
| **Office workers** | Merge/split/compress PDFs containing private documents | PDF |
| **Designers** | Palettes, color conversion, SVG blobs, image color extraction | Color, image |
| **Everyday users** | Resize a photo, make a QR, pick a strong password | Image, security, misc |

**Common trait:** they want the result in under 30 seconds, without signup, and without worrying about where their file ends up.

## 6. Core Features (MVP)

### 6.1 The toolbox
- **117 functional tools**, each a self-contained client-side component (see Website Overview table).
- **Instant results:** every tool updates live as you type/change settings — no "submit" round-trips.
- **Downloads:** every tool exports its result (PNG/SVG/PDF/TXT/JSON/ZIP of values as appropriate).
- **Zero-upload guarantee:** files never leave the device. Privacy policy reflects the architecture.

### 6.2 Discovery
- **Global search** in the header (fuzzy, live, keyboard-friendly).
- **9 category hub pages** with tool cards.
- **Homepage:** hero, featured tools, category sections with previews.
- **Related tools** on every tool page.

### 6.3 SEO engine (built-in, not bolted on)
- Unique per-tool pages: H1, intro ("What is…"), numbered how-to, FAQ.
- JSON-LD: `SoftwareApplication` + `FAQPage` schema on every tool.
- Auto-generated `sitemap.xml`, `robots.txt`, web manifest, canonical URLs, Open Graph/Twitter cards.

### 6.4 Experience
- **Dark mode** with system-preference detection + manual toggle (persisted).
- **Fully responsive**, thumb-friendly controls on mobile.
- **Fast:** static prerendering (SSG) of all 128 public pages; tool code is lazy-loaded per tool.

### 6.5 Trust & legal pages
- About, Privacy Policy (honest: "we never see your data"), Terms (mockup-use disclaimer), Contact.

## 7. Future scope (post-MVP)

Summarized here, detailed in `TASKS.md`:
- **Phase 2:** analytics, more tools, i18n, PWA offline install, ad slots (optional).
- **Phase 3:** optional authentication (NextAuth.js) for favorites/history sync, saved presets, API access, Pro tier.

## 8. Out-of-scope risks & mitigations

| Risk | Mitigation |
|---|---|
| Browser memory limits on huge PDFs/images | Document practical limits; graceful errors; never lose the original file |
| Social mockups used for deception | Terms + on-tool disclaimers (parody/education only) |
| Single dependency breaks (pdf-lib etc.) | Dependencies pinned; tools isolated so one failure can't cascade |

---

*Companion documents: `ARCHITECTURE.md` (how it's built), `DESIGN.md` (visual system), `RULE.md` (contribution rules), `TASKS.md` (roadmap & phases), `PROJECT_MEMORY.md` (build log & state).*
