"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

export default function CssSwitchGenerator() {
  const [checked, setChecked] = useState(true);
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(32);
  const [onColor, setOnColor] = useState("#f59e0b"); // Hive Amber
  const [offColor, setOffColor] = useState("#cbd5e1");
  const [knobColor, setKnobColor] = useState("#ffffff");
  const [knobShape, setKnobShape] = useState<"round" | "square" | "soft">("round");
  const [speed, setSpeed] = useState(0.3);

  const knobMargin = 4;
  const knobSize = height - knobMargin * 2;
  const translateDist = width - knobSize - knobMargin * 2;

  let trackRadius = `${height / 2}px`;
  let knobRadius = "50%";

  if (knobShape === "square") {
    trackRadius = "4px";
    knobRadius = "2px";
  } else if (knobShape === "soft") {
    trackRadius = "8px";
    knobRadius = "6px";
  }

  const cssCode = `/* Switch Track */
.switch-track {
  position: relative;
  display: inline-block;
  width: ${width}px;
  height: ${height}px;
  background-color: ${checked ? onColor : offColor};
  border-radius: ${trackRadius};
  cursor: pointer;
  transition: background-color ${speed}s ease;
}

/* Switch Knob */
.switch-knob {
  position: absolute;
  top: ${knobMargin}px;
  left: ${knobMargin}px;
  width: ${knobSize}px;
  height: ${knobSize}px;
  background-color: ${knobColor};
  border-radius: ${knobRadius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform ${speed}s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${checked ? translateDist : 0}px);
}`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Interactive Switch Preview (Click to Toggle)">
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div
                onClick={() => setChecked(!checked)}
                className="relative cursor-pointer transition-colors"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  backgroundColor: checked ? onColor : offColor,
                  borderRadius: trackRadius,
                  transition: `background-color ${speed}s ease`,
                }}
              >
                <div
                  className="absolute shadow-md"
                  style={{
                    top: `${knobMargin}px`,
                    left: `${knobMargin}px`,
                    width: `${knobSize}px`,
                    height: `${knobSize}px`,
                    backgroundColor: knobColor,
                    borderRadius: knobRadius,
                    transform: `translateX(${checked ? translateDist : 0}px)`,
                    transition: `transform ${speed}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                />
              </div>

              <span className="text-xs font-semibold text-slate-500">
                Status: {checked ? "ON" : "OFF"}
              </span>
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Width (${width}px)`}>
            <Range value={width} onChange={setWidth} min={36} max={120} suffix="px" />
          </Field>
          <Field label={`Height (${height}px)`}>
            <Range value={height} onChange={setHeight} min={20} max={60} suffix="px" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="ON Color">
            <ColorInput value={onColor} onChange={setOnColor} />
          </Field>
          <Field label="OFF Color">
            <ColorInput value={offColor} onChange={setOffColor} />
          </Field>
        </div>

        <Field label="Knob Color">
          <ColorInput value={knobColor} onChange={setKnobColor} />
        </Field>

        <Field label="Knob / Track Shape">
          <Select
            value={knobShape}
            onChange={(v) => setKnobShape(v as any)}
            options={[
              { value: "round", label: "Pill / Fully Round" },
              { value: "soft", label: "Soft Curved Rectangle" },
              { value: "square", label: "Square / Modern Sharp" },
            ]}
          />
        </Field>

        <Field label={`Animation Speed (${speed}s)`}>
          <Range value={speed} onChange={setSpeed} min={0.1} max={1} step={0.05} suffix="s" />
        </Field>

        <Field label="Color Schemes">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setOnColor("#f59e0b"); setOffColor("#cbd5e1"); }}
            >
              Hive Amber
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setOnColor("#10b981"); setOffColor("#e2e8f0"); }}
            >
              Emerald Green
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setOnColor("#3b82f6"); setOffColor("#334155"); }}
            >
              Dark Indigo
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
