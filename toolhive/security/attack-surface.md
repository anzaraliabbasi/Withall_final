# ToolHive Attack Surface Inventory

Every place untrusted data can enter the system, and the control that guards it.

## 1. Entry points

| # | Entry point | Count | Input type | Guard |
|---|---|---|---|---|
| 1 | File-drop zones | 75 sites | local files (ArrayBuffer/Blob) | Extension allowlists on type-specific tools; hashers accept any file **by design** (read-only byte access, never uploaded/executed). `validateFileKind()` in `lib/sanitize.ts` for future use. |
| 2 | Text inputs / textareas | ~300 across 117 tools | user strings | React auto-escaping; explicit `escapeHtml()` where raw HTML is composed (bionic reader). |
| 3 | SVG rendering | 4 tools | generated or user-uploaded SVG | `sanitizeSvg()` strips `<script>`, `foreignObject`, `iframe`, `handler`, `on*=` handlers, `javascript:` URLs. Uploaded-SVG preview renders via `<img>` data URL (scripts can never execute). |
| 4 | JSON-LD structured data | all tool pages | build-time constants | Static, generated at build; no runtime injection possible. |
| 5 | URL/query params | none | — | Tools read no query params (no `searchParams` consumption anywhere). |
| 6 | External requests | 1 host | fonts.googleapis.com CSS | CSP `style-src` allowlisted to exactly this host; everything else blocked by `connect-src 'self'`. |

## 2. Executable code surfaces

| Surface | Exposure | Control |
|---|---|---|
| Client JS bundles | all visitors | No `eval`, no `new Function`, no remote code loading (`script-src 'self'` blocks third-party). |
| Inline scripts | Next.js hydration payloads only | Kept minimal; `script-src 'unsafe-inline'` required by SSG; third-party origins rejected. |
| Source maps | disabled | `productionBrowserSourceMaps: false` — nothing to reverse beyond shipped code. |
| Service workers | none | not registered anywhere. |
| Server code | none | zero API routes; nothing to attack server-side. |

## 3. Transport

- HTTPS-only hosting (Vercel), HSTS `max-age=63072000; includeSubDomains; preload`.
- CSP + `upgrade-insecure-requests` semantics: no `http://` subresources exist.

## 4. Dependency chain (runtime exposure only)

| Package | Used for | Ships to browser? |
|---|---|---|
| react / react-dom | UI | yes |
| next | framework | yes |
| pdf-lib | PDF tools | yes (lazy-loaded chunk) |
| qrcode | QR generator | yes (lazy-loaded) |
| jsbarcode | barcode generator | yes (lazy-loaded) |
| html-to-image | mockup export | yes (lazy-loaded) |
| tailwindcss, typescript, autoprefixer | **build-time only** | no |

Known advisories affect **build-time-only** packages (tailwindcss 3.4 dev chain: braces/micromatch/chokidar).
No shipped/runtime dependency carries a known vulnerability. Upgrade path documented in security-checklist.md.

## 5. Residual risk statement

The remaining realistic risks are (1) a future commit introducing an API route or raw HTML rendering,
and (2) npm supply-chain compromise. Controls: security-checklist gates on PR + `npm audit` in build,
minimal dependency set, and this inventory kept up to date.
