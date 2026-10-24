# ToolHive Secrets Policy

**Current state: the repository contains zero secrets.** (Verified by scan: no API keys, tokens,
passwords, or credentials in any tracked file. The site is a static, stateless build.)

## Why there is nothing to steal

- No backend → no API keys at runtime.
- No auth → no JWT secrets, no password hashes.
- No storage → no bucket credentials.
- No webhooks → no signing secrets.

## Rules the moment secrets become necessary (Phase 2)

1. **Never commit.** Secrets live in `.env.local` (already gitignored via `.env*`) and in the
   host's encrypted environment storage (Vercel → Project Settings → Environment Variables).
2. **Never in client bundles.** Any variable referenced in client components is public by
   definition. Server-only secrets must live in `app/api` server code only. Prefix and check:
   server secrets use no `NEXT_PUBLIC_` prefix.
3. **Never in localStorage.** Tokens for the future auth flow go in `httpOnly`, `Secure`,
   `SameSite=Strict` cookies. LocalStorage is readable by any XSS and is forbidden for tokens.
4. **JWT secrets**: minimum 32-byte random values, rotated on a schedule, distinct per environment
   (dev/staging/prod), never the string "secret".
5. **Default credentials**: none, ever. First-boot admin accounts must be created with forced
   password change; CI must fail if any default password constant is found.
6. **Client-safe keys**: if a third-party service requires a public key in the browser, document
   it in this file with the reason it is safe (e.g. publishable Stripe key) — anything not
   documented gets removed.
