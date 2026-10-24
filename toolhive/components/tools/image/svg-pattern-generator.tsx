"use client";

import React, { useState, useMemo } from "react";
import {
  ToolShell,
  Field,
  Range,
  ColorInput,
  Select,
  Output,
} from "@/components/ui/kit";
import { sanitizeSvg } from "@/lib/sanitize";

type PatternType =
  | "dots"
  | "stripes-diagonal"
  | "stripes-vertical"
  | "stripes-horizontal"
  | "cross"
  | "waves"
  | "grid"
  | "rings";

export default function SvgPatternGenerator() {
  const [patternType, setPatternType] = useState<PatternType>("dots");
  const [bgColor, setBgColor] = useState<string>("#0f172a");
  const [patternColor, setPatternColor] = useState<string>("#38bdf8");
  const [tileSize, setTileSize] = useState<number>(40);
  const [elementSize, setElementSize] = useState<number>(6);

  const patternData = useMemo(() => {
    const s = tileSize;
    const e = elementSize;
    let patternContent = "";

    switch (patternType) {
      case "dots":
        patternContent = `<circle cx="${s / 2}" cy="${s / 2}" r="${e}" fill="${patternColor}" />`;
        break;

      case "stripes-diagonal":
        patternContent = `<line x1="0" y1="0" x2="${s}" y2="${s}" stroke="${patternColor}" stroke-width="${e}" stroke-linecap="square" />
  <line x1="-${s / 4}" y1="${(3 * s) / 4}" x2="${s / 4}" y2="${(5 * s) / 4}" stroke="${patternColor}" stroke-width="${e}" stroke-linecap="square" />
  <line x1="${(3 * s) / 4}" y1="-${s / 4}" x2="${(5 * s) / 4}" y2="${s / 4}" stroke="${patternColor}" stroke-width="${e}" stroke-linecap="square" />`;
        break;

      case "stripes-vertical":
        patternContent = `<rect x="0" y="0" width="${e}" height="${s}" fill="${patternColor}" />`;
        break;

      case "stripes-horizontal":
        patternContent = `<rect x="0" y="0" width="${s}" height="${e}" fill="${patternColor}" />`;
        break;

      case "cross":
        patternContent = `<path d="M ${s / 2} 0 V ${s} M 0 ${s / 2} H ${s}" stroke="${patternColor}" stroke-width="${e}" stroke-linecap="square" />`;
        break;

      case "waves":
        patternContent = `<path d="M 0 ${s / 2} Q ${s / 4} ${s / 2 - e * 1.5}, ${s / 2} ${s / 2} T ${s} ${s / 2}" fill="none" stroke="${patternColor}" stroke-width="${e}" stroke-linecap="round" />`;
        break;

      case "grid":
        patternContent = `<path d="M ${s} 0 L 0 0 0 ${s}" fill="none" stroke="${patternColor}" stroke-width="${e}" />`;
        break;

      case "rings":
        patternContent = `<circle cx="${s / 2}" cy="${s / 2}" r="${e * 1.2}" fill="none" stroke="${patternColor}" stroke-width="2" />
  <circle cx="${s / 2}" cy="${s / 2}" r="${e * 2.4}" fill="none" stroke="${patternColor}" stroke-width="2" />`;
        break;

      default:
        patternContent = `<circle cx="${s / 2}" cy="${s / 2}" r="${e}" fill="${patternColor}" />`;
    }

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <pattern id="customPattern" x="0" y="0" width="${s}" height="${s}" patternUnits="userSpaceOnUse">
      <rect width="${s}" height="${s}" fill="${bgColor}" />
      ${patternContent}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#customPattern)" />
</svg>`;

    return { fullSvg, patternContent };
  }, [patternType, bgColor, patternColor, tileSize, elementSize]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pattern Live Tile Preview
            </span>
          </div>

          <div
            className="w-full h-72 rounded-2xl border border-slate-200 overflow-hidden shadow-inner dark:border-slate-800"
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(patternData.fullSvg) }}
          />

          <Output text={patternData.fullSvg} filename="pattern.svg" label="SVG Pattern Code" />
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          SVG Pattern Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Design seamless geometric repeating SVG patterns for backgrounds and UI designs.
        </p>

        <Field label="Pattern Preset">
          <Select
            value={patternType}
            onChange={(v) => setPatternType(v as PatternType)}
            options={[
              { value: "dots", label: "Polka Dots" },
              { value: "stripes-diagonal", label: "Diagonal Stripes" },
              { value: "stripes-vertical", label: "Vertical Stripes" },
              { value: "stripes-horizontal", label: "Horizontal Stripes" },
              { value: "cross", label: "Cross / Plus" },
              { value: "waves", label: "Sine Waves" },
              { value: "grid", label: "Grid Network" },
              { value: "rings", label: "Concentric Rings" },
            ]}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Background Color">
            <ColorInput value={bgColor} onChange={setBgColor} />
          </Field>

          <Field label="Pattern Color">
            <ColorInput value={patternColor} onChange={setPatternColor} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tile Unit Size">
            <Range
              value={tileSize}
              onChange={setTileSize}
              min={10}
              max={150}
              step={5}
              suffix="px"
            />
          </Field>

          <Field label="Element / Line Thickness">
            <Range
              value={elementSize}
              onChange={setElementSize}
              min={1}
              max={Math.max(2, Math.floor(tileSize / 2))}
              step={1}
              suffix="px"
            />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
