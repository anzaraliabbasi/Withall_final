"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

function hexToRgb(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.substring(0, 2) || "255", 16);
  const g = parseInt(c.substring(2, 4) || "255", 16);
  const b = parseInt(c.substring(4, 6) || "255", 16);
  return { r, g, b };
}

const BG_PRESETS = [
  { label: "Mesh Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { label: "Amber Sunset", value: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)" },
  { label: "Neon Glow", value: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #ec4899 100%)" },
  { label: "Dark Cosmic", value: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" },
];

export default function CssGlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [bgAlpha, setBgAlpha] = useState(0.25);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [saturate, setSaturate] = useState(180);
  const [borderAlpha, setBorderAlpha] = useState(0.3);
  const [shadowAlpha, setShadowAlpha] = useState(0.15);
  const [borderRadius, setBorderRadius] = useState(20);
  const [bgPreset, setBgPreset] = useState(BG_PRESETS[0].value);

  const { r, g, b } = hexToRgb(bgColor);

  const bgRgba = `rgba(${r}, ${g}, ${b}, ${bgAlpha})`;
  const borderRgba = `rgba(${r}, ${g}, ${b}, ${borderAlpha})`;
  const shadowRgba = `rgba(0, 0, 0, ${shadowAlpha})`;

  const cssCode = `background: ${bgRgba};
backdrop-filter: blur(${blur}px) saturate(${saturate}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturate}%);
border-radius: ${borderRadius}px;
border: 1px solid ${borderRgba};
box-shadow: 0 8px 32px 0 ${shadowRgba};`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Preview Over Background">
            <div
              className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl p-6 shadow-inner"
              style={{ background: bgPreset }}
            >
              {/* Floating decorative shapes behind glass card */}
              <div className="absolute -left-6 -top-6 h-36 w-36 rounded-full bg-yellow-400 opacity-80 blur-sm" />
              <div className="absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-pink-500 opacity-80 blur-sm" />
              <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-2xl bg-cyan-400 opacity-70 rotate-45 blur-sm" />

              {/* Glass Card */}
              <div
                className="relative z-10 w-full max-w-xs space-y-3 p-6 text-white shadow-2xl transition-all"
                style={{
                  background: bgRgba,
                  backdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
                  WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
                  borderRadius: `${borderRadius}px`,
                  border: `1px solid ${borderRgba}`,
                  boxShadow: `0 8px 32px 0 ${shadowRgba}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Glass UI</span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md">
                    Pro
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white drop-shadow">Glassmorphism</h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  Frosted glass effect with real-time backdrop blur, transparency, and saturated colors.
                </p>
                <button
                  type="button"
                  className="w-full rounded-xl bg-white/30 py-2 text-xs font-semibold text-white transition hover:bg-white/40"
                >
                  Explore Glass
                </button>
              </div>
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Preview Background">
          <Select
            value={bgPreset}
            onChange={setBgPreset}
            options={BG_PRESETS.map((p) => ({ value: p.value, label: p.label }))}
          />
        </Field>

        <Field label={`Blur Radius (${blur}px)`}>
          <Range value={blur} onChange={setBlur} min={0} max={40} suffix="px" />
        </Field>

        <Field label={`Background Alpha (${Math.round(bgAlpha * 100)}%)`}>
          <Range value={bgAlpha} onChange={setBgAlpha} min={0} max={1} step={0.01} />
        </Field>

        <Field label="Glass Tint Color">
          <ColorInput value={bgColor} onChange={setBgColor} />
        </Field>

        <Field label={`Saturation (${saturate}%)`}>
          <Range value={saturate} onChange={setSaturate} min={50} max={250} suffix="%" />
        </Field>

        <Field label={`Border Alpha (${Math.round(borderAlpha * 100)}%)`}>
          <Range value={borderAlpha} onChange={setBorderAlpha} min={0} max={1} step={0.01} />
        </Field>

        <Field label={`Shadow Opacity (${Math.round(shadowAlpha * 100)}%)`}>
          <Range value={shadowAlpha} onChange={setShadowAlpha} min={0} max={0.6} step={0.01} />
        </Field>

        <Field label={`Border Radius (${borderRadius}px)`}>
          <Range value={borderRadius} onChange={setBorderRadius} min={0} max={40} suffix="px" />
        </Field>
      </div>
    </ToolShell>
  );
}
