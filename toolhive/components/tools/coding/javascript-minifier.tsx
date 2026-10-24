"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Toggle, Output, StatPill } from "@/components/ui/kit";

function minifyJs(
  js: string,
  removeBlockComments: boolean,
  removeLineComments: boolean,
  removeEmptyLines: boolean,
  trimSpaces: boolean
): string {
  if (!js) return "";

  let result = js;

  // 1. Remove block comments /* ... */ safely
  if (removeBlockComments) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  // 2. Remove line comments // ... line by line, careful with string URLs (http://)
  if (removeLineComments) {
    result = result
      .split("\n")
      .map((line) => {
        // Simple check if line contains // outside strings
        let inString = false;
        let stringChar = "";
        let commentIdx = -1;

        for (let i = 0; i < line.length - 1; i++) {
          const char = line[i];
          const next = line[i + 1];

          if ((char === '"' || char === "'" || char === "`") && line[i - 1] !== "\\") {
            if (!inString) {
              inString = true;
              stringChar = char;
            } else if (char === stringChar) {
              inString = false;
            }
          }

          if (!inString && char === "/" && next === "/") {
            commentIdx = i;
            break;
          }
        }

        if (commentIdx !== -1) {
          return line.substring(0, commentIdx);
        }
        return line;
      })
      .join("\n");
  }

  // 3. Trim lines and remove blank lines
  const lines = result.split("\n");
  const processedLines: string[] = [];

  for (let line of lines) {
    if (trimSpaces) {
      line = line.trim();
    }
    if (removeEmptyLines && !line) {
      continue;
    }
    processedLines.push(line);
  }

  return processedLines.join(trimSpaces ? "\n" : "\n");
}

export default function JavascriptMinifier() {
  const [jsInput, setJsInput] = useState(
    `// Basic JavaScript Utility Module
/* 
 * Multi-line comment header
 * Version 1.0.0
 */

function calculateTotal(items, taxRate) {
  // Validate tax input
  if (!taxRate || taxRate < 0) {
    taxRate = 0.05; // Default 5% tax
  }

  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price * items[i].quantity;
  }

  const tax = subtotal * taxRate;
  return subtotal + tax;
}

// Export default function
export default calculateTotal;`
  );

  const [removeBlockComments, setRemoveBlockComments] = useState(true);
  const [removeLineComments, setRemoveLineComments] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [trimSpaces, setTrimSpaces] = useState(true);

  const minifiedJs = useMemo(() => {
    return minifyJs(
      jsInput,
      removeBlockComments,
      removeLineComments,
      removeEmptyLines,
      trimSpaces
    );
  }, [jsInput, removeBlockComments, removeLineComments, removeEmptyLines, trimSpaces]);

  const origSize = jsInput.length;
  const minSize = minifiedJs.length;
  const savedPercent = origSize > 0 ? (((origSize - minSize) / origSize) * 100).toFixed(1) : "0";

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={minifiedJs}
            label="Basic Minified JS Output"
            filename="script.min.js"
            mono
          />

          <div className="grid grid-cols-3 gap-2">
            <StatPill label="Original" value={`${origSize} B`} />
            <StatPill label="Minified" value={`${minSize} B`} />
            <StatPill label="Saved" value={`${savedPercent}%`} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          <span className="font-bold">Basic Minifier Notice:</span> This tool uses safe regex pattern matching to clean comments and whitespace without modifying code logic or variable names.
        </div>

        <Field label="JavaScript Input">
          <TextArea
            value={jsInput}
            onChange={setJsInput}
            placeholder="Paste JavaScript code here..."
            rows={10}
            mono
          />
        </Field>

        <div className="space-y-3 pt-2">
          <Toggle
            checked={removeBlockComments}
            onChange={setRemoveBlockComments}
            label="Remove Block Comments (/* ... */)"
          />
          <Toggle
            checked={removeLineComments}
            onChange={setRemoveLineComments}
            label="Remove Single-Line Comments (// ...)"
          />
          <Toggle
            checked={removeEmptyLines}
            onChange={setRemoveEmptyLines}
            label="Remove Blank & Empty Lines"
          />
          <Toggle
            checked={trimSpaces}
            onChange={setTrimSpaces}
            label="Trim Leading & Trailing Whitespace"
          />
        </div>
      </div>
    </ToolShell>
  );
}
