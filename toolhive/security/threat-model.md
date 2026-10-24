# ToolHive Threat Model

**Scope:** ToolHive — a 100% client-side, statically generated (SSG) toolbox of 117 tools.
**Stack:** Next.js 15 SSG, no backend API, no database, no auth, no file uploads to servers.
**Last reviewed:** 2026-10-23 (post-hardening review)

## 1. System description

Everything runs in the visitor's browser:

```
Browser (untrusted UI + all tool logic)
   │  loads static HTML/JS/CSS from CDN
   ▼
Static hosting (Vercel) ── serves prebuilt pages only
   │
   └── (optional) fonts.googleapis.com for the Font Pair Finder preview
```

There is **no server-side execution**: no API routes, no DB, no sessions.
User files are processed in-memory (ArrayBuffer / Blob) and never leave the device.

## 2. Assets

| Asset | Location | Impact if abused |
|---|---|---|
| User's local files | Browser memory only | Privacy breach — mitigated by never uploading |
| Browser session integrity | DOM of tool pages | XSS could steal clipboard data or deface output |
| Site reputation / SEO | Search index | Trust loss, ranking penalties |
| Dependency chain | npm supply chain | Malicious code shipped to all visitors |

## 3. Threat actors

1. **Curious/malicious visitor** — pastes hostile input (SVG with scripts, HTML into the bionic reader) to try to execute code in their own session (self-XSS) or craft a link that executes on someone else's session.
2. **Supply-chain attacker** — publishes/compromises an npm package we depend on.
3. **Content scraper / clone attacker** — copies the site; a legal/brand issue, not a runtime threat.
4. **Future self (Phase 2)** — when auth + DB are added, the threat model must be re-done (see security-checklist "Phase 2" items).

## 4. Threat analysis (STRIDE-lite)

| Threat | Vector | Severity | Mitigation in place |
|---|---|---|---|
| XSS via tool previews | `dangerouslySetInnerHTML` sites | HIGH | All user-controlled SVG/HTML is sanitized (`lib/sanitize.ts`); uploaded-SVG preview renders through `<img>` data URL (scripts never execute); bionic reader escapes all text. JSON-LD is static, build-time only. |
| Malicious file upload | 75 file-drop zones | MEDIUM | Files are read as ArrayBuffers client-side, never uploaded, never `eval`'d. Extension allowlists (`accept=`) on all file-type-specific tools; "any file" accepted only by design for hashers/base64. |
| Supply chain | npm deps | MEDIUM | Dependency set kept tiny; `npm audit` run each build; known dev-chain advisory documented + tracked in security-checklist. No runtime deps in the vulnerable chain. |
| CSP bypass / clickjacking | embedding, inline script abuse | MEDIUM | CSP: `object-src 'none'`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `base-uri 'self'`, `form-action 'self'`. Inline script allowance is limited to Next.js hydration (no third-party scripts allowed). |
| Data exfiltration | network calls | LOW | CSP `connect-src 'self'` blocks arbitrary outbound requests; tools are 100% local. Only external fetch is Google Fonts CSS (style-src allowlisted). |
| Transport attacks | MITM | HIGH impact / handled | HSTS (2 years, preload) + HTTPS enforced by Vercel; no mixed content (CSP blocks it). |
| Enumerating admin surfaces | hidden pages | INFO | No admin surface exists at all — nothing to enumerate. |
| Secret leakage | repo/config | HIGH impact / handled | Repo contains zero secrets (verified by scan); `.env*` gitignored; Vercel env storage documented in secrets.md. |

## 5. What deliberately does NOT exist

- No API routes, no database, no server sessions, no webhooks, no admin panel.
This removes entire OWASP classes: SQL injection, CSRF, IDOR, broken auth, SSRF, webhook forgery. The checklist maps each of these to "N/A by architecture" so a future contributor understands why, and what must be added the moment Phase 2 (auth) lands.

## 6. Re-review triggers

- Adding any `app/api/*` route, any database, any auth, any third-party script, or any file-upload-to-server feature.
