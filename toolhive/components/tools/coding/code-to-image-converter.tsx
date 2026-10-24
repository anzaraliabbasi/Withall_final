"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextArea, Select, Range, Toggle, Btn, useMockupExport, StatPill } from "@/components/ui/kit";

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "import", "export", "from", "default", "class", "extends", "new", "try",
  "catch", "async", "await", "interface", "type", "def", "return", "import",
  "from", "as", "class", "public", "private", "protected", "static", "void",
  "null", "undefined", "true", "false", "boolean", "string", "number", "SELECT",
  "FROM", "WHERE", "JOIN", "ON", "GROUP", "BY", "ORDER", "LIMIT", "INSERT", "UPDATE"
]);

type ThemeKey = "slate" | "midnight" | "dracula" | "solarized" | "light";

interface ThemeStyle {
  label: string;
  outerBg: string;
  windowBg: string;
  headerBorder: string;
  textColor: string;
  keywordColor: string;
  stringColor: string;
  commentColor: string;
  numberColor: string;
  punctuationColor: string;
  lineNumberColor: string;
}

const THEMES: Record<ThemeKey, ThemeStyle> = {
  slate: {
    label: "Slate Dark",
    outerBg: "#0f172a",
    windowBg: "#1e293b",
    headerBorder: "#334155",
    textColor: "#f8fafc",
    keywordColor: "#38bdf8",
    stringColor: "#4ade80",
    commentColor: "#94a3b8",
    numberColor: "#fbbf24",
    punctuationColor: "#cbd5e1",
    lineNumberColor: "#475569",
  },
  midnight: {
    label: "Midnight",
    outerBg: "#030712",
    windowBg: "#111827",
    headerBorder: "#1f2937",
    textColor: "#f9fafb",
    keywordColor: "#f472b6",
    stringColor: "#a7f3d0",
    commentColor: "#6b7280",
    numberColor: "#fde047",
    punctuationColor: "#e5e7eb",
    lineNumberColor: "#374151",
  },
  dracula: {
    label: "Dracula",
    outerBg: "#282a36",
    windowBg: "#1e1f29",
    headerBorder: "#44475a",
    textColor: "#f8f8f2",
    keywordColor: "#ff79c6",
    stringColor: "#f1fa8c",
    commentColor: "#6272a4",
    numberColor: "#bd93f9",
    punctuationColor: "#8be9fd",
    lineNumberColor: "#44475a",
  },
  solarized: {
    label: "Solarized Light",
    outerBg: "#fdf6e3",
    windowBg: "#eee8d5",
    headerBorder: "#d33682",
    textColor: "#657b83",
    keywordColor: "#268bd2",
    stringColor: "#2aa198",
    commentColor: "#93a1a1",
    numberColor: "#d33682",
    punctuationColor: "#586e75",
    lineNumberColor: "#93a1a1",
  },
  light: {
    label: "GitHub Light",
    outerBg: "#f6f8fa",
    windowBg: "#ffffff",
    headerBorder: "#e1e4e8",
    textColor: "#24292e",
    keywordColor: "#d73a49",
    stringColor: "#032f62",
    commentColor: "#6a737d",
    numberColor: "#005cc5",
    punctuationColor: "#24292e",
    lineNumberColor: "#b3b7bc",
  },
};

const DEFAULT_CODE = `// Welcome to Code to Image Generator
import { useState, useEffect } from "react";

export default function UserCard({ name, role }) {
  const [active, setActive] = useState(true);

  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}`;

