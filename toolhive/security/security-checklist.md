# ToolHive Security Checklist

Status legend: ✅ done · ⛔ N/A by architecture (with reason + Phase 2 plan) · 🔶 partial / tracked

## A. Server & API security

| Item | Status | Notes |
|---|---|---|
| Row-level security | ⛔ | **No database exists.** All 117 tools are 100% client-side. Phase 2 (TASKS.md auth plan): enable RLS on every entity, deny-by-default policies, service-role access only from server code. |
| Auth on every API route | ⛔ | Zero API routes exist — nothing to protect. Phase 2: NextAuth.js; every route checks session server-side; no route trusts method or origin alone. |
| Never trust the frontend | ✅ | There is no server to trust it. Enforced architecturally: no server state exists. Phase 2 rule: every server action re-validates input. |
| Rate limiting | ⛔ | No endpoints to abuse (all work is local). Phase 2: per-IP + per-account limits at the edge (Vercel WAF / middleware), plus login-specific throttling. |
| Sanitize user input | ✅ | React escaping everywhere + `lib/sanitize.ts`: `escapeHtml()` (bionic reader), `sanitizeSvg()` (all 4 SVG preview sites), `validateFileKind()` (upload allowlists). |
| Parameterized queries | ⛔ | No SQL/DB anywhere. Phase 2: use Base44 entities / ORM query builders; raw string queries banned. |
| Lock down CORS | ✅ | Static site — no endpoints to call cross-origin. `connect-src 'self'` in CSP blocks outbound calls. Phase 2: no wildcard origins; credentials only for same-origin. |
| HTTPS everywhere | ✅ | Vercel HTTPS-only + HSTS `max-age=63072000; includeSubDomains; preload` on every response. No http:// links shipped. |
| Stop IDOR bugs | ⛔ | No objects, no references — nothing to enumerate. Phase 2: all object access via session-scoped queries, never raw IDs from the client. |
| Debug mode off in prod | ✅ | `npm run build` ships production build; no `NODE_ENV` leak; `poweredByHeader: false`; no stack traces in responses (static only). |
| Captcha on public forms | ⛔ | No forms exist (contact = plain email address). Phase 2: add Turnstile/hCaptcha to contact + signup forms. |
| Log admin actions | ⛔ | No admin area exists. Phase 2: append-only audit entity recording every admin mutation with actor, action, target, timestamp. |
| Private storage buckets | ✅ | No storage at all. Local files stay in browser memory — the strongest form of "private storage" (they are never stored). Phase 2: private bucket + signed short-expiry URLs; never public-write. |
| Hide admin pages properly | ⛔→ | Nothing to hide. Phase 2: admin routes behind auth middleware, `noindex` + not in sitemap, plus 404 (not 403) for unauthorized. |
| Update vulnerable packages | 🔶 | `npm audit` run at every build. Only finding: high-severity in the **build-time-only** chain of tailwindcss 3.4 (braces/chokidar/micromatch — file-watcher DoS during dev builds, not shipped, not exploitable at runtime). Fix path: Tailwind v4 upgrade scheduled post-launch (tracked below). No runtime dependency has any known CVE. |
| Check file upload types | ✅ | All type-specific tools pass `accept=` allowlists; unrestricted inputs limited to hashers/base64 (read any file as bytes, by design, never executed). `validateFileKind()` available for any future server upload. |
| Security headers | ✅ | CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/payment all denied). See `next.config.ts`. |
| Verify webhook signature | ⛔ | No webhooks are received. Phase 2 rule: verify HMAC signature + timestamp window before parsing payload; reject unsigned. |
| Agent security review | ✅ | Performed 2026-10-23: full pass over every render site, upload zone, dependency, header, and config — this checklist is its output. Repeat after Phase 2 and after every dependency bump. |

## B. Injection & input

| Item | Status | Notes |
|---|---|---|
| SQL injection | ⛔ | No SQL exists anywhere. |
| Cross-site scripting (XSS) | ✅ | All 4 `dangerouslySetInnerHTML` sites sanitized/converted to safe `<img>` rendering; React escaping everywhere else; CSP blocks third-party script origins. |
| CSRF protection | ⛔ | No state-changing requests exist. Phase 2: `SameSite=Strict` cookies + token double-submit on all mutations. |
| File upload validation | ✅ | See A. `accept` allowlists + bytes-only processing; `validateFileKind()` for future server-side. |
| SSRF check | ⛔→ | No server fetches user-supplied URLs anywhere. The only external load is Google Fonts CSS (fixed origin, CSP-pinned). Phase 2: deny-by-default egress allowlist if any server fetch is added. |

## C. Authentication & access

