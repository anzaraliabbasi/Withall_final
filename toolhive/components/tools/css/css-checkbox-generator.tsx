"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

export default function CssCheckboxGenerator() {
  const [checked, setChecked] = useState(true);
  const [size, setSize] = useState(24);
  const [checkType, setCheckType] = useState<"check" | "square" | "dot" | "cross">("check");
  const [activeColor, setActiveColor] = useState("#f59e0b");
  const [inactiveColor, setInactiveColor] = useState("#94a3b8");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(6);

  const cssCode = `/* Custom Checkbox Container */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

/* Hidden Native Input */
.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Custom Box */
.checkmark-box {
  height: ${size}px;
  width: ${size}px;
  background-color: ${checked ? activeColor : "transparent"};
  border: 2px solid ${checked ? activeColor : inactiveColor};
  border-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Interactive Checkbox Preview">
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <label
                onClick={() => setChecked(!checked)}
                className="flex cursor-pointer items-center gap-3 select-none"
              >
                <div
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: checked ? activeColor : "transparent",
                    borderColor: checked ? activeColor : inactiveColor,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  {checked && checkType === "check" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="fill-none stroke-current"
                      style={{
                        stroke: iconColor,
                        strokeWidth: 3,
                        width: `${size * 0.65}px`,
                        height: `${size * 0.65}px`,
                      }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}

                  {checked && checkType === "square" && (
                    <div
                      style={{
                        backgroundColor: iconColor,
                        width: `${size * 0.45}px`,
                        height: `${size * 0.45}px`,
                        borderRadius: "2px",
                      }}
                    />
                  )}

                  {checked && checkType === "dot" && (
                    <div
                      style={{
                        backgroundColor: iconColor,
                        width: `${size * 0.5}px`,
                        height: `${size * 0.5}px`,
                        borderRadius: "50%",
                      }}
                    />
                  )}

                  {checked && checkType === "cross" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="fill-none stroke-current"
                      style={{
                        stroke: iconColor,
                        strokeWidth: 3,
                        width: `${size * 0.6}px`,
                        height: `${size * 0.6}px`,
                      }}
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Custom Checkbox Option
                </span>
              </label>

              <span className="text-xs text-slate-400">
                State: {checked ? "Checked" : "Unchecked"}
              </span>
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label={`Checkbox Size (${size}px)`}>
          <Range value={size} onChange={setSize} min={16} max={48} suffix="px" />
        </Field>

        <Field label="Checkmark Style">
          <Select
            value={checkType}
            onChange={(v) => setCheckType(v as any)}
            options={[
              { value: "check", label: "Classic Checkmark ✓" },
              { value: "square", label: "Solid Inner Square ■" },
              { value: "dot", label: "Radio Center Dot ●" },
              { value: "cross", label: "Cross / X ✕" },
            ]}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Checked Fill Color">
            <ColorInput value={activeColor} onChange={setActiveColor} />
          </Field>
          <Field label="Unchecked Border">
            <ColorInput value={inactiveColor} onChange={setInactiveColor} />
          </Field>
        </div>

        <Field label="Icon / Checkmark Color">
          <ColorInput value={iconColor} onChange={setIconColor} />
        </Field>

        <Field label={`Border Radius (${borderRadius}px)`}>
          <Range value={borderRadius} onChange={setBorderRadius} min={0} max={size / 2} suffix="px" />
        </Field>

        <Field label="Presets">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setActiveColor("#f59e0b"); setBorderRadius(6); setCheckType("check"); }}
            >
              Hive Rounded
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setActiveColor("#3b82f6"); setBorderRadius(0); setCheckType("square"); }}
            >
              Sharp Square
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setActiveColor("#10b981"); setBorderRadius(20); setCheckType("dot"); }}
            >
              Circular Pill
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