export default function CodeToImageConverter() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [lang, setLang] = useState("javascript");
  const [themeKey, setThemeKey] = useState<ThemeKey>("slate");
  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(12);
  const [fontSize, setFontSize] = useState(14);
  const [showControls, setShowControls] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [windowTitle, setWindowTitle] = useState("app.tsx");

  const { exportRef, exportPng } = useMockupExport();
  const theme = THEMES[themeKey];

  const lines = code.split("\n");

  const renderHighlightedLine = (line: string) => {
    // Basic regex tokenization
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Single line comment
      if (remaining.startsWith("//") || remaining.startsWith("#")) {
        tokens.push(
          <span key={keyIdx++} style={{ color: theme.commentColor, fontStyle: "italic" }}>
            {remaining}
          </span>
        );
        break;
      }

      // Strings
      const strMatch = remaining.match(/^("[^"]*"|'[^']*'|`[^`]*`)/);
      if (strMatch) {
        tokens.push(
          <span key={keyIdx++} style={{ color: theme.stringColor }}>
            {strMatch[0]}
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^\b\d+(\.\d+)?\b/);
      if (numMatch) {
        tokens.push(
          <span key={keyIdx++} style={{ color: theme.numberColor }}>
            {numMatch[0]}
          </span>
        );
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Identifiers / Keywords
      const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (KEYWORDS.has(word)) {
          tokens.push(
            <span key={keyIdx++} style={{ color: theme.keywordColor, fontWeight: "bold" }}>
              {word}
            </span>
          );
        } else {
          tokens.push(
            <span key={keyIdx++} style={{ color: theme.textColor }}>
              {word}
            </span>
          );
        }
        remaining = remaining.slice(word.length);
        continue;
      }

      // Whitespace / punctuation
      tokens.push(
        <span key={keyIdx++} style={{ color: theme.punctuationColor }}>
          {remaining[0]}
        </span>
      );
      remaining = remaining.slice(1);
    }

    return tokens;
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Live Image Preview
            </span>
            <Btn onClick={() => exportPng("code-snippet.png")}>Download PNG</Btn>
          </div>

          <div
            ref={exportRef}
            className="overflow-hidden transition-all shadow-xl"
            style={{
              backgroundColor: theme.outerBg,
              padding: `${padding}px`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <div
              className="overflow-hidden rounded-lg shadow-2xl"
              style={{
                backgroundColor: theme.windowBg,
                border: `1px solid ${theme.headerBorder}`,
              }}
            >
              {/* Window Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom: `1px solid ${theme.headerBorder}`,
                  backgroundColor: theme.windowBg,
                }}
              >
                <div className="flex items-center gap-2">
                  {showControls && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                  )}
                </div>
                <div
                  className="font-mono text-xs font-medium"
                  style={{ color: theme.lineNumberColor }}
                >
                  {windowTitle}
                </div>
                <div className="w-12 text-right font-mono text-[10px]" style={{ color: theme.lineNumberColor }}>
                  {lang}
                </div>
              </div>

              {/* Window Content */}
              <div className="overflow-x-auto p-4 font-mono leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                <table className="border-collapse">
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx}>
                        {showLineNumbers && (
                          <td
                            className="pr-4 text-right select-none font-mono"
                            style={{ color: theme.lineNumberColor, width: "2rem" }}
                          >
                            {idx + 1}
                          </td>
                        )}
                        <td className="whitespace-pre font-mono">
                          {renderHighlightedLine(line)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Lines" value={lines.length} />
            <StatPill label="Characters" value={code.length} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Code Input">
          <TextArea
            value={code}
            onChange={setCode}
            placeholder="Paste code here..."
            rows={10}
            mono
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Language">
            <Select
              value={lang}
              onChange={setLang}
              options={[
                { value: "javascript", label: "JavaScript / React" },
                { value: "typescript", label: "TypeScript" },
                { value: "python", label: "Python" },
                { value: "html", label: "HTML / XML" },
                { value: "css", label: "CSS" },
                { value: "json", label: "JSON" },
                { value: "sql", label: "SQL" },
              ]}
            />
          </Field>

          <Field label="Theme">
            <Select
              value={themeKey}
              onChange={(v) => setThemeKey(v as ThemeKey)}
              options={Object.entries(THEMES).map(([k, t]) => ({
                value: k,
                label: t.label,
              }))}
            />
          </Field>
        </div>

        <Field label="Window Title">
          <input
            type="text"
            value={windowTitle}
            onChange={(e) => setWindowTitle(e.target.value)}
            className="input-base font-mono text-xs"
            placeholder="Filename (e.g. app.tsx)"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Padding">
            <Range value={padding} onChange={setPadding} min={12} max={64} step={4} suffix="px" />
          </Field>

          <Field label="Border Radius">
            <Range value={borderRadius} onChange={setBorderRadius} min={0} max={24} step={2} suffix="px" />
          </Field>
        </div>

        <Field label="Font Size">
          <Range value={fontSize} onChange={setFontSize} min={10} max={22} step={1} suffix="px" />
        </Field>

        <div className="flex flex-wrap gap-6 pt-2">
          <Toggle checked={showControls} onChange={setShowControls} label="Window Dots" />
          <Toggle checked={showLineNumbers} onChange={setShowLineNumbers} label="Line Numbers" />
        </div>
      </div>
    </ToolShell>
  );
}
