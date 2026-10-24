"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, TextInput, Btn } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

interface FontPair {
  id: string;
  heading: string;
  body: string;
  headingW: string[];
  bodyW: string[];
  vibes: string[];
  use: string;
}

const PAIRS: FontPair[] = [
  { id: "playfair-inter", heading: "Playfair Display", body: "Inter", headingW: ["700", "900"], bodyW: ["400", "500"], vibes: ["elegant", "editorial", "luxury"], use: "Fashion, magazines, premium brands" },
  { id: "merriweather-lato", heading: "Merriweather", body: "Lato", headingW: ["700", "900"], bodyW: ["400", "400i"], vibes: ["readable", "classic", "trust"], use: "Blogs, news, long-form articles" },
  { id: "montserrat-opensans", heading: "Montserrat", body: "Open Sans", headingW: ["600", "700"], bodyW: ["400", "600"], vibes: ["modern", "corporate", "friendly"], use: "Business sites, startups, SaaS landing pages" },
  { id: "poppins-roboto", heading: "Poppins", body: "Roboto", headingW: ["500", "700"], bodyW: ["300", "400"], vibes: ["geometric", "tech", "clean"], use: "Apps, dashboards, developer tools" },
  { id: "oswald-roboto-slab", heading: "Oswald", body: "Roboto Slab", headingW: ["500", "700"], bodyW: ["400"], vibes: ["bold", "sporty", "impact"], use: "Sports, events, news headlines" },
  { id: "raleway-merriweather", heading: "Raleway", body: "Merriweather", headingW: ["600", "800"], bodyW: ["400"], vibes: ["sleek", "editorial", "modern"], use: "Portfolios, agencies, photography" },
  { id: "cormorant-proza", heading: "Cormorant Garamond", body: "Proza Libre", headingW: ["500", "700"], bodyW: ["400"], vibes: ["romantic", "luxury", "wedding"], use: "Weddings, invitations, boutique brands" },
  { id: "bebas-neue-lato", heading: "Bebas Neue", body: "Lato", headingW: ["400"], bodyW: ["300", "400", "700"], vibes: ["poster", "bold", "retro"], use: "Posters, music, marketing banners" },
  { id: "lobster-quicksand", heading: "Lobster", body: "Quicksand", headingW: ["400"], bodyW: ["400", "500"], vibes: ["playful", "fun", "kids"], use: "Kids brands, games, party sites" },
  { id: "dm-serif-source", heading: "DM Serif Display", body: "Source Sans 3", headingW: ["400"], bodyW: ["400", "600"], vibes: ["sophisticated", "editorial", "warm"], use: "Restaurant menus, storytelling brands" },
  { id: "space-grotesk-inter", heading: "Space Grotesk", body: "Inter", headingW: ["500", "700"], bodyW: ["400", "500"], vibes: ["futuristic", "tech", "crypto"], use: "Crypto, AI products, developer brands" },
  { id: "archivo-work-sans", heading: "Archivo", body: "Work Sans", headingW: ["600", "800"], bodyW: ["400", "500"], vibes: ["swiss", "neutral", "grid"], use: "Design systems, docs, minimal sites" },
  { id: "fraunces-nunito", heading: "Fraunces", body: "Nunito", headingW: ["600", "900"], bodyW: ["400", "600"], vibes: ["quirky", "warm", "organic"], use: "Food brands, artisans, DTC products" },
  { id: "cabin-karla", heading: "Cabin", body: "Karla", headingW: ["600", "700"], bodyW: ["400"], vibes: ["friendly", "casual", "accessible"], use: "Charities, communities, education" },
  { id: "syne-inconsolata", heading: "Syne", body: "Inconsolata", headingW: ["700", "800"], bodyW: ["400"], vibes: ["experimental", "creative", "brutalist"], use: "Art studios, galleries, experimental sites" },
  { id: "bitter-source", heading: "Bitter", body: "Source Sans 3", headingW: ["700"], bodyW: ["400"], vibes: ["sturdy", "readable", "slab"], use: "Legal, finance, documentation" },
  { id: "outfit-mulish", heading: "Outfit", body: "Mulish", headingW: ["500", "700"], bodyW: ["400", "500"], vibes: ["geometric", "startup", "clean"], use: "Landing pages, pitch decks, SaaS" },
  { id: "prata-jost", heading: "Prata", body: "Jost", headingW: ["400"], bodyW: ["400", "500"], vibes: ["high-fashion", "serif", "couture"], use: "Luxury e-commerce, beauty brands" },
  { id: "anton-inter", heading: "Anton", body: "Inter", headingW: ["400"], bodyW: ["400", "600"], vibes: ["impact", "condensed", "loud"], use: "Big headlines, sales pages, events" },
  { id: "caveat-poppins", heading: "Caveat", body: "Poppins", headingW: ["500", "700"], bodyW: ["400", "500"], vibes: ["handwritten", "personal", "inviting"], use: "Personal blogs, recipe sites, journals" },
];

