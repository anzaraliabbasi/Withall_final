"use client";

import { useState } from "react";
import { ToolShell, Field, Select, Range, ColorInput, CodeBox } from "@/components/ui/kit";

type Direction = "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function CssTriangleGenerator() {
  const [direction, setDirection] = useState<Direction>("top");
  const [size, setSize] = useState(60); // height
  const [baseWidth, setBaseWidth] = useState(80); // base width
  const [color, setColor] = useState("#f59e0b");
  const [bgColor, setBgColor] = useState("#f8fafc");

  const halfWidth = Math.round(baseWidth / 2);

  let borderWidths = "";
  let borderColors = "";

  switch (direction) {
    case "top":
      borderWidths = `0 ${halfWidth}px ${size}px ${halfWidth}px`;
      borderColors = `transparent transparent ${color} transparent`;
      break;
    case "bottom":
      borderWidths = `${size}px ${halfWidth}px 0 ${halfWidth}px`;
      borderColors = `${color} transparent transparent transparent`;
      break;
    case "left":
      borderWidths = `${halfWidth}px ${size}px ${halfWidth}px 0`;
      borderColors = `transparent ${color} transparent transparent`;
      break;
    case "right":
      borderWidths = `${halfWidth}px 0 ${halfWidth}px ${size}px`;
      borderColors = `transparent transparent transparent ${color}`;
      break;
    case "top-left":
      borderWidths = `${size}px ${baseWidth}px 0 0`;
      borderColors = `${color} transparent transparent transparent`;
      break;
    case "top-right":
      borderWidths = `0 ${baseWidth}px ${size}px 0`;
      borderColors = `transparent ${color} transparent transparent`;
      break;
    case "bottom-left":
      borderWidths = `${size}px 0 0 ${baseWidth}px`;
      borderColors = `transparent transparent transparent ${color}`;
      break;
    case "bottom-right":
      borderWidths = `0 0 ${size}px ${baseWidth}px`;
      borderColors = `transparent transparent ${color} transparent`;
      break;
  }

  const cssCode = `width: 0;
height: 0;
border-style: solid;
border-width: ${borderWidths};
border-color: ${borderColors};`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Preview">
            <div
              className="flex h-72 w-full items-center justify-center rounded-2xl border border-slate-200 shadow-inner transition-all dark:border-slate-800"
              style={{ backgroundColor: bgColor }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: borderWidths,
                  borderColor: borderColors,
                }}
              />
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Direction">
          <Select
            value={direction}
            onChange={(v) => setDirection(v as Direction)}
            options={[
              { value: "top", label: "Top ▲" },
              { value: "bottom", label: "Bottom ▼" },
              { value: "left", label: "Left ◀" },
              { value: "right", label: "Right ▶" },
              { value: "top-left", label: "Top-Left ◤" },
              { value: "top-right", label: "Top-Right ◥" },
              { value: "bottom-left", label: "Bottom-Left ◣" },
              { value: "bottom-right", label: "Bottom-Right ◢" },
            ]}
          />
        </Field>

        <Field label={`Height / Depth (${size}px)`}>
          <Range value={size} onChange={setSize} min={10} max={200} suffix="px" />
        </Field>

        <Field label={`Base Width (${baseWidth}px)`}>
          <Range value={baseWidth} onChange={setBaseWidth} min={10} max={200} suffix="px" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Triangle Color">
            <ColorInput value={color} onChange={setColor} />
          </Field>
          <Field label="Preview BG Color">
            <ColorInput value={bgColor} onChange={setBgColor} />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
