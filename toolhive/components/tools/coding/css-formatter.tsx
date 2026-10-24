"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Select, Output, StatPill } from "@/components/ui/kit";

function formatCss(css: string, indentSizeStr: string): string {
  if (!css.trim()) return "";

  const indentStr = indentSizeStr === "tab" ? "\t" : " ".repeat(parseInt(indentSizeStr, 10) || 2);

  // Clean extra spaces
  let cleaned = css
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, " {\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .trim();

  const lines = cleaned.split("\n");
  let level = 0;
  const outputLines: string[] = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("}")) {
      level = Math.max(0, level - 1);
    }

    outputLines.push(indentStr.repeat(level) + line);

    if (line.endsWith("{")) {
      level++;
    }
  }

  return outputLines.join("\n");
}

export default function CssFormatter() {
  const [cssInput, setCssInput] = useState(
    `body{margin:0;padding:0;font-family:sans-serif}.card{background:#fff;border-radius:8px;padding:16px}@media (max-width:768px){.card{padding:8px}}`
  );
  const [indentSize, setIndentSize] = useState("2");

  const formattedCss = useMemo(() => {
    return formatCss(cssInput, indentSize);
  }, [cssInput, indentSize]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={formattedCss}
            label="Formatted CSS Output"
            filename="formatted.css"
            mono
          />

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="CSS Rules / Lines" value={formattedCss.split("\n").length} />
            <StatPill label="Total Chars" value={formattedCss.length} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span className="font-bold">Basic CSS Formatter:</span> Expands minified or unformatted CSS rulesets into clean multi-line selectors, declarations, and nested media queries.
        </div>

        <Field label="Indent Size">
          <Select
            value={indentSize}
            onChange={setIndentSize}
            options={[
              { value: "2", label: "2 Spaces" },
              { value: "4", label: "4 Spaces" },
              { value: "tab", label: "Tab Characters" },
            ]}
          />
        </Field>

        <Field label="CSS Input Code">
          <TextArea
            value={cssInput}
            onChange={setCssInput}
            placeholder="Paste raw or minified CSS here..."
            rows={10}
            mono
          />
        </Field>
      </div>
    </ToolShell>
  );
}
