"use client";

import { useMemo, useState } from "react";
import { ToolShell, Field, TextArea, StatPill, Btn } from "@/components/ui/kit";

export default function LetterCounter() {
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog. Letter Counter provides real-time character, word, sentence, and paragraph statistics."
  );

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;

    const sentences = trimmed
      ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;

    const lines = text ? text.split("\n").length : 0;

    const paragraphs = trimmed
      ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;

    // Reading time (200 wpm)
    const readTimeMinutes = words / 200;
    const readTimeStr =
      readTimeMinutes < 1
        ? `${Math.ceil(readTimeMinutes * 60)} sec`
        : `${Math.ceil(readTimeMinutes)} min`;

    // Speaking time (130 wpm)
    const speakTimeMinutes = words / 130;
    const speakTimeStr =
      speakTimeMinutes < 1
        ? `${Math.ceil(speakTimeMinutes * 60)} sec`
        : `${Math.ceil(speakTimeMinutes)} min`;

    // Letter density (A-Z)
    const letterCounts: Record<string, number> = {};
    const alphaChars = text.toLowerCase().replace(/[^a-z]/g, "");
    for (const char of alphaChars) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }

    const sortedLetters = Object.entries(letterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      lines,
      paragraphs,
      readTimeStr,
      speakTimeStr,
      alphaTotal: alphaChars.length,
      topLetters: sortedLetters,
    };
  }, [text]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Live Statistics</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <StatPill label="Characters" value={stats.chars} />
            <StatPill label="No Spaces" value={stats.charsNoSpaces} />
            <StatPill label="Words" value={stats.words} />
            <StatPill label="Sentences" value={stats.sentences} />
            <StatPill label="Lines" value={stats.lines} />
            <StatPill label="Paragraphs" value={stats.paragraphs} />
            <StatPill label="Reading Time" value={stats.readTimeStr} />
            <StatPill label="Speaking Time" value={stats.speakTimeStr} />
          </div>

          {stats.topLetters.length > 0 && (
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h4 className="text-xs font-semibold uppercase text-slate-500">
                Top Letter Frequency
              </h4>
              <div className="space-y-1.5">
                {stats.topLetters.map(([letter, count]) => {
                  const percent = Math.round((count / (stats.alphaTotal || 1)) * 100);
                  return (
                    <div key={letter} className="flex items-center gap-2 text-xs font-mono">
                      <span className="w-4 font-bold uppercase text-hive-600 dark:text-hive-400">
                        {letter}
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-hive-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-slate-500">
                        {count} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Field label="Input Text">
            <span className="text-xs text-slate-400 font-normal">Type or paste text below</span>
          </Field>
          {text && (
            <Btn onClick={() => setText("")} variant="outline" className="!px-2.5 !py-1 !text-xs">
              Clear Text
            </Btn>
          )}
        </div>
        <TextArea
          value={text}
          onChange={setText}
          rows={10}
          placeholder="Start typing or paste your text here to see real-time statistics..."
        />
      </div>
    </ToolShell>
  );
}
