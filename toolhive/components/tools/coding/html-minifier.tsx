"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Toggle, Output, StatPill } from "@/components/ui/kit";

function minifyHtml(
  html: string,
  removeComments: boolean,
  collapseWhitespace: boolean,
  trimTagSpaces: boolean
): string {
  if (!html) return "";

  let result = html;

  // 1. Remove HTML comments (except conditional comments if any)
  if (removeComments) {
    result = result.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");
  }

  // 2. Trim whitespace inside tags (e.g. <div   class="foo"   > -> <div class="foo">)
  if (trimTagSpaces) {
    result = result.replace(/<([a-zA-Z0-9-]+)\s+([^>]+)>/g, (_, tag, attrs) => {
      const cleanAttrs = attrs.replace(/\s+/g, " ").trim();
      return `<${tag} ${cleanAttrs}>`;
    });
  }

  // 3. Collapse whitespace between tags while respecting pre / code content
  if (collapseWhitespace) {
    // Preserve <pre> and <code> blocks by temporary placeholders
    const preservedBlocks: string[] = [];
    result = result.replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/gi, (match) => {
      preservedBlocks.push(match);
      return `___PRESERVED_BLOCK_${preservedBlocks.length - 1}___`;
    });

    // Collapse whitespace between tags
    result = result
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();

    // Restore preserved blocks
    result = result.replace(/___PRESERVED_BLOCK_(\d+)___/g, (_, idxStr) => {
      const idx = parseInt(idxStr, 10);
      return preservedBlocks[idx] || "";
    });
  }

  return result;
}

export default function HtmlMinifier() {
  const [htmlInput, setHtmlInput] = useState(
    `<!DOCTYPE html>
<html lang="en">
  <!-- Main Header Comment -->
  <head>
    <meta charset="UTF-8" />
    <title>   My   Webpage   </title>
  </head>
  <body>
    <!-- Navigation section -->
    <header class="header   primary">
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <h1>  Hello World!  </h1>
    </main>
  </body>
</html>`
  );

  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [trimTagSpaces, setTrimTagSpaces] = useState(true);

  const minifiedHtml = useMemo(() => {
    return minifyHtml(htmlInput, removeComments, collapseWhitespace, trimTagSpaces);
  }, [htmlInput, removeComments, collapseWhitespace, trimTagSpaces]);

  const origSize = htmlInput.length;
  const minSize = minifiedHtml.length;
  const savedPercent = origSize > 0 ? (((origSize - minSize) / origSize) * 100).toFixed(1) : "0";

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={minifiedHtml}
            label="Minified HTML Output"
            filename="index.min.html"
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
        <Field label="HTML Input">
          <TextArea
            value={htmlInput}
            onChange={setHtmlInput}
            placeholder="Paste HTML here..."
            rows={10}
            mono
          />
        </Field>

        <div className="space-y-3 pt-2">
          <Toggle
            checked={removeComments}
            onChange={setRemoveComments}
            label="Remove HTML Comments (<!-- ... -->)"
          />
          <Toggle
            checked={collapseWhitespace}
            onChange={setCollapseWhitespace}
            label="Collapse Whitespace Between Tags (Preserves <pre>, <code>, <script>)"
          />
          <Toggle
            checked={trimTagSpaces}
            onChange={setTrimTagSpaces}
            label="Trim Redundant Spaces Inside Attributes"
          />
        </div>
      </div>
    </ToolShell>
  );
}
