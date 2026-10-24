"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Select, Output, StatPill } from "@/components/ui/kit";

function formatJs(js: string, indentSizeStr: string): string {
  if (!js.trim()) return "";

  const indentStr = indentSizeStr === "tab" ? "\t" : " ".repeat(parseInt(indentSizeStr, 10) || 2);

  // Split semicolons and braces into lines cleanly while respecting quotes
  let formatted = js;

  // Insert newlines after { ; } unless inside strings
  let inString = false;
  let quoteChar = "";
  let result = "";

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const prev = i > 0 ? formatted[i - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
      if (!inString) {
        inString = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inString = false;
      }
    }

    result += char;

    if (!inString) {
      if (char === "{") {
        result += "\n";
      } else if (char === "}") {
        result += "\n";
      } else if (char === ";") {
        result += "\n";
      }
    }
  }

  const rawLines = result.split("\n");
  let level = 0;
  const finalLines: string[] = [];

  for (let rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("}") || line.startsWith("]")) {
      level = Math.max(0, level - 1);
    }

    finalLines.push(indentStr.repeat(level) + line);

    if (line.endsWith("{") || line.endsWith("[")) {
      level++;
    }
  }

  return finalLines.join("\n");
}

export default function JavascriptFormatter() {
  const [jsInput, setJsInput] = useState(
    `function greetUser(user){if(!user){return "Hello Guest";}const name=user.name||"Friend";return \`Welcome, \${name}!\`;}const result=greetUser({name:"Alice"});`
  );
  const [indentSize, setIndentSize] = useState("2");

  const formattedJs = useMemo(() => {
    return formatJs(jsInput, indentSize);
  }, [jsInput, indentSize]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={formattedJs}
            label="Formatted JavaScript Output"
            filename="formatted.js"
            mono
          />

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Total Lines" value={formattedJs.split("\n").length} />
            <StatPill label="Total Chars" value={formattedJs.length} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span className="font-bold">Basic JavaScript Formatter:</span> Automatically re-indents blocks, statements, functions, and object literals into readable code structure.
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

        <Field label="JavaScript Input Code">
          <TextArea
            value={jsInput}
            onChange={setJsInput}
            placeholder="Paste unformatted or compact JavaScript here..."
            rows={10}
            mono
          />
        </Field>
      </div>
    </ToolShell>
  );
}
