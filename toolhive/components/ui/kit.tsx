"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { downloadBlob } from "@/lib/download";

/* ---------- Layout ---------- */

export function ToolShell({
  children,
  side,
}: {
  children: ReactNode;
  side?: ReactNode;
}) {
  return (
    <div className="card p-4 sm:p-6">
      <div className={side ? "grid gap-6 lg:grid-cols-2" : ""}>
        <div className="min-w-0 space-y-4">{children}</div>
        {side ? <div className="min-w-0 space-y-4">{side}</div> : null}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Inputs ---------- */

export function TextInput({
  value,
  onChange,
  placeholder,
  mono,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`input-base ${mono ? "font-mono text-xs" : ""}`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 6,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`input-base resize-y ${mono ? "font-mono text-xs" : ""}`}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input-base">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Range({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-hive-500 dark:bg-slate-700"
      />
      <span className="min-w-[64px] text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
        {value}
        {suffix ?? ""}
      </span>
    </div>
  );
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
      />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-base font-mono text-xs" />
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-hive-500" : "bg-slate-300 dark:bg-slate-700"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}

/* ---------- Panels ---------- */

export function Output({ text, mono = true, filename = "output.txt", label = "Output" }: { text: string; mono?: boolean; filename?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        <div className="flex gap-2">
          <Btn variant="outline" className="!px-3 !py-1.5 !text-xs" onClick={() => {
            navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
          }}>Copy</Btn>
          <Btn variant="outline" className="!px-3 !py-1.5 !text-xs" onClick={() => {
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 5000);
          }}>Download</Btn>
        </div>
      </div>
      <pre className={`max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 ${mono ? "font-mono text-xs" : "whitespace-pre-wrap text-sm"}`}>
        {text}
      </pre>
      {copied ? <p className="text-xs text-emerald-600">Copied to clipboard!</p> : null}
    </div>
  );
}

export function CodeBox({ code, language = "css" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="rounded bg-hive-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-hive-700 dark:text-hive-400">
          {language}
        </span>
        <Btn variant="outline" className="!px-3 !py-1.5 !text-xs" onClick={() => {
          navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
        }}>Copy CSS</Btn>
      </div>
      <pre className="max-h-72 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
        {code}
      </pre>
      {copied ? <p className="text-xs text-emerald-600">Copied!</p> : null}
    </div>
  );
}

/* ---------- File drop ---------- */

export function FileDrop({
  accept = "*",
  multiple = false,
  onFiles,
  label = "Drop files here or click to browse",
}: {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handle = useCallback(
    (list: FileList | null) => {
      if (list && list.length) onFiles(Array.from(list));
    },
    [onFiles]
  );
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition ${
        drag ? "border-hive-500 bg-hive-500/5" : "border-slate-300 dark:border-slate-700"
      }`}
    >
      <svg className="h-8 w-8 text-hive-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0l-3 3m3-3l3 3M6 20.25h12A2.25 2.25 0 0020.25 18v-6.75A2.25 2.25 0 0018 9h-.75V6A5.25 5.25 0 007.5 6v3H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25z" />
      </svg>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}

/* ---------- Mockup export helper ---------- */

export function useMockupExport() {
  const exportRef = useRef<HTMLDivElement>(null);
  const exportPng = useCallback(async (filename: string) => {
    if (!exportRef.current) return;
    const dataUrl = await toPng(exportRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }, []);
  return { exportRef, exportPng };
}

/* ---------- Stat pill ---------- */

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xl font-extrabold text-hive-600 dark:text-hive-400">{value}</div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

/* ---------- Phone frame for mockups ---------- */

export function PhoneFrame({ children, width = 380 }: { children: ReactNode; width?: number }) {
  return (
    <div className="mx-auto w-fit rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
      <div className="overflow-hidden rounded-[1.8rem] bg-white" style={{ width }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Performance hooks ---------- */

/** Debounce any fast-changing value (used to avoid recomputing on every keystroke). */
export function useDebounced<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
