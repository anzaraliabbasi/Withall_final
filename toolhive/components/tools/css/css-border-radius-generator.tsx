"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

const PRESETS = [
  { name: "Pill / Circle", mode: "standard" as const, tl: 100, tr: 100, br: 100, bl: 100, unit: "%" },
  { name: "Soft Card", mode: "standard" as const, tl: 16, tr: 16, br: 16, bl: 16, unit: "px" },
  { name: "Leaf", mode: "standard" as const, tl: 80, tr: 0, br: 80, bl: 0, unit: "px" },
  {
    name: "Organic Blob 1",
    mode: "8corners" as const,
    tlX: 30, trX: 70, brX: 70, blX: 30,
    tlY: 30, trY: 30, brY: 70, blY: 70,
    unit: "%",
  },
  {
    name: "Organic Blob 2",
    mode: "8corners" as const,
    tlX: 60, trX: 40, brX: 30, blX: 70,
    tlY: 40, trY: 60, brY: 70, blY: 30,
    unit: "%",
  },
];

export default function CssBorderRadiusGenerator() {
  const [mode, setMode] = useState<"standard" | "8corners">("8corners");
  const [unit, setUnit] = useState<"px" | "%">("%");

  // Standard 4 corners
  const [tl, setTl] = useState(30);
  const [tr, setTr] = useState(70);
  const [br, setBr] = useState(70);
  const [bl, setBl] = useState(30);

  // 8 corner values (X and Y radii for each corner)
  const [tlX, setTlX] = useState(30);
  const [trX, setTrX] = useState(70);
  const [brX, setBrX] = useState(70);
  const [blX, setBlX] = useState(30);

  const [tlY, setTlY] = useState(30);
  const [trY, setTrY] = useState(30);
  const [brY, setBrY] = useState(70);
  const [blY, setBlY] = useState(70);

  const [boxBg, setBoxBg] = useState("#f59e0b");

  let borderRadiusValue = "";
  if (mode === "standard") {
    if (tl === tr && tr === br && br === bl) {
      borderRadiusValue = `${tl}${unit}`;
    } else {
      borderRadiusValue = `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
    }
  } else {
    borderRadiusValue = `${tlX}${unit} ${trX}${unit} ${brX}${unit} ${blX}${unit} / ${tlY}${unit} ${trY}${unit} ${brY}${unit} ${blY}${unit}`;
  }

  const cssCode = `border-radius: ${borderRadiusValue};`;

  const maxVal = unit === "%" ? 100 : 150;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Preview">
            <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
              <div
                className="h-44 w-44 shadow-lg transition-all"
                style={{
                  backgroundColor: boxBg,
                  borderRadius: borderRadiusValue,
                }}
              />
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Presets">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Btn
                key={p.name}
                variant="outline"
                className="!px-2.5 !py-1 !text-xs"
                onClick={() => {
                  setMode(p.mode);
                  setUnit(p.unit as "px" | "%");
                  if (p.mode === "standard") {
                    setTl(p.tl!); setTr(p.tr!); setBr(p.br!); setBl(p.bl!);
                  } else {
                    setTlX(p.tlX!); setTrX(p.trX!); setBrX(p.brX!); setBlX(p.blX!);
                    setTlY(p.tlY!); setTrY(p.trY!); setBrY(p.brY!); setBlY(p.blY!);
                  }
                }}
              >
                {p.name}
              </Btn>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Radius Mode">
            <Select
              value={mode}
              onChange={(v) => setMode(v as "standard" | "8corners")}
              options={[
                { value: "8corners", label: "8-Value Full Radius / Blob" },
                { value: "standard", label: "4-Corner Radius" },
              ]}
            />
          </Field>
          <Field label="Unit">
            <Select
              value={unit}
              onChange={(v) => setUnit(v as "px" | "%")}
              options={[
                { value: "%", label: "% (Percentage)" },
                { value: "px", label: "px (Pixels)" },
              ]}
            />
          </Field>
        </div>

        {mode === "standard" ? (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <Field label={`Top-Left (${tl}${unit})`}>
              <Range value={tl} onChange={setTl} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Top-Right (${tr}${unit})`}>
              <Range value={tr} onChange={setTr} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Right (${br}${unit})`}>
              <Range value={br} onChange={setBr} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Left (${bl}${unit})`}>
              <Range value={bl} onChange={setBl} min={0} max={maxVal} suffix={unit} />
            </Field>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase text-slate-500">Horizontal Radii (X)</div>
            <Field label={`Top-Left X (${tlX}${unit})`}>
              <Range value={tlX} onChange={setTlX} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Top-Right X (${trX}${unit})`}>
              <Range value={trX} onChange={setTrX} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Right X (${brX}${unit})`}>
              <Range value={brX} onChange={setBrX} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Left X (${blX}${unit})`}>
              <Range value={blX} onChange={setBlX} min={0} max={maxVal} suffix={unit} />
            </Field>

            <div className="text-xs font-semibold uppercase text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              Vertical Radii (Y)
            </div>
            <Field label={`Top-Left Y (${tlY}${unit})`}>
              <Range value={tlY} onChange={setTlY} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Top-Right Y (${trY}${unit})`}>
              <Range value={trY} onChange={setTrY} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Right Y (${brY}${unit})`}>
              <Range value={brY} onChange={setBrY} min={0} max={maxVal} suffix={unit} />
            </Field>
            <Field label={`Bottom-Left Y (${blY}${unit})`}>
              <Range value={blY} onChange={setBlY} min={0} max={maxVal} suffix={unit} />
            </Field>
          </div>
        )}

        <Field label="Preview Box Color">
          <ColorInput value={boxBg} onChange={setBoxBg} />
        </Field>
      </div>
    </ToolShell>
  );
}
