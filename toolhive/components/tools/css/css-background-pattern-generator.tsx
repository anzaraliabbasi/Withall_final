"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

export default function CssBackgroundPatternGenerator() {
  const [pattern, setPattern] = useState<"dots" | "stripes" | "diagonal" | "checkers" | "grid" | "zigzag">("dots");
  const [color1, setColor1] = useState("#f59e0b");
  const [color2, setColor2] = useState("#ffffff");
  const [size, setSize] = useState(20);

  let bgCss = "";

  if (pattern === "dots") {
    bgCss = `background-color: ${color2};
background-image: radial-gradient(${color1} 2px, transparent 2px);
background-size: ${size}px ${size}px;`;
  } else if (pattern === "stripes") {
    bgCss = `background-color: ${color2};
background-image: repeating-linear-gradient(90deg, ${color1}, ${color1} ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size}px);`;
  } else if (pattern === "diagonal") {
    bgCss = `background-color: ${color2};
background-image: repeating-linear-gradient(45deg, ${color1}, ${color1} ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size}px);`;
  } else if (pattern === "checkers") {
    bgCss = `background-color: ${color2};
background-image: linear-gradient(45deg, ${color1} 25%, transparent 25%), linear-gradient(-45deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color1} 75%), linear-gradient(-45deg, transparent 75%, ${color1} 75%);
background-size: ${size}px ${size}px;
background-position: 0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0px;`;
  } else if (pattern === "grid") {
    bgCss = `background-color: ${color2};
background-image: linear-gradient(to right, ${color1} 1px, transparent 1px), linear-gradient(to bottom, ${color1} 1px, transparent 1px);
background-size: ${size}px ${size}px;`;
  } else if (pattern === "zigzag") {
    bgCss = `background-color: ${color2};
background-image: linear-gradient(135deg, ${color1} 25%, transparent 25%), linear-gradient(225deg, ${color1} 25%, transparent 25%), linear-gradient(315deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, ${color1} 25%, transparent 25%);
background-size: ${size}px ${size}px;
background-position: -${size / 2}px 0, -${size / 2}px 0, 0 0, 0 0;`;
  }

  // Generate React inline style object
  const getInlineStyle = () => {
    if (pattern === "dots") {
      return {
        backgroundColor: color2,
        backgroundImage: `radial-gradient(${color1} 2px, transparent 2px)`,
        backgroundSize: `${size}px ${size}px`,
      };
    }
    if (pattern === "stripes") {
      return {
        backgroundColor: color2,
        backgroundImage: `repeating-linear-gradient(90deg, ${color1}, ${color1} ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size}px)`,
      };
    }
    if (pattern === "diagonal") {
      return {
        backgroundColor: color2,
        backgroundImage: `repeating-linear-gradient(45deg, ${color1}, ${color1} ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size}px)`,
      };
    }
    if (pattern === "checkers") {
      return {
        backgroundColor: color2,
        backgroundImage: `linear-gradient(45deg, ${color1} 25%, transparent 25%), linear-gradient(-45deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color1} 75%), linear-gradient(-45deg, transparent 75%, ${color1} 75%)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0px`,
      };
    }
    if (pattern === "grid") {
      return {
        backgroundColor: color2,
        backgroundImage: `linear-gradient(to right, ${color1} 1px, transparent 1px), linear-gradient(to bottom, ${color1} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      };
    }
    return {
      backgroundColor: color2,
      backgroundImage: `linear-gradient(135deg, ${color1} 25%, transparent 25%), linear-gradient(225deg, ${color1} 25%, transparent 25%), linear-gradient(315deg, ${color1} 25%, transparent 25%), linear-gradient(45deg, ${color1} 25%, transparent 25%)`,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `-${size / 2}px 0, -${size / 2}px 0, 0 0, 0 0`,
    };
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Pattern Preview">
            <div
              className="h-72 w-full rounded-2xl border border-slate-300 dark:border-slate-800 shadow-inner transition-all"
              style={getInlineStyle()}
            />
          </Field>
          <CodeBox code={bgCss} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Pattern Style">
          <Select
            value={pattern}
            onChange={(v) => setPattern(v as any)}
            options={[
              { value: "dots", label: "Polka Dots" },
              { value: "stripes", label: "Vertical Stripes" },
              { value: "diagonal", label: "Diagonal Stripes" },
              { value: "checkers", label: "Checkerboard" },
              { value: "grid", label: "Grid Lines" },
              { value: "zigzag", label: "Zigzag Chevron" },
            ]}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Pattern Color">
            <ColorInput value={color1} onChange={setColor1} />
          </Field>
          <Field label="Background Color">
            <ColorInput value={color2} onChange={setColor2} />
          </Field>
        </div>

        <Field label={`Pattern Size (${size}px)`}>
          <Range value={size} onChange={setSize} min={8} max={100} suffix="px" />
        </Field>

        <Field label="Quick Color Combos">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#f59e0b");
                setColor2("#fffbeb");
              }}
            >
              Hive Amber
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#3b82f6");
                setColor2("#eff6ff");
              }}
            >
              Soft Blue
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#334155");
                setColor2("#0f172a");
              }}
            >
              Dark Slate
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#ec4899");
                setColor2("#fdf2f8");
              }}
            >
              Pink Punch
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
