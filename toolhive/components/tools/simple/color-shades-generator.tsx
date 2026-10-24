"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, ColorInput, CodeBox } from "@/components/ui/kit";
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

// Blend towards white for tints, black for shades
function blend(baseRgb: { r: number; g: number; b: number }, targetRgb: { r: number; g: number; b: number }, weight: number) {
  return {
    r: baseRgb.r + (targetRgb.r - baseRgb.r) * weight,
    g: baseRgb.g + (targetRgb.g - baseRgb.g) * weight,
    b: baseRgb.b + (targetRgb.b - baseRgb.b) * weight,
  };
}

const STEPS = [
  { name: "50", weight: 0.95, target: "white" },
  { name: "100", weight: 0.85, target: "white" },
  { name: "200", weight: 0.65, target: "white" },
  { name: "300", weight: 0.45, target: "white" },
  { name: "400", weight: 0.25, target: "white" },
  { name: "500", weight: 0, target: "base" }, // Base color
  { name: "600", weight: 0.2, target: "black" },
  { name: "700", weight: 0.4, target: "black" },
  { name: "800", weight: 0.6, target: "black" },
  { name: "900", weight: 0.75, target: "black" },
  { name: "950", weight: 0.9, target: "black" },
];

export default function ColorShadesGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const shades = useMemo(() => {
    const baseRgb = hexToRgb(baseColor);
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    return STEPS.map((step) => {
      let finalRgb = baseRgb;
      if (step.target === "white") {
        finalRgb = blend(baseRgb, white, step.weight);
      } else if (step.target === "black") {
        finalRgb = blend(baseRgb, black, step.weight);
      }
      const hex = rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
      return { step: step.name, hex };
    });
  }, [baseColor]);

  const cssVars = useMemo(() => {
    return `:root {\n` + shades.map((s) => `  --color-shade-${s.step}: ${s.hex};`).join("\n") + `\n}`;
  }, [shades]);

  const tailwindConfig = useMemo(() => {
    const obj = shades.reduce((acc, s) => {
      acc[s.step] = s.hex;
      return acc;
    }, {} as Record<string, string>);
    return `'brand': ${JSON.stringify(obj, null, 2)}`;
  }, [shades]);

  const copyStep = (step: string, hex: string) => {
    copyToClipboard(hex);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="CSS Variables Export">
            <CodeBox code={cssVars} language="css" />
          </Field>

          <Field label="Tailwind CSS Config Snippet">
            <CodeBox code={tailwindConfig} language="javascript" />
          </Field>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Base Color (500 Step)">
          <ColorInput value={baseColor} onChange={setBaseColor} />
        </Field>

        <Field label="Generated 11-Step Tint & Shade Palette">
          <div className="grid grid-cols-1 gap-2">
            {shades.map((item) => (
              <div
                key={item.step}
                onClick={() => copyStep(item.step, item.hex)}
                className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 shadow-sm transition hover:scale-[1.01]"
                style={{ backgroundColor: item.hex }}
              >
                <span className="font-mono text-xs font-bold text-white drop-shadow">
                  {item.step}
                </span>
                <span className="font-mono text-xs font-semibold text-white drop-shadow">
                  {item.hex.toUpperCase()}
                </span>
                <span className="rounded bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm opacity-90 group-hover:opacity-100">
                  {copiedStep === item.step ? "Copied!" : "Copy"}
                </span>
              </div>
            ))}
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
