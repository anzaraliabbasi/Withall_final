"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, Toggle, CodeBox } from "@/components/ui/kit";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const PRESETS = [
  { name: "Hive Amber", type: "linear" as const, angle: 135, repeat: false, stops: [{ id: "1", color: "#f59e0b", position: 0 }, { id: "2", color: "#d97706", position: 50 }, { id: "3", color: "#b45309", position: 100 }] },
  { name: "Ocean Breeze", type: "linear" as const, angle: 90, repeat: false, stops: [{ id: "1", color: "#06b6d4", position: 0 }, { id: "2", color: "#3b82f6", position: 100 }] },
  { name: "Sunset Glow", type: "linear" as const, angle: 45, repeat: false, stops: [{ id: "1", color: "#ff7e5f", position: 0 }, { id: "2", color: "#feb47b", position: 100 }] },
  { name: "Conic Rainbow", type: "conic" as const, angle: 0, repeat: false, stops: [{ id: "1", color: "#ef4444", position: 0 }, { id: "2", color: "#eab308", position: 33 }, { id: "3", color: "#3b82f6", position: 66 }, { id: "4", color: "#ef4444", position: 100 }] },
  { name: "Radial Target", type: "radial" as const, angle: 0, repeat: true, stops: [{ id: "1", color: "#3b82f6", position: 0 }, { id: "2", color: "#3b82f6", position: 10 }, { id: "3", color: "#ffffff", position: 10 }, { id: "4", color: "#ffffff", position: 20 }] },
];

export default function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState("circle at center");
  const [repeat, setRepeat] = useState(false);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: "1", color: "#f59e0b", position: 0 },
    { id: "2", color: "#d97706", position: 100 },
  ]);

  const updateStop = (id: string, key: "color" | "position", val: string | number) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [key]: val } : s)));
  };

  const addStop = () => {
    if (stops.length >= 5) return;
    const newId = String(Date.now());
    const lastPos = stops[stops.length - 1]?.position ?? 50;
    const newPos = Math.min(100, lastPos + 10);
    setStops([...stops, { id: newId, color: "#3b82f6", position: newPos }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");

  let prefix = "";
  if (type === "linear") {
    prefix = repeat ? "repeating-linear-gradient" : "linear-gradient";
    prefix += `(${angle}deg, ${stopsString})`;
  } else if (type === "radial") {
    prefix = repeat ? "repeating-radial-gradient" : "radial-gradient";
    prefix += `(${radialShape}, ${stopsString})`;
  } else {
    prefix = repeat ? "repeating-conic-gradient" : "conic-gradient";
    prefix += `(from ${angle}deg at center, ${stopsString})`;
  }

  const cssCode = `background: ${prefix};`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Preview">
            <div
              className="h-64 w-full rounded-2xl border border-slate-200 shadow-inner dark:border-slate-800 transition-all"
              style={{ background: prefix }}
            />
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
                  setType(p.type);
                  setAngle(p.angle);
                  setRepeat(p.repeat);
                  setStops(p.stops);
                }}
              >
                {p.name}
              </Btn>
            ))}
          </div>
        </Field>

        <Field label="Gradient Type">
          <Select
            value={type}
            onChange={(v) => setType(v as "linear" | "radial" | "conic")}
            options={[
              { value: "linear", label: "Linear" },
              { value: "radial", label: "Radial" },
              { value: "conic", label: "Conic" },
            ]}
          />
        </Field>

        {type !== "radial" && (
          <Field label={`Angle (${angle} deg)`}>
            <Range value={angle} onChange={setAngle} min={0} max={360} suffix="°" />
          </Field>
        )}

        {type === "radial" && (
          <Field label="Radial Shape & Position">
            <Select
              value={radialShape}
              onChange={setRadialShape}
              options={[
                { value: "circle at center", label: "Circle at Center" },
                { value: "ellipse at center", label: "Ellipse at Center" },
                { value: "circle at top left", label: "Circle at Top Left" },
                { value: "circle at bottom right", label: "Circle at Bottom Right" },
              ]}
            />
          </Field>
        )}

        <Toggle checked={repeat} onChange={setRepeat} label="Repeat Gradient" />

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Color Stops</span>
            {stops.length < 5 && (
              <Btn variant="outline" className="!px-2 !py-1 !text-xs" onClick={addStop}>
                + Add Stop
              </Btn>
            )}
          </div>

          {stops.map((stop, idx) => (
            <div key={stop.id} className="rounded-xl border border-slate-200 p-3 space-y-2 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Stop #{idx + 1}</span>
                {stops.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeStop(stop.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <ColorInput value={stop.color} onChange={(v) => updateStop(stop.id, "color", v)} />
              <Field label={`Position (${stop.position}%)`}>
                <Range
                  value={stop.position}
                  onChange={(v) => updateStop(stop.id, "position", v)}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </Field>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
