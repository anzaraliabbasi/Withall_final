"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, ColorInput, Range, Output, StatPill } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

export default function ColorMixer() {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#ef4444");
  const [ratio, setRatio] = useState(50); // 0% = 100% color1, 100% = 100% color2
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const mixedRgb = useMemo(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const factor = ratio / 100;

    return {
      r: Math.round(rgb1.r * (1 - factor) + rgb2.r * factor),
      g: Math.round(rgb1.g * (1 - factor) + rgb2.g * factor),
      b: Math.round(rgb1.b * (1 - factor) + rgb2.b * factor),
    };
  }, [color1, color2, ratio]);

  const mixedHex = useMemo(() => rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b), [mixedRgb]);
  const mixedRgbString = `rgb(${mixedRgb.r}, ${mixedRgb.g}, ${mixedRgb.b})`;

  // Generate 5 intermediate blend stops
  const blendStops = useMemo(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const stops = [0, 25, 50, 75, 100];

    return stops.map((pct, idx) => {
      const f = pct / 100;
      const r = Math.round(rgb1.r * (1 - f) + rgb2.r * f);
      const g = Math.round(rgb1.g * (1 - f) + rgb2.g * f);
      const b = Math.round(rgb1.b * (1 - f) + rgb2.b * f);
      const hex = rgbToHex(r, g, b);
      return { pct, hex, idx };
    });
  }, [color1, color2]);

  const handleCopy = (hex: string, idx: number) => {
    copyToClipboard(hex);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Mixed Result HEX" value={mixedHex.toUpperCase()} />

          <Field label="Mixed Color Preview">
            <div
              className="h-28 w-full rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center dark:border-slate-800 transition-colors"
              style={{ backgroundColor: mixedHex }}
            >
              <span className="rounded-lg bg-black/40 px-3 py-1 font-mono text-sm font-bold text-white backdrop-blur-sm">
                {mixedHex.toUpperCase()}
              </span>
            </div>
          </Field>

          <Output text={mixedHex.toUpperCase()} label="HEX Value" filename="mixed-color.txt" />
          <Output text={mixedRgbString} label="RGB Value" filename="mixed-rgb.txt" />

          <Field label="5-Stop Blend Spectrum">
            <div className="grid grid-cols-5 gap-1.5">
              {blendStops.map((stop) => (
                <div
                  key={stop.pct}
                  onClick={() => handleCopy(stop.hex, stop.idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl p-2 text-center transition hover:scale-105 shadow-sm"
                  style={{ backgroundColor: stop.hex }}
                >
                  <span className="block text-[10px] font-bold text-white drop-shadow">
                    {stop.pct}%
                  </span>
                  <span className="block font-mono text-[9px] text-white/90 drop-shadow">
                    {stop.hex.toUpperCase()}
                  </span>
                  {copiedIndex === stop.idx && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-bold text-white">
                      Copied!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Field>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="First Color (0% Weight)">
          <ColorInput value={color1} onChange={setColor1} />
        </Field>

        <Field label="Second Color (100% Weight)">
          <ColorInput value={color2} onChange={setColor2} />
        </Field>

        <Field label={`Mix Ratio (${100 - ratio}% Color 1 / ${ratio}% Color 2)`}>
          <Range value={ratio} onChange={setRatio} min={0} max={100} step={1} suffix="%" />
        </Field>

        <Field label="Gradient Bar">
          <div
            className="h-8 w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            style={{
              background: `linear-gradient(to right, ${color1}, ${color2})`,
            }}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
