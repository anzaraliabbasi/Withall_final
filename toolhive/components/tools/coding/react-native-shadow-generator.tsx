"use client";

import React, { useState } from "react";
import { ToolShell, Field, ColorInput, Range, CodeBox, StatPill } from "@/components/ui/kit";

export default function ReactNativeShadowGenerator() {
  const [shadowColor, setShadowColor] = useState("#000000");
  const [offsetWidth, setOffsetWidth] = useState(0);
  const [offsetHeight, setOffsetHeight] = useState(4);
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [shadowRadius, setShadowRadius] = useState(4.65);
  const [elevation, setElevation] = useState(8);

  // Convert shadowColor hex to rgba for CSS preview
  const hexToRgba = (hex: string, alpha: number) => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return `rgba(0,0,0,${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const iosCssShadow = `${offsetWidth}px ${offsetHeight}px ${shadowRadius * 2}px ${hexToRgba(
    shadowColor,
    shadowOpacity
  )}`;

  // Android elevation preview approximation in CSS
  const androidCssShadow = `0px ${elevation * 0.5}px ${elevation * 1.5}px rgba(0,0,0,${Math.min(
    0.15 + elevation * 0.015,
    0.4
  )})`;

  const codeOutput = `// React Native Style Object
shadowColor: "${shadowColor}",
shadowOffset: {
  width: ${offsetWidth},
  height: ${offsetHeight},
},
shadowOpacity: ${shadowOpacity},
shadowRadius: ${shadowRadius},
elevation: ${elevation},`;

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <CodeBox code={codeOutput} language="typescript" />

          {/* Previews */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Live Component Previews
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* iOS Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                <span className="mb-4 text-xs font-bold text-slate-500">iOS Shadow</span>
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 transition-all"
                  style={{ boxShadow: iosCssShadow }}
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">iOS Box</span>
                </div>
              </div>

              {/* Android Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                <span className="mb-4 text-xs font-bold text-slate-500">Android Elevation</span>
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 transition-all"
                  style={{ boxShadow: androidCssShadow }}
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Android</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="iOS Shadow Area" value={`${Math.round(shadowRadius * 2)}px`} />
            <StatPill label="Android Level" value={`Level ${elevation}`} />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Shadow Color">
          <ColorInput value={shadowColor} onChange={setShadowColor} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Shadow Offset Width (X)">
            <Range value={offsetWidth} onChange={setOffsetWidth} min={-20} max={20} step={1} suffix="px" />
          </Field>

          <Field label="Shadow Offset Height (Y)">
            <Range value={offsetHeight} onChange={setOffsetHeight} min={-20} max={20} step={1} suffix="px" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Shadow Opacity">
            <Range value={shadowOpacity} onChange={setShadowOpacity} min={0} max={1} step={0.05} />
          </Field>

          <Field label="Shadow Radius">
            <Range value={shadowRadius} onChange={setShadowRadius} min={0} max={30} step={0.5} suffix="px" />
          </Field>
        </div>

        <Field label="Android Elevation">
          <Range value={elevation} onChange={setElevation} min={0} max={24} step={1} />
        </Field>
      </div>
    </ToolShell>
  );
}
