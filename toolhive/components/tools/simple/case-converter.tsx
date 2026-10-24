"use client";

import { useMemo, useState } from "react";
import { ToolShell, Field, Btn, TextArea, Toggle, Output } from "@/components/ui/kit";

type CaseMode =
  | "uppercase"
  | "lowercase"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating"
  | "inverse";

export default function CaseConverter() {
  const [input, setInput] = useState(
    "Quick brown fox jumps over the lazy dog. Sample Text for Case Conversion!"
  );
  const [mode, setMode] = useState<CaseMode>("uppercase");
  const [turkishLocale, setTurkishLocale] = useState(false);

  const convertedText = useMemo(() => {
    if (!input) return "";
    const locale = turkishLocale ? "tr-TR" : undefined;

    const toLower = (str: string) => str.toLocaleLowerCase(locale);
    const toUpper = (str: string) => str.toLocaleUpperCase(locale);

    switch (mode) {
      case "uppercase":
        return toUpper(input);

      case "lowercase":
        return toLower(input);

      case "title":
        return input.replace(
          /\w\S*/g,
          (txt) => toUpper(txt.charAt(0)) + toLower(txt.substr(1))
        );

      case "sentence":
        return input.replace(/(^\s*|\.\s*)([a-zıiğüşöç])/gi, (match, separator, char) => {
          return separator + toUpper(char);
        });

      case "camel": {
        const words = input
          .replace(/[^\w\s-]/g, "")
          .trim()
          .split(/[\s_-]+/);
        if (words.length === 0) return "";
        return (
          toLower(words[0]) +
          words
            .slice(1)
            .map((w) => (w ? toUpper(w.charAt(0)) + toLower(w.slice(1)) : ""))
            .join("")
        );
      }

      case "pascal": {
        const words = input
          .replace(/[^\w\s-]/g, "")
          .trim()
          .split(/[\s_-]+/);
        return words
          .map((w) => (w ? toUpper(w.charAt(0)) + toLower(w.slice(1)) : ""))
          .join("");
      }

      case "snake":
        return input
          .replace(/[^\w\s-]/g, "")
          .trim()
          .split(/[\s_-]+/)
          .map((w) => toLower(w))
          .join("_");

      case "kebab":
        return input
          .replace(/[^\w\s-]/g, "")
          .trim()
          .split(/[\s_-]+/)
          .map((w) => toLower(w))
          .join("-");

      case "constant":
        return input
          .replace(/[^\w\s-]/g, "")
          .trim()
          .split(/[\s_-]+/)
          .map((w) => toUpper(w))
          .join("_");

      case "alternating":
        return input
          .split("")
          .map((char, i) => (i % 2 === 0 ? toLower(char) : toUpper(char)))
          .join("");

      case "inverse":
        return input
          .split("")
          .map((char) => {
            const upper = toUpper(char);
            const lower = toLower(char);
            if (char === upper && char !== lower) return lower;
            if (char === lower && char !== upper) return upper;
            return char;
          })
          .join("");

      default:
        return input;
    }
  }, [input, mode, turkishLocale]);

  const modes: { id: CaseMode; label: string }[] = [
    { id: "uppercase", label: "UPPERCASE" },
    { id: "lowercase", label: "lowercase" },
    { id: "title", label: "Title Case" },
    { id: "sentence", label: "Sentence case" },
    { id: "camel", label: "camelCase" },
    { id: "pascal", label: "PascalCase" },
    { id: "snake", label: "snake_case" },
    { id: "kebab", label: "kebab-case" },
    { id: "constant", label: "CONSTANT_CASE" },
    { id: "alternating", label: "aLtErNaTiNg" },
    { id: "inverse", label: "iNVERSE cASE" },
  ];

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output text={convertedText} label="Converted Output" filename="case-converted.txt" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Text">
          <TextArea
            value={input}
            onChange={setInput}
            rows={6}
            placeholder="Type or paste text to convert..."
          />
        </Field>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Conversion Modes
          </span>
          <Toggle
            checked={turkishLocale}
            onChange={setTurkishLocale}
            label="Turkish locale (i / İ, I / ı)"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {modes.map((m) => (
            <Btn
              key={m.id}
              onClick={() => setMode(m.id)}
              variant={mode === m.id ? "primary" : "outline"}
              className="!text-xs !py-2 justify-center"
            >
              {m.label}
            </Btn>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
