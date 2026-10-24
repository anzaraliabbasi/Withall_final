"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, TextInput, Range, Output, ColorInput } from "@/components/ui/kit";

function parseHex(hexStr: string) {
  let clean = hexStr.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("") + "ff";
  } else if (clean.length === 4) {
    clean = clean.split("").map((c) => c + c).join("");
  } else if (clean.length === 6) {
    clean = clean + "ff";
  }

  if (!/^[0-9a-fA-F]{8}$/.test(clean)) {
    return null;
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const a = parseInt(clean.substring(6, 8), 16) / 255;

  return { r, g, b, a };
}

export default function HexToRgbaConverter() {
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [opacity, setOpacity] = useState(1);

  const parsed = useMemo(() => {
    const res = parseHex(hexInput);
    if (!res) return null;
    return {
      r: res.r,
      g: res.g,
      b: res.b,
      a: opacity,
    };
  }, [hexInput, opacity]);

  const rgbaString = parsed
    ? `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a.toFixed(2)})`
    : "Invalid HEX";

  const rgbString = parsed ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : "";

  const hex8String = parsed
    ? `#${parsed.r.toString(16).padStart(2, "0")}${parsed.g.toString(16).padStart(2, "0")}${parsed.b.toString(16).padStart(2, "0")}${Math.round(parsed.a * 255).toString(16).padStart(2, "0")}`.toUpperCase()
    : "";

  const cssDeclaration = parsed ? `background-color: ${rgbaString};` : "";

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
                style={{ backgroundColor: parsed ? rgbaString : "transparent" }}
              />
              <span className="relative z-10 rounded-lg bg-black/60 px-3 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm">
                {rgbaString}
              </span>
            </div>
          </Field>

          {parsed && (
            <div className="space-y-3">
              <Output text={rgbaString} label="RGBA Output" filename="rgba.txt" />
              <Output text={rgbString} label="RGB Output" filename="rgb.txt" />
              <Output text={hex8String} label="HEX8 (with Alpha)" filename="hex8.txt" />
              <Output text={cssDeclaration} label="CSS Property" filename="color.css" />
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Pick or Enter HEX Color">
          <ColorInput
            value={hexInput}
            onChange={(val) => {
              setHexInput(val);
            }}
          />
        </Field>

        <Field label="HEX Input String" hint="Accepts #RGB, #RGBA, #RRGGBB, #RRGGBBAA">
          <TextInput
            value={hexInput}
            onChange={setHexInput}
            placeholder="#3b82f6 or #3b82f6ff"
            mono
          />
        </Field>

        <Field label={`Opacity / Alpha Override (${Math.round(opacity * 100)}%)`}>
          <Range
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={1}
            step={0.01}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
