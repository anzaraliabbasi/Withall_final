# Google Search Console Workflow (run monthly, first Monday)

Already automated in the codebase: `app/sitemap.ts` (117 tools + 9 categories + 4 info pages,
auto-updates when a tool is added), `app/robots.ts`, canonical tags, JSON-LD on every tool page.
After deploy: submit the sitemap once at search.google.com/search-console.

## 1. Pages losing clicks (keep the winners healthy)

- GSC → Performance → Pages → compare last 3 months vs previous 3 months.
- Filter: clicks change < -20%. For each loser:
  - Was the page renamed/redirected? (should never happen — tool URLs are permanent slugs)
  - Did a competitor outrank it? → refresh the FAQ block with genuinely better answers.
  - Is it seasonal? (social-media tools spike before holidays; note in calendar)
- Action rule: any page losing clicks 3 months in a row gets a content refresh (content brief
  template) within the month.

## 2. Queries stuck on page 2 (positions 11–30)

- GSC → Performance → Queries → filter position 11–30, impressions > 500, CTR < 3%.
- These are the fastest wins: the tool works, the query trusts you, the snippet under-sells.
- For each: improve title tag (put the query first), rewrite meta description with the benefit,
  add an H2 that answers the query literally, add internal links from 3 related tool pages.
- Re-check after 28 days; keep a tally of queries promoted from page 2 → page 1 top-5.

## 3. Dead pages (zero impressions for 90 days)

- If a tool page has 0 impressions after 90 days with sitemap submitted:
  - Check indexing status in URL Inspection (crawl, noindex, canonical).
  - If indexed but zero: the topic is dead weight — either rebuild the SEO block with a
    different primary keyword or accept it as a long-term catalog entry (tool pages cost nothing).
- Never delete a live tool URL — return 404s break internal links; prefer improving instead.

## 4. Internal links

- Every tool page already links to its category and 3–4 sibling tools (template-enforced).
- Monthly: pick the 10 best-performing tool pages and make sure they link to the 10 stuck-on-page-2
  pages with descriptive anchors (e.g. "convert PNG to JPG" not "click here").
- Run a crawler pass (Screaming Frog free tier) for: broken internal links, redirect chains,
  pages with > 100 links, orphan pages (none should exist — every tool is reachable from its category).

## 5. Index hygiene

- GSC → Pages → look for: duplicate content (should be none — canonicals everywhere),
  soft 404s, excluded-by-noindex pages (should be none except deliberate).
- Keep crawl budget clean: robots.txt already disallows nothing important; sitemap ping
  after each new tool release.