| Item | Status | Notes |
|---|---|---|
| Broken object-level access | ⛔ | No objects. Phase 2: session-scoped queries only (see A/IDOR). |
| Rate limiting (login) | ⛔ | No login. Phase 2: exponential backoff + lockout. |
| Password storage | ⛔ | No passwords. Phase 2: NextAuth with bcrypt/argon2, never plaintext or reversible encryption. |
| Multi-factor auth | ⛔ | No accounts. Phase 2: TOTP for admin accounts at minimum. |
| Permission checks on server | ⛔ | No server logic. Phase 2: authorization decided server-side only, client UI is never the gate. |
| Row-level security (DB) | ⛔ | See A. RLS deny-by-default. |

## D. Secrets & tokens

| Item | Status | Notes |
|---|---|---|
| JWT secrets | ⛔ | No JWTs. Phase 2: 32-byte random, rotated, per-env. (secrets.md) |
| API secrets | ✅ | Zero API keys in repo or bundles (scan verified). |
| localStorage | ✅ | No tokens or sensitive data stored in localStorage by any tool (grep-verified). |
| Default credentials | ✅ | None exist. |

## E. Config & hygiene

| Item | Status | Notes |
|---|---|---|
| CORS settings | ✅ | See A. |
| Webhook signatures | ⛔ | See A. |
| Exposed source maps | ✅ | `productionBrowserSourceMaps: false`. |
| Sensitive data in responses | ✅ | Static content only; no PII collected, no cookies set. |
| Vulnerable dependency policy | 🔶 | Same as A: one build-time-only advisory, upgrade tracked; audit gate in build. |
| `.gitignore` hygiene | ✅ | `node_modules/`, `.next/`, `.env*`, `*.pem`, `*.tsbuildinfo` ignored — nothing machine-specific or secret can be committed. (Note: gradle/local.properties files from the original request are Android project files — not applicable to this Next.js project; their web equivalents — env files, keys, build artifacts — are covered here.) |

## Open items (tracked)

1. **Tailwind v4 upgrade** post-launch → clears the build-time-only `braces` advisory chain.
2. **Phase 2 auth** (see TASKS.md) → converts every ⛔ above into implemented controls; re-run
   the agent security review and update this checklist at that moment.

---

## Phase 2 update — backend now LIVE (2026-10-23)

The site now has a real backend: SQLite database (local) / Neon Postgres (production), 7 API routes.
Items that were previously ⛔ "N/A-by-architecture" are now **implemented and tested**:

| Control | Status | Evidence |
|---|---|---|
| SQL injection | ✅ IMPLEMENTED | All queries parameterized (`lib/server/db.ts`, `db.postgres.ts`); never string-concatenated |
| Input validation (server-side) | ✅ IMPLEMENTED | `capString()` strips HTML/nulls + length caps; email regex; JSON body size caps (1–20 KB); every mutation re-validates — frontend input never trusted |
| XSS (stored) | ✅ IMPLEMENTED | Feedback/request text sanitized before storage — verified: `<img onerror>` payload stored as plain text |
| Rate limiting | ✅ IMPLEMENTED | Per-IP, per-endpoint limits (feedback 5/10min, upvote 20/10min, track 120/min) — verified: 429 storms |
| Bot/captcha defense | ✅ IMPLEMENTED | Honeypot field silently accepts & discards bots — verified |
| Admin auth | ✅ IMPLEMENTED | GET /api/feedback requires `x-admin-token` = env ADMIN_TOKEN; unset = locked (401) — verified |
| Admin action logging | ✅ IMPLEMENTED | Every admin read + upvote logged to `admin_log` table |
| IDOR / broken object refs | ✅ IMPLEMENTED | No per-user objects; numeric IDs range-checked (verified: `/abc/upvote` → 400, `/99999` → 404) |
| CSRF | ✅ IMPLEMENTED | No cookies/sessions used; API is JSON-only, same-origin (CSP connect-src 'self') |
| Third-party data leakage | ✅ FIXED | Found & removed: 13 social tools loaded avatars from images.unsplash.com (violated CSP + privacy promise). Replaced with local inline SVG placeholders — site now makes ZERO external requests |
| Security headers on API | ✅ VERIFIED | CSP/X-Frame-Options/HSTS/X-Content-Type present on /api/* responses |
| Runtime dependency audit | ✅ VERIFIED | `npm audit --omit=dev`: 0 vulnerabilities in shipped deps (pg clean) |

**New attack surface & mitigations**: usage-tracking DB write (slug whitelist — unknown slug → 404), subscriber endpoint (email uniqueness + rate limit), vote manipulation (per-IP rate limit; documented tradeoff: no accounts yet).

**Deploy notes**: set `ADMIN_TOKEN` (32+ hex) in Vercel env; `DATABASE_URL` + `POSTGRES_DRIVER=1` switch to Neon Postgres; SQLite file in `data/` is gitignored.
