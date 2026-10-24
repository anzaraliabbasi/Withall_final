"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Select, Output, StatPill } from "@/components/ui/kit";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr"
]);

function formatHtml(html: string, indentSizeStr: string): string {
  if (!html.trim()) return "";

  const indentStr = indentSizeStr === "tab" ? "\t" : " ".repeat(parseInt(indentSizeStr, 10) || 2);

  // Clean raw html into tokens: tags and text
  const tokens = html
    .replace(/>\s+</g, "><")
    .replace(/(<[^>]+>)/g, "\n$1\n")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  let indentLevel = 0;
  const formattedLines: string[] = [];

  for (const token of tokens) {
    if (token.startsWith("</")) {
      // Closing tag: decrease indent before output
      indentLevel = Math.max(0, indentLevel - 1);
      formattedLines.push(indentStr.repeat(indentLevel) + token);
    } else if (token.startsWith("<") && !token.startsWith("<!") && !token.startsWith("<?")) {
      const tagNameMatch = token.match(/^<([a-zA-Z0-9-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";
      const isSelfClosing = token.endsWith("/>") || VOID_TAGS.has(tagName);

      formattedLines.push(indentStr.repeat(indentLevel) + token);

      if (!isSelfClosing) {
        indentLevel++;
      }
    } else {
      // Plain text or comments/doctype
      formattedLines.push(indentStr.repeat(indentLevel) + token);
    }
  }

  return formattedLines.join("\n");
}

export default function HtmlFormatter() {
  const [htmlInput, setHtmlInput] = useState(
    `<div class="card"><header><h1>Title</h1><nav><ul><li><a href="#">Home</a></li><li><a href="#">Contact</a></li></ul></nav></header><main><p>Welcome to ToolHive!</p><img src="logo.png" alt="Logo"  loading="lazy" decoding="async" /></main></div>`
  );
  const [indentSize, setIndentSize] = useState("2");

  const formattedHtml = useMemo(() => {
    return formatHtml(htmlInput, indentSize);
  }, [htmlInput, indentSize]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output
            text={formattedHtml}
            label="Formatted HTML Output"
            filename="formatted.html"
            mono
          />

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Formatted Lines" value={formattedHtml.split("\n").length} />
            <StatPill label="Total Chars" value={formattedHtml.length} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span className="font-bold">Basic HTML Formatter:</span> Automatically indents tags, attributes, and text nodes with custom indentation spacing.
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

        <Field label="HTML Input Code">
          <TextArea
            value={htmlInput}
            onChange={setHtmlInput}
            placeholder="Paste unformatted HTML here..."
            rows={10}
            mono
          />
        </Field>
      </div>
    </ToolShell>
  );
}
