"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, Range, Toggle, Output, Btn } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*()-_=+[]{};:,.<>?/~";
const AMBIGUOUS = new Set("Il1O0oB8S5Z2G6q9|`'\";:".split(""));

const ALL_SETS = ["lowercase", "uppercase", "digits", "special"] as const;
type SetKey = (typeof ALL_SETS)[number];

export default function StrongRandomPasswordGenerator() {
  const [length, setLength] = useState(20);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(true);
  const [exclude, setExclude] = useState("");
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const pool = useMemo(() => {
    let chars = "";
    if (useLower) chars += LOWER;
    if (useUpper) chars += UPPER;
    if (useDigits) chars += DIGITS;
    if (useSpecial) chars += SPECIAL;
    if (noAmbiguous) chars = chars.split("").filter((c) => !AMBIGUOUS.has(c)).join("");
    const excluded = new Set(exclude.split(""));
    chars = chars.split("").filter((c) => !excluded.has(c)).join("");
    return chars;
  }, [useLower, useUpper, useDigits, useSpecial, noAmbiguous, exclude]);

  const generate = () => {
    if (!pool) {
      setPasswords([]);
      return;
    }
    // crypto.getRandomValues → unbiased rejection sampling
    const max = 256 - (256 % pool.length);
    const out: string[] = [];
    for (let n = 0; n < count; n++) {
      let pw = "";
      const randomBytes = new Uint8Array(length * 2);
      crypto.getRandomValues(randomBytes);
      for (let i = 0; i < randomBytes.length && pw.length < length; i++) {
        const b = randomBytes[i];
        if (b < max) pw += pool[b % pool.length];
      }
      out.push(pw);
    }
    setPasswords(out);
    setCopiedIdx(null);
  };

  const entropy = pool ? Math.round(length * Math.log2(pool.length)) : 0;
  const strength =
    entropy >= 128 ? "Very strong" : entropy >= 80 ? "Strong" : entropy >= 60 ? "Moderate" : entropy > 0 ? "Weak" : "—";
  const strengthColor =
    entropy >= 128
      ? "text-emerald-600 dark:text-emerald-400"
      : entropy >= 80
        ? "text-emerald-600 dark:text-emerald-400"
        : entropy >= 60
          ? "text-amber-600 dark:text-amber-400"
          : "text-rose-600 dark:text-rose-400";

  const strengthBar = Math.min(100, (entropy / 128) * 100);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strength</span>
              <span className={`text-sm font-bold ${strengthColor}`}>{strength}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-hive-500 transition-all" style={{ width: `${strengthBar}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ~{entropy} bits of entropy ({pool.length} possible characters)
            </p>
          </div>

          {passwords.length > 0 ? (
            <div className="space-y-2">
              {passwords.map((pw, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <code className="flex-1 break-all font-mono text-xs text-slate-800 dark:text-slate-200">{pw}</code>
                  <Btn
                    onClick={async () => {
                      if (await copyToClipboard(pw)) setCopiedIdx(i);
                    }}
                    className="!px-3 !py-1.5 !text-xs"
                  >
                    {copiedIdx === i ? "Copied!" : "Copy"}
                  </Btn>
                </div>
              ))}
              <Btn
                variant="outline"
                onClick={() => {
                  const blob = new Blob([passwords.join("\n")], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "passwords.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full"
              >
                Download all as .txt
              </Btn>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
              Pick your settings and hit Generate. Passwords are created locally with crypto-grade randomness and never
              leave this page.
            </p>
          )}

          {!pool && (
            <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              Select at least one character set.
            </p>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label={`Password Length — ${length} characters`}>
          <Range min={6} max={64} value={length} onChange={setLength} />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Toggle checked={useLower} onChange={setUseLower} label="a-z lowercase" />
          <Toggle checked={useUpper} onChange={setUseUpper} label="A-Z uppercase" />
          <Toggle checked={useDigits} onChange={setUseDigits} label="0-9 digits" />
          <Toggle checked={useSpecial} onChange={setUseSpecial} label="!@#$ special" />
        </div>

        <Toggle checked={noAmbiguous} onChange={setNoAmbiguous} label="Exclude look-alike characters (l, I, 1, O, 0…)" />

        <Field label="Additional characters to exclude" hint="Optional">
          <input
            className="input-base"
            value={exclude}
            onChange={(e) => setExclude(e.target.value)}
            placeholder="e.g. #<&|"
          />
        </Field>

        <Field label={`How many passwords — ${count}`}>
          <Range min={1} max={20} value={count} onChange={setCount} />
        </Field>

        <Btn onClick={generate} className="w-full">
          Generate Passwords
        </Btn>
      </div>
    </ToolShell>
  );
}