const ALL_VIBES = ["elegant", "readable", "modern", "bold", "playful", "tech", "warm", "minimal", "editorial", "futuristic"];

export default function GoogleFontsPairFinder() {
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("");
  const [previewText, setPreviewText] = useState("The quick brown fox jumps");
  const [active, setActive] = useState<FontPair>(PAIRS[0]);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PAIRS.filter((p) => {
      const matchesQuery =
        !q ||
        p.heading.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.use.toLowerCase().includes(q) ||
        p.vibes.some((v) => v.includes(q));
      const matchesVibe = !vibe || p.vibes.some((v) => v === vibe);
      return matchesQuery && matchesVibe;
    });
  }, [query, vibe]);

  const linkTag = `<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${active.heading.replace(/ /g, "+")}:wght@${active.headingW.join(";")}&family=${active.body.replace(/ /g, "+")}:wght@${active.bodyW.join(";")}&display=swap" rel="stylesheet">`;
  const cssCode = `h1, h2, h3, .font-heading {
  font-family: "${active.heading}", serif;
}

body, p, .font-body {
  font-family: "${active.body}", sans-serif;
}`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live Preview</p>
            <p
              className="mt-3 break-words text-3xl leading-tight"
              style={{ fontFamily: `'${active.heading}', serif` }}
            >
              {previewText || "The quick brown fox jumps"}
            </p>
            <p
              className="mt-3 break-words text-sm leading-7"
              style={{ fontFamily: `'${active.body}', sans-serif` }}
            >
              {previewText ||
                "Pack my box with five dozen liquor jugs. Fonts pair well when heading and body share a similar skeleton."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">HTML snippet</p>
              <button
                type="button"
                className="text-xs font-semibold text-hive-600 hover:underline"
                onClick={async () => {
                  if (await copyToClipboard(linkTag)) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-5 text-slate-200">
              {linkTag}
            </pre>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">CSS</p>
            <pre className="mt-2 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-5 text-slate-200">
              {cssCode}
            </pre>
          </div>

          <p className="text-xs text-slate-500">
            Preview text renders in your browser once the fonts load from Google Fonts. Nothing is uploaded anywhere.
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Search pairs" hint="Font name, use case or vibe">
          <TextInput value={query} onChange={setQuery} placeholder="e.g. elegant, crypto, blog…" />
        </Field>

        <Field label="Filter by vibe">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant={vibe === "" ? "primary" : "outline"}
              onClick={() => setVibe("")}
              className="!px-3 !py-1.5 !text-xs"
            >
              All
            </Btn>
            {ALL_VIBES.map((v) => (
              <Btn
                key={v}
                variant={vibe === v ? "primary" : "outline"}
                onClick={() => setVibe(vibe === v ? "" : v)}
                className="!px-3 !py-1.5 !text-xs capitalize"
              >
                {v}
              </Btn>
            ))}
          </div>
        </Field>

        <Field label="Preview text" hint="Optional — try your own brand name">
          <TextInput value={previewText} onChange={setPreviewText} placeholder="The quick brown fox jumps…" />
        </Field>

        <Field label={`Matching pairs — ${results.length}`}>
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  active.id === p.id
                    ? "border-hive-500 bg-hive-50 dark:bg-hive-500/10"
                    : "border-slate-200 hover:border-hive-400 dark:border-slate-800"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold">{p.heading}</span>
                  <span className="text-xs text-slate-400">+ {p.body}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.use}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.vibes.map((v) => (
                    <span
                      key={v}
                      className="rounded-full bg-hive-100 px-2 py-0.5 text-[10px] font-semibold text-hive-700 dark:bg-hive-500/20 dark:text-hive-300"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {results.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                No pairs match that search. Try another vibe word.
              </p>
            )}
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
