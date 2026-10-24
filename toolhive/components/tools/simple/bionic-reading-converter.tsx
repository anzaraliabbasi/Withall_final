"use client";

import { useMemo, useState } from "react";
import { ToolShell, Field, Btn, TextArea, Range, Output } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";
import { escapeHtml } from "@/lib/sanitize";

export default function BionicReadingConverter() {
  const [input, setInput] = useState(
    "Bionic Reading is a new method facilitating the reading process by guiding the eye through text with artificial fixation points. As a result, the reader is only focusing on the highlighted initial letters and lets the brain center complete the word."
  );
  const [fixationPercent, setFixationPercent] = useState(40);

  const { htmlOutput, textOutput } = useMemo(() => {
    if (!input) return { htmlOutput: "", textOutput: "" };

    const fixationRatio = fixationPercent / 100;

    // Process line by line, word by word
    const lines = input.split("\n");
    const processedLinesHtml = lines.map((line) => {
      const tokens = line.split(/(\s+)/); // keep spaces
      return tokens
        .map((token) => {
          if (/^\s+$/.test(token) || !token) return token;

          // Find letters in token
          const match = token.match(/^(\p{P}*)(\p{L}+)(\p{P}*)$/u);
          if (match) {
            const [, prefix, letters, suffix] = match;
            const boldCount = Math.max(1, Math.ceil(letters.length * fixationRatio));
            const boldPart = escapeHtml(letters.slice(0, boldCount));
            const restPart = escapeHtml(letters.slice(boldCount));
            return `${escapeHtml(prefix)}<b>${boldPart}</b>${restPart}${escapeHtml(suffix)}`;
          }

          // Fallback if token is simple word without complex unicode boundary
          const len = token.length;
          const boldCount = Math.max(1, Math.ceil(len * fixationRatio));
          return `<b>${escapeHtml(token.slice(0, boldCount))}</b>${escapeHtml(token.slice(boldCount))}`;
        })
        .join("");
    });

    const html = processedLinesHtml.join("<br/>");

    // Plain text representation using markdown-style asterisks or keep raw html
    const text = processedLinesHtml.join("\n");

    return { htmlOutput: html, textOutput: text };
  }, [input, fixationPercent]);

  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopyHtml = () => {
    copyToClipboard(htmlOutput).then(() => {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1500);
    });
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Bionic Reader Preview</h3>
            <Btn onClick={handleCopyHtml} variant="outline" className="!px-3 !py-1 !text-xs">
              {copiedHtml ? "Copied HTML!" : "Copy HTML"}
            </Btn>
          </div>

          <div
            className="min-h-[220px] max-h-[450px] overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-base leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />

          <Output text={textOutput} label="Raw HTML Output" filename="bionic-reading.html" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Text">
          <TextArea
            value={input}
            onChange={setInput}
            rows={8}
            placeholder="Type or paste text to convert to Bionic Reading format..."
          />
        </Field>

        <Field label={`Fixation Intensity: ${fixationPercent}%`}>
          <Range
            value={fixationPercent}
            onChange={setFixationPercent}
            min={20}
            max={70}
            step={5}
            suffix="%"
          />
        </Field>
      </div>
    </ToolShell>
  );
}
