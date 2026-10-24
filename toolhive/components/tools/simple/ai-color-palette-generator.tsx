"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, ColorInput, Select, CodeBox, Btn } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

// HSL / HEX Helpers
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getColorName(h: number, s: number, l: number): string {
  if (l < 10) return "Deep Obsidian";
  if (l > 92) return "Pure White";
  if (s < 12) {
    if (l < 30) return "Dark Slate";
    if (l < 70) return "Neutral Gray";
    return "Soft Silver";
  }

  let hueName = "";
  if (h >= 345 || h < 15) hueName = "Crimson Red";
  else if (h < 45) hueName = "Warm Orange";
  else if (h < 70) hueName = "Golden Yellow";
  else if (h < 150) hueName = "Emerald Green";
  else if (h < 200) hueName = "Cyan Teal";
  else if (h < 260) hueName = "Ocean Blue";
  else if (h < 310) hueName = "Royal Purple";
  else hueName = "Vibrant Magenta";

  if (l > 75) return `Soft ${hueName}`;
  if (l < 30) return `Dark ${hueName}`;
  if (s > 80) return `Vivid ${hueName}`;
  return hueName;
}

export default function AiColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#f59e0b");
  const [harmony, setHarmony] = useState("analogous");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const palette = useMemo(() => {
    const { h, s, l } = hexToHsl(baseColor);
    let hslStops: { h: number; s: number; l: number }[] = [];

    switch (harmony) {
      case "analogous":
        hslStops = [
          { h: h - 40, s, l },
          { h: h - 20, s, l },
          { h, s, l },
          { h: h + 20, s, l },
          { h: h + 40, s, l },
        ];
        break;
      case "complementary":
        hslStops = [
          { h, s, l: Math.min(l + 25, 90) },
          { h, s, l },
          { h, s, l: Math.max(l - 20, 15) },
          { h: h + 180, s, l },
          { h: h + 180, s, l: Math.min(l + 20, 85) },
        ];
        break;
      case "triadic":
        hslStops = [
          { h, s, l },
          { h: h + 120, s, l },
          { h: h + 120, s, l: Math.min(l + 20, 85) },
          { h: h + 240, s, l },
          { h: h + 240, s, l: Math.max(l - 20, 15) },
        ];
        break;
      case "split-complementary":
        hslStops = [
          { h, s, l },
          { h: h + 150, s, l },
          { h: h + 150, s, l: Math.min(l + 15, 85) },
          { h: h + 210, s, l },
          { h: h + 210, s, l: Math.max(l - 15, 15) },
        ];
        break;
      case "monochromatic":
        hslStops = [
          { h, s: Math.max(s - 30, 10), l: 85 },
          { h, s: Math.max(s - 15, 10), l: 65 },
          { h, s, l },
          { h, s: Math.min(s + 10, 100), l: Math.max(l - 20, 15) },
          { h, s: Math.min(s + 20, 100), l: Math.max(l - 35, 10) },
        ];
        break;
      default: // tetradic
        hslStops = [
          { h, s, l },
          { h: h + 90, s, l },
          { h: h + 180, s, l },
          { h: h + 270, s, l },
          { h: h + 270, s, l: Math.min(l + 20, 90) },
        ];
        break;
    }

    return hslStops.map((item, i) => {
      const hex = hslToHex(item.h, item.s, item.l);
      const name = getColorName(item.h, item.s, item.l);
      return { hex, name, h: item.h, s: item.s, l: item.l, index: i };
    });
  }, [baseColor, harmony]);

  const cssVars = useMemo(() => {
    return `:root {\n` + palette.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join("\n") + `\n}`;
  }, [palette]);

  const handleRandomize = () => {
    const randomHex = `#` + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setBaseColor(randomHex);
  };

  const copyHex = (hex: string, index: number) => {
    copyToClipboard(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Generated Palette Engine Output">
            <div className="grid grid-cols-1 gap-3">
              {palette.map((item) => (
                <div
                  key={item.index}
                  onClick={() => copyHex(item.hex, item.index)}
                  className="group relative flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-sm transition hover:scale-[1.01]"
                  style={{ backgroundColor: item.hex }}
                >
                  <div>
                    <span
                      className="block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 text-white backdrop-blur-sm w-fit"
                    >
                      {item.name}
                    </span>
                    <span className="mt-1 block font-mono text-sm font-extrabold text-white drop-shadow">
                      {item.hex.toUpperCase()}
                    </span>
                  </div>
                  <span className="rounded bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md opacity-90 group-hover:opacity-100">
                    {copiedIndex === item.index ? "Copied!" : "Click to Copy"}
                  </span>
                </div>
              ))}
            </div>
          </Field>

          <Field label="CSS Variables Export">
            <CodeBox code={cssVars} language="css" />
          </Field>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-hive-500/20 bg-hive-500/5 p-3 text-xs text-hive-800 dark:text-hive-300">
          Smart Palette Engine calculates mathematical HSL color harmonies from your base seed color.
        </div>

        <Field label="Seed Base Color">
          <ColorInput value={baseColor} onChange={setBaseColor} />
        </Field>

        <Field label="Harmony Algorithm">
          <Select
            value={harmony}
            onChange={setHarmony}
            options={[
              { value: "analogous", label: "Analogous (Adjacent Hues)" },
              { value: "complementary", label: "Complementary (Opposite Hues)" },
              { value: "triadic", label: "Triadic (120° Spacing)" },
              { value: "split-complementary", label: "Split Complementary" },
              { value: "monochromatic", label: "Monochromatic Shades" },
              { value: "tetradic", label: "Tetradic (Rectangle)" },
            ]}
          />
        </Field>

        <Btn onClick={handleRandomize} variant="outline" className="w-full">
          🎲 Randomize Seed Color
        </Btn>
      </div>
    </ToolShell>
  );
}
