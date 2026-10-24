"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, TextInput, Select, Toggle, Output, StatPill } from "@/components/ui/kit";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
  "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
  "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves"
]);

function slugify(
  text: string,
  separator: string,
  lowercase: boolean,
  removeStopWords: boolean,
  stripAccents: boolean,
  strictAsciiOnly: boolean
): string {
  if (!text) return "";

  let str = text.trim();

  // Normalize Unicode accents (e.g. café -> cafe)
  if (stripAccents) {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  if (lowercase) {
    str = str.toLowerCase();
  }

  if (strictAsciiOnly) {
    // Replace non-ascii alphanumeric with space
    str = str.replace(/[^a-zA-Z0-9\s_\-]/g, " ");
  } else {
    // Unicode aware: keep word chars across scripts (Arabic, Urdu, Chinese, etc.), replace symbols/punctuation with space
    // Matches symbols and punctuation
    str = str.replace(/[^\p{L}\p{N}\s_\-]/gu, " ");
  }

  // Split into words
  let words = str.split(/\s+/).filter(Boolean);

  if (removeStopWords) {
    words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    // Fallback if all words were stop words
    if (words.length === 0 && text.trim().length > 0) {
      words = text.trim().toLowerCase().split(/\s+/);
    }
  }

  return words.join(separator);
}

export default function UrlSlugGenerator() {
  const [inputText, setInputText] = useState(
    "How to Create Clean & SEO-Friendly URLs in 2026! (Complete Guide for Beginners)"
  );
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [stripAccents, setStripAccents] = useState(true);
  const [strictAsciiOnly, setStrictAsciiOnly] = useState(false);
  const [baseUrl, setBaseUrl] = useState("https://example.com/blog/");

  const slug = useMemo(() => {
    return slugify(
      inputText,
      separator,
      lowercase,
      removeStopWords,
      stripAccents,
      strictAsciiOnly
    );
  }, [inputText, separator, lowercase, removeStopWords, stripAccents, strictAsciiOnly]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output text={slug} label="Generated Slug" filename="slug.txt" mono />

          <Field label="Live URL Preview">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 break-all dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <span className="text-slate-400">{baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}</span>
              <span className="font-bold text-hive-600 dark:text-hive-400">{slug}</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Slug Length" value={slug.length} />
            <StatPill label="Word Count" value={slug ? slug.split(separator).filter(Boolean).length : 0} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Text">
          <TextArea
            value={inputText}
            onChange={setInputText}
            placeholder="Type or paste headline or title here..."
            rows={5}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Separator">
            <Select
              value={separator}
              onChange={setSeparator}
              options={[
                { value: "-", label: "Hyphen (-)" },
                { value: "_", label: "Underscore (_)" },
                { value: ".", label: "Dot (.)" },
                { value: "/", label: "Slash (/)" },
              ]}
            />
          </Field>

          <Field label="Base URL (For Preview)">
            <TextInput
              value={baseUrl}
              onChange={setBaseUrl}
              placeholder="https://example.com/"
              mono
            />
          </Field>
        </div>

        <div className="space-y-3 pt-2">
          <Toggle checked={lowercase} onChange={setLowercase} label="Convert to Lowercase" />
          <Toggle checked={stripAccents} onChange={setStripAccents} label="Strip Diacritics / Accents (café → cafe)" />
          <Toggle checked={removeStopWords} onChange={setRemoveStopWords} label="Remove English Stop Words (the, and, for...)" />
          <Toggle checked={strictAsciiOnly} onChange={setStrictAsciiOnly} label="Strict ASCII Only (Remove Non-Latin scripts)" />
        </div>
      </div>
    </ToolShell>
  );
}
