"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, TextInput, Range, Output } from "@/components/ui/kit";

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default function RgbaToHexConverter() {
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [a, setA] = useState(1);
  const [stringInput, setStringInput] = useState("rgba(59, 130, 246, 1)");

  const handleStringChange = (val: string) => {
    setStringInput(val);
    const match = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (match) {
      const parsedR = Math.min(255, Math.max(0, parseInt(match[1], 10)));
      const parsedG = Math.min(255, Math.max(0, parseInt(match[2], 10)));
      const parsedB = Math.min(255, Math.max(0, parseInt(match[3], 10)));
      const parsedA = match[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(match[4]))) : 1;

      setR(parsedR);
      setG(parsedG);
      setB(parsedB);
      setA(parsedA);
    }
  };

  const hex6 = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
  const alphaHex = Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
  const hex8 = `${hex6}${alphaHex}`;

  const hsl = useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const hslaString = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Color Preview">
            <div
              className="h-28 w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            >
              <div
                className="absolute inset-0 transition-colors"
                style={{ backgroundColor: rgbaString }}
              />
              <span className="relative z-10 rounded-lg bg-black/60 px-3 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm">
                {hex8}
              </span>
            </div>
          </Field>

          <Output text={hex6} label="HEX (6-digit)" filename="hex.txt" />
          <Output text={hex8} label="HEX with Alpha (8-digit)" filename="hex8.txt" />
          <Output text={hslaString} label="HSLA Output" filename="hsl.txt" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Paste RGBA / RGB String">
          <TextInput
            value={stringInput}
            onChange={handleStringChange}
            placeholder="rgba(59, 130, 246, 0.8) or rgb(59, 130, 246)"
            mono
          />
        </Field>

        <Field label={`Red (R: ${r})`}>
          <Range
            value={r}
            onChange={(v) => {
              setR(v);
              setStringInput(`rgba(${v}, ${g}, ${b}, ${a})`);
            }}
            min={0}
            max={255}
          />
        </Field>

        <Field label={`Green (G: ${g})`}>
          <Range
            value={g}
            onChange={(v) => {
              setG(v);
              setStringInput(`rgba(${r}, ${v}, ${b}, ${a})`);
            }}
            min={0}
            max={255}
          />
        </Field>

        <Field label={`Blue (B: ${b})`}>
          <Range
            value={b}
            onChange={(v) => {
              setB(v);
              setStringInput(`rgba(${r}, ${g}, ${v}, ${a})`);
            }}
            min={0}
            max={255}
          />
        </Field>

        <Field label={`Alpha / Opacity (A: ${a.toFixed(2)})`}>
          <Range
            value={a}
            onChange={(v) => {
              setA(v);
              setStringInput(`rgba(${r}, ${g}, ${b}, ${v})`);
            }}
            min={0}
            max={1}
            step={0.01}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
