"use client";

import React, { useState, useMemo } from "react";
import {
  ToolShell,
  Field,
  Btn,
  Range,
  ColorInput,
  Toggle,
  Select,
  Output,
  TextInput,
} from "@/components/ui/kit";
import { sanitizeSvg } from "@/lib/sanitize";

// Simple deterministic PRNG (mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function SvgBlobGenerator() {
  const [seed, setSeed] = useState<number>(12345);
  const [pointsCount, setPointsCount] = useState<number>(6);
  const [randomness, setRandomness] = useState<number>(40); // 10% to 90%
  const [smoothness, setSmoothness] = useState<number>(25); // 10% to 45%
  const [fillMode, setFillMode] = useState<"solid" | "linear" | "radial">("linear");
  const [color1, setColor1] = useState<string>("#f59e0b");
  const [color2, setColor2] = useState<string>("#ef4444");
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [enableStroke, setEnableStroke] = useState<boolean>(false);
  const [strokeColor, setStrokeColor] = useState<string>("#1e293b");
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [size, setSize] = useState<number>(500);

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const svgData = useMemo(() => {
    const center = size / 2;
    const maxStroke = enableStroke ? strokeWidth : 0;
    const baseRadius = (size / 2 - maxStroke - 20) * 0.75;
    const randFactor = randomness / 100;
    const smoothFactor = smoothness / 100;

    const rng = mulberry32(seed);
    const points: { x: number; y: number }[] = [];
    const angleStep = (Math.PI * 2) / pointsCount;

    for (let i = 0; i < pointsCount; i++) {
      const angle = i * angleStep;
      const r = baseRadius * (1 + (rng() - 0.5) * randFactor);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points.push({ x, y });
    }

    const n = points.length;
    let pathD = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 0; i < n; i++) {
      const pPrev = points[(i - 1 + n) % n];
      const pCurr = points[i];
      const pNext = points[(i + 1) % n];
      const pNextNext = points[(i + 2) % n];

      const cp1x = pCurr.x + (pNext.x - pPrev.x) * smoothFactor;
      const cp1y = pCurr.y + (pNext.y - pPrev.y) * smoothFactor;

      const cp2x = pNext.x - (pNextNext.x - pCurr.x) * smoothFactor;
      const cp2y = pNext.y - (pNextNext.y - pCurr.y) * smoothFactor;

      pathD += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${pNext.x.toFixed(2)} ${pNext.y.toFixed(2)}`;
    }
    pathD += " Z";

    let defsStr = "";
    let fillAttr = "";

    if (fillMode === "solid") {
      fillAttr = color1;
    } else if (fillMode === "linear") {
      const rad = (gradientAngle * Math.PI) / 180;
      const x1 = Math.round(50 + Math.cos(rad) * 50);
      const y1 = Math.round(50 + Math.sin(rad) * 50);
      const x2 = Math.round(50 - Math.cos(rad) * 50);
      const y2 = Math.round(50 - Math.sin(rad) * 50);
      defsStr = `  <defs>\n    <linearGradient id="blobGrad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">\n      <stop offset="0%" stop-color="${color1}" />\n      <stop offset="100%" stop-color="${color2}" />\n    </linearGradient>\n  </defs>\n`;
      fillAttr = "url(#blobGrad)";
    } else {
      defsStr = `  <defs>\n    <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">\n      <stop offset="0%" stop-color="${color1}" />\n      <stop offset="100%" stop-color="${color2}" />\n    </radialGradient>\n  </defs>\n`;
      fillAttr = "url(#blobGrad)";
    }

    const strokeAttr = enableStroke
      ? ` stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round"`
      : "";

    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n${defsStr}  <path d="${pathD}" fill="${fillAttr}"${strokeAttr} />\n</svg>`;

    return { rawSvg, pathD, defsStr, fillAttr, strokeAttr };
  }, [
    seed,
    pointsCount,
    randomness,
    smoothness,
    fillMode,
    color1,
    color2,
    gradientAngle,
    enableStroke,
    strokeColor,
    strokeWidth,
    size,
  ]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Live Preview
            </span>
            <Btn variant="outline" className="!px-3 !py-1 !text-xs" onClick={randomizeSeed}>
              🔀 Shuffle Blob
            </Btn>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div
              className="absolute inset-0 opacity-20 dark:opacity-10"
              style={{
                backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
            <div
              className="relative w-full max-w-[340px] aspect-square"
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(svgData.rawSvg) }}
            />
          </div>

          <Output text={svgData.rawSvg} filename="blob.svg" label="SVG Source Code" />
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          SVG Blob Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Create smooth, customizable organic vector blob shapes with seeded random generation.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Seed Number">
            <div className="flex gap-2">
              <TextInput
                type="number"
                value={String(seed)}
                onChange={(v) => setSeed(parseInt(v) || 0)}
              />
              <Btn variant="outline" onClick={randomizeSeed} className="!px-3">
                🎲
              </Btn>
            </div>
          </Field>

          <Field label="Complexity (Points)">
            <Range value={pointsCount} onChange={setPointsCount} min={3} max={16} step={1} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Randomness Variation">
            <Range
              value={randomness}
              onChange={setRandomness}
              min={10}
              max={90}
              suffix="%"
            />
          </Field>

          <Field label="Smoothness">
            <Range
              value={smoothness}
              onChange={setSmoothness}
              min={10}
              max={45}
              suffix="%"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fill Mode">
            <Select
              value={fillMode}
              onChange={(v) => setFillMode(v as "solid" | "linear" | "radial")}
              options={[
                { value: "linear", label: "Linear Gradient" },
                { value: "radial", label: "Radial Gradient" },
                { value: "solid", label: "Solid Color" },
              ]}
            />
          </Field>

          <Field label="Canvas Size">
            <Range value={size} onChange={setSize} min={200} max={800} step={50} suffix="px" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={fillMode === "solid" ? "Blob Color" : "Start Color"}>
            <ColorInput value={color1} onChange={setColor1} />
          </Field>

          {fillMode !== "solid" && (
            <Field label="End Color">
              <ColorInput value={color2} onChange={setColor2} />
            </Field>
          )}
        </div>

        {fillMode === "linear" && (
          <Field label="Gradient Angle">
            <Range
              value={gradientAngle}
              onChange={setGradientAngle}
              min={0}
              max={360}
              step={5}
              suffix="°"
            />
          </Field>
        )}

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Toggle
            checked={enableStroke}
            onChange={setEnableStroke}
            label="Enable Outline / Stroke"
          />

          {enableStroke && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stroke Color">
                <ColorInput value={strokeColor} onChange={setStrokeColor} />
              </Field>

              <Field label="Stroke Width">
                <Range
                  value={strokeWidth}
                  onChange={setStrokeWidth}
                  min={1}
                  max={20}
                  suffix="px"
                />
              </Field>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
