"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Select, Toggle, Output, StatPill } from "@/components/ui/kit";

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\u00A0": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "°": "&deg;",
  "±": "&plusmn;",
  "µ": "&micro;",
  "¶": "&para;",
  "•": "&bull;",
  "…": "&hellip;",
  "′": "&prime;",
  "″": "&Prime;",
  "–": "&ndash;",
  "—": "&mdash;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "←": "&larr;",
  "↑": "&uarr;",
  "→": "&rarr;",
  "↓": "&darr;",
  "↔": "&harr;",
  "♥": "&hearts;",
  "♦": "&diams;",
  "♣": "&clubs;",
  "♠": "&spades;",
};

const REVERSE_NAMED_ENTITIES: Record<string, string> = {};
Object.entries(NAMED_ENTITIES).forEach(([char, entity]) => {
  REVERSE_NAMED_ENTITIES[entity] = char;
  // Also lowercase variant
  REVERSE_NAMED_ENTITIES[entity.toLowerCase()] = char;
});

function escapeHtml(
  text: string,
  format: "named" | "decimal" | "hex",
  escapeAllNonAscii: boolean
): string {
  if (!text) return "";

  return text.replace(/[\s\S]/g, (char) => {
    // Basic structural html chars always escape
    if (char === "&" || char === "<" || char === ">" || char === '"' || char === "'") {
      if (format === "named") return NAMED_ENTITIES[char];
      if (format === "decimal") return `&#${char.charCodeAt(0)};`;
      return `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`;
    }

    // Check named entities list
    if (format === "named" && NAMED_ENTITIES[char]) {
      return NAMED_ENTITIES[char];
    }

    // Non-ASCII check
    const code = char.charCodeAt(0);
    if (escapeAllNonAscii && code > 127) {
      if (format === "decimal") return `&#${code};`;
      if (format === "hex") return `&#x${code.toString(16).toUpperCase()};`;
      return NAMED_ENTITIES[char] || `&#${code};`;
    }

    return char;
  });
}

function unescapeHtml(text: string): string {
  if (!text) return "";

  // 1. Replace named entities
  let result = text.replace(/&[a-zA-Z0-9]+;/g, (entity) => {
    return REVERSE_NAMED_ENTITIES[entity] || REVERSE_NAMED_ENTITIES[entity.toLowerCase()] || entity;
  });

  // 2. Replace decimal numeric entities
  result = result.replace(/&#(\d+);/g, (_, codeStr) => {
    const code = parseInt(codeStr, 10);
    return isNaN(code) ? _ : String.fromCharCode(code);
  });

  // 3. Replace hex numeric entities
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hexStr) => {
    const code = parseInt(hexStr, 16);
    return isNaN(code) ? _ : String.fromCharCode(code);
  });

  return result;
}

export default function HtmlEncoderDecoder() {
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [entityFormat, setEntityFormat] = useState<"named" | "decimal" | "hex">("named");
  const [escapeAllNonAscii, setEscapeAllNonAscii] = useState(false);
  const [inputText, setInputText] = useState(
    `<div class="card">\n  <h1>Title & Subtitle</h1>\n  <p>Price: 100€ • Copyright © 2026</p>\n</div>`
  );

  const outputText = useMemo(() => {
    if (mode === "escape") {
      return escapeHtml(inputText, entityFormat, escapeAllNonAscii);
    } else {
      return unescapeHtml(inputText);
    }
  }, [inputText, mode, entityFormat, escapeAllNonAscii]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={outputText}
            label={mode === "escape" ? "Escaped HTML Output" : "Unescaped Text"}
            filename={mode === "escape" ? "escaped.html" : "unescaped.html"}
            mono
          />

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Input Chars" value={inputText.length} />
            <StatPill label="Output Chars" value={outputText.length} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Operation">
            <Select
              value={mode}
              onChange={(v) => setMode(v as "escape" | "unescape")}
              options={[
                { value: "escape", label: "Escape (Text → Entities)" },
                { value: "unescape", label: "Unescape (Entities → Text)" },
              ]}
            />
          </Field>

          {mode === "escape" ? (
            <Field label="Entity Style">
              <Select
                value={entityFormat}
                onChange={(v) => setEntityFormat(v as "named" | "decimal" | "hex")}
                options={[
                  { value: "named", label: "Named Entities (&amp;, &copy;)" },
                  { value: "decimal", label: "Decimal Entities (&#38;, &#169;)" },
                  { value: "hex", label: "Hex Entities (&#x26;, &#xA9;)" },
                ]}
              />
            </Field>
          ) : (
            <div className="flex items-center text-xs text-slate-500 pt-6">
              Handles named, decimal (&#38;) and hex (&#x26;) HTML entities.
            </div>
          )}
        </div>

        {mode === "escape" && (
          <Toggle
            checked={escapeAllNonAscii}
            onChange={setEscapeAllNonAscii}
            label="Escape all non-ASCII characters (€, ©, ™, etc.)"
          />
        )}

        <Field label={mode === "escape" ? "Input HTML / Text" : "Input HTML with Entities"}>
          <TextArea
            value={inputText}
            onChange={setInputText}
            placeholder="Type or paste text here..."
            rows={8}
            mono
          />
        </Field>
      </div>
    </ToolShell>
  );
}
