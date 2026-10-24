"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Toggle, CodeBox } from "@/components/ui/kit";

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  alpha: number;
  inset: boolean;
}

function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.substring(0, 2) || "0", 16);
  const g = parseInt(c.substring(2, 4) || "0", 16);
  const b = parseInt(c.substring(4, 6) || "0", 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PRESETS: { name: string; layers: ShadowLayer[] }[] = [
  {
    name: "Soft Drop",
    layers: [{ id: "1", x: 0, y: 10, blur: 25, spread: -5, color: "#000000", alpha: 0.1, inset: false }],
  },
  {
    name: "Material Medium",
    layers: [
      { id: "1", x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1, inset: false },
      { id: "2", x: 0, y: 2, blur: 4, spread: -1, color: "#000000", alpha: 0.06, inset: false },
    ],
  },
  {
    name: "Amber Hive Glow",
    layers: [
      { id: "1", x: 0, y: 0, blur: 20, spread: 5, color: "#f59e0b", alpha: 0.5, inset: false },
      { id: "2", x: 0, y: 0, blur: 40, spread: 10, color: "#d97706", alpha: 0.3, inset: false },
    ],
  },
  {
    name: "Inset Depressed",
    layers: [{ id: "1", x: 2, y: 2, blur: 8, spread: 0, color: "#000000", alpha: 0.25, inset: true }],
  },
];

export default function CssBoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: "1", x: 0, y: 10, blur: 25, spread: -5, color: "#000000", alpha: 0.15, inset: false },
  ]);
  const [activeId, setActiveId] = useState<string>("1");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#f1f5f9");

  const activeLayer = layers.find((l) => l.id === activeId) || layers[0];

  const updateActive = (key: keyof ShadowLayer, val: any) => {
    if (!activeLayer) return;
    setLayers(layers.map((l) => (l.id === activeLayer.id ? { ...l, [key]: val } : l)));
  };

  const addLayer = () => {
    const newId = String(Date.now());
    const newLayer: ShadowLayer = {
      id: newId,
      x: 0,
      y: 8,
      blur: 16,
      spread: 0,
      color: "#000000",
      alpha: 0.1,
      inset: false,
    };
    setLayers([...layers, newLayer]);
    setActiveId(newId);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  const cssValue = layers
    .map((l) => {
      const rgba = hexToRgba(l.color, l.alpha);
      return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
    })
    .join(",\n  ");

  const cssCode = `box-shadow: ${cssValue};`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Preview">
            <div
              className="flex h-72 w-full items-center justify-center rounded-2xl p-6 transition-all"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="flex h-36 w-36 items-center justify-center rounded-2xl transition-all"
                style={{
                  backgroundColor: boxColor,
                  boxShadow: layers
                    .map(
                      (l) =>
                        `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(
                          l.color,
                          l.alpha
                        )}`
                    )
                    .join(", "),
                }}
              >
                <span className="text-xs font-semibold text-slate-500">Box</span>
              </div>
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
                  setLayers(p.layers);
                  setActiveId(p.layers[0].id);
                }}
              >
                {p.name}
              </Btn>
            ))}
          </div>
        </Field>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-500">Shadow Layers ({layers.length})</span>
          <Btn variant="outline" className="!px-2 !py-1 !text-xs" onClick={addLayer}>
            + Add Layer
          </Btn>
        </div>

        <div className="flex flex-wrap gap-2">
          {layers.map((l, idx) => (
            <div
              key={l.id}
              onClick={() => setActiveId(l.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                l.id === activeLayer?.id
                  ? "border-hive-500 bg-hive-500/10 text-hive-600 dark:text-hive-400"
                  : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              <span>Layer #{idx + 1}</span>
              {layers.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(l.id);
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {activeLayer && (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <Toggle checked={activeLayer.inset} onChange={(v) => updateActive("inset", v)} label="Inset Shadow" />

            <Field label={`Offset X (${activeLayer.x}px)`}>
              <Range value={activeLayer.x} onChange={(v) => updateActive("x", v)} min={-100} max={100} suffix="px" />
            </Field>

            <Field label={`Offset Y (${activeLayer.y}px)`}>
              <Range value={activeLayer.y} onChange={(v) => updateActive("y", v)} min={-100} max={100} suffix="px" />
            </Field>

            <Field label={`Blur Radius (${activeLayer.blur}px)`}>
              <Range value={activeLayer.blur} onChange={(v) => updateActive("blur", v)} min={0} max={100} suffix="px" />
            </Field>

            <Field label={`Spread Radius (${activeLayer.spread}px)`}>
              <Range value={activeLayer.spread} onChange={(v) => updateActive("spread", v)} min={-50} max={50} suffix="px" />
            </Field>

            <Field label="Shadow Color">
              <ColorInput value={activeLayer.color} onChange={(v) => updateActive("color", v)} />
            </Field>

            <Field label={`Opacity (${Math.round(activeLayer.alpha * 100)}%)`}>
              <Range
                value={activeLayer.alpha}
                onChange={(v) => updateActive("alpha", v)}
                min={0}
                max={1}
                step={0.01}
                suffix=""
              />
            </Field>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Field label="Box Color">
            <ColorInput value={boxColor} onChange={setBoxColor} />
          </Field>
          <Field label="Background Color">
            <ColorInput value={bgColor} onChange={setBgColor} />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
