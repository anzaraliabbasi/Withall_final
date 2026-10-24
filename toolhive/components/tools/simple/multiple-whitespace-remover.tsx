"use client";

import { useMemo, useState } from "react";
import { ToolShell, Field, TextArea, Toggle, TextInput, Output, StatPill } from "@/components/ui/kit";

export default function MultipleWhitespaceRemover() {
  const [input, setInput] = useState(
    "Hello    world!   This   is   a   sample   text.\n\n\n\nIt has   multiple     spaces\tand\t\tmultiple blank lines.\n\n    Trim me please!    "
  );

  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [collapseEmptyLines, setCollapseEmptyLines] = useState(true);
  const [removeAllEmptyLines, setRemoveAllEmptyLines] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeTabs, setRemoveTabs] = useState(true);
  const [customRemove, setCustomRemove] = useState("");

  const { outputText, charsSaved } = useMemo(() => {
    if (!input) return { outputText: "", charsSaved: 0 };

    let res = input;

    if (removeTabs) {
      res = res.replace(/\t+/g, " ");
    }

    if (customRemove) {
      res = res.replaceAll(customRemove, "");
    }

    if (trimLines) {
      res = res
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    if (collapseSpaces) {
      res = res.replace(/[^\S\r\n]+/g, " ");
    }

    if (removeAllEmptyLines) {
      res = res
        .split("\n")
        .filter((line) => line.length > 0)
        .join("\n");
    } else if (collapseEmptyLines) {
      res = res.replace(/\n\s*\n/g, "\n\n");
    }

    const saved = input.length - res.length;
    return { outputText: res, charsSaved: Math.max(0, saved) };
  }, [
    input,
    collapseSpaces,
    collapseEmptyLines,
    removeAllEmptyLines,
    trimLines,
    removeTabs,
    customRemove,
  ]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Characters Removed" value={charsSaved} />
          <Output text={outputText} label="Cleaned Output" filename="cleaned-text.txt" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Text">
          <TextArea
            value={input}
            onChange={setInput}
            rows={7}
            placeholder="Paste text with messy spaces, tabs, or empty lines..."
          />
        </Field>

        <Field label="Cleaning Options">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <Toggle
              checked={collapseSpaces}
              onChange={setCollapseSpaces}
              label="Collapse multiple consecutive spaces into 1"
            />
            <Toggle
              checked={collapseEmptyLines}
              onChange={(v) => {
                setCollapseEmptyLines(v);
                if (v) setRemoveAllEmptyLines(false);
              }}
              label="Collapse multiple empty lines into 1"
            />
            <Toggle
              checked={removeAllEmptyLines}
              onChange={(v) => {
                setRemoveAllEmptyLines(v);
                if (v) setCollapseEmptyLines(false);
              }}
              label="Remove ALL empty lines completely"
            />
            <Toggle
              checked={trimLines}
              onChange={setTrimLines}
              label="Trim whitespace at start/end of each line"
            />
            <Toggle
              checked={removeTabs}
              onChange={setRemoveTabs}
              label="Replace tab characters with spaces"
            />
          </div>
        </Field>

        <Field label="Custom Character / Substring Removal" hint="Remove specific characters or words">
          <TextInput
            value={customRemove}
            onChange={setCustomRemove}
            placeholder="e.g. , or ; or custom word"
          />
        </Field>
      </div>
    </ToolShell>
  );
}
