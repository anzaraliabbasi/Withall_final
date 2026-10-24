"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Toggle, Output, StatPill } from "@/components/ui/kit";

function minifyCss(
  css: string,
  removeComments: boolean,
  removeWhitespace: boolean,
  removeTrailingSemicolons: boolean,
  optimizeZeroes: boolean
): string {
  if (!css) return "";

  let result = css;

  // 1. Remove comments
  if (removeComments) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  // 2. Collapse whitespace & remove newlines
  if (removeWhitespace) {
    result = result
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .trim();
  }

  // 3. Remove trailing semicolons before closing brace
  if (removeTrailingSemicolons) {
    result = result.replace(/;}/g, "}");
  }

  // 4. Optimize zeroes (e.g. 0px -> 0, 0.5rem -> .5rem)
  if (optimizeZeroes) {
    result = result
      .replace(/([^a-zA-Z0-9_])0(px|pt|em|rem|%|vh|vw|in|cm|mm)/g, "$10")
      .replace(/(:|\s)0\.(\d+)/g, "$1.$2");
  }

  return result;
}

export default function CssMinifier() {
  const [cssInput, setCssInput] = useState(
    `/* Primary Header Styling */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  margin-top: 0.5rem;
  background-color: #0f172a;
  border-radius: 8px;
}

/* Button variants */
.btn-primary {
  background-color: #f59e0b;
  color: #ffffff;
  border: 1px solid transparent;
  padding: 8px 16px;
  cursor: pointer;
}`
  );

  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [removeTrailingSemicolons, setRemoveTrailingSemicolons] = useState(true);
  const [optimizeZeroes, setOptimizeZeroes] = useState(true);

  const minifiedCss = useMemo(() => {
    return minifyCss(
      cssInput,
      removeComments,
      removeWhitespace,
      removeTrailingSemicolons,
      optimizeZeroes
    );
  }, [cssInput, removeComments, removeWhitespace, removeTrailingSemicolons, optimizeZeroes]);

  const origSize = cssInput.length;
  const minSize = minifiedCss.length;
  const savedPercent = origSize > 0 ? (((origSize - minSize) / origSize) * 100).toFixed(1) : "0";

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={minifiedCss}
            label="Minified CSS Output"
            filename="style.min.css"
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
        <Field label="CSS Input">
          <TextArea
            value={cssInput}
            onChange={setCssInput}
            placeholder="Paste CSS code here..."
            rows={10}
            mono
          />
        </Field>

        <div className="space-y-3 pt-2">
          <Toggle
            checked={removeComments}
            onChange={setRemoveComments}
            label="Remove Comments (/* ... */)"
          />
          <Toggle
            checked={removeWhitespace}
            onChange={setRemoveWhitespace}
            label="Collapse Whitespace & Remove Unnecessary Spaces"
          />
          <Toggle
            checked={removeTrailingSemicolons}
            onChange={setRemoveTrailingSemicolons}
            label="Remove Trailing Semicolons Before Closing Brace"
          />
          <Toggle
            checked={optimizeZeroes}
            onChange={setOptimizeZeroes}
            label="Optimize Zeroes (0px → 0, 0.5 → .5)"
          />
        </div>
      </div>
    </ToolShell>
  );
}
