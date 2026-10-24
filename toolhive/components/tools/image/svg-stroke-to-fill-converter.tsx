"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, Btn, TextArea, FileDrop, ColorInput, Output } from "@/components/ui/kit";
import { downloadText } from "@/lib/download";
import { sanitizeSvg } from "@/lib/sanitize";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <circle cx="50" cy="50" r="40" stroke="#f59e0b" stroke-width="8" fill="none" />
  <path d="M 30 50 L 45 65 L 70 35" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`;

export default function SvgStrokeToFillConverter() {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVG);
  const [fillColor, setFillColor] = useState<string>("#f59e0b");
  const [overrideFill, setOverrideFill] = useState<boolean>(true);
  const [removeStrokes, setRemoveStrokes] = useState<boolean>(true);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setSvgInput(e.target.result);
      }
    };
    reader.readAsText(file);
  };

  const convertedSvg = useMemo(() => {
    if (!svgInput.trim()) return "";
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgInput, "image/svg+xml");

      const parserError = doc.querySelector("parsererror");
      if (parserError) return "<!-- Invalid SVG XML -->";

      const elements = doc.querySelectorAll(
        "path, circle, rect, polygon, polyline, ellipse, line, g, shape"
      );

      elements.forEach((el) => {
        const strokeAttr = el.getAttribute("stroke");

        // 1. If element has stroke and no fill or fill="none", transfer stroke color to fill
        if (strokeAttr && strokeAttr !== "none" && !overrideFill) {
          el.setAttribute("fill", strokeAttr);
        } else if (overrideFill) {
          el.setAttribute("fill", fillColor);
        }

        // 2. Remove or reset stroke attributes
        if (removeStrokes) {
          el.setAttribute("stroke", "none");
          el.removeAttribute("stroke-width");
          el.removeAttribute("stroke-dasharray");
          el.removeAttribute("stroke-linecap");
          el.removeAttribute("stroke-linejoin");
        }

        // 3. Clean up style attribute if inline styles exist
        const styleAttr = el.getAttribute("style");
        if (styleAttr) {
          let newStyle = styleAttr;
          if (removeStrokes) {
            newStyle = newStyle.replace(/stroke\s*:\s*[^;]+;?/gi, "stroke: none;");
          }
          if (overrideFill) {
            newStyle = newStyle.replace(/fill\s*:\s*[^;]+;?/gi, `fill: ${fillColor};`);
          }
          el.setAttribute("style", newStyle);
        }
      });

      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    } catch {
      return "<!-- Error processing SVG -->";
    }
  }, [svgInput, fillColor, overrideFill, removeStrokes]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Fill Color Selection">
            <ColorInput value={fillColor} onChange={setFillColor} />
          </Field>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={overrideFill}
                onChange={(e) => setOverrideFill(e.target.checked)}
                className="rounded border-slate-300 text-hive-500 focus:ring-hive-500"
              />
              Set target color as fill on all shape elements
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={removeStrokes}
                onChange={(e) => setRemoveStrokes(e.target.checked)}
                className="rounded border-slate-300 text-hive-500 focus:ring-hive-500"
              />
              Remove stroke properties (set stroke="none")
            </label>
          </div>

          <Field label="Visual SVG Preview">
            <div className="flex justify-center items-center p-6 rounded-xl border border-slate-200 bg-slate-900 min-h-[180px]">
              {convertedSvg && convertedSvg !== "<!-- Invalid SVG XML -->" && (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sanitizeSvg(convertedSvg))}`}
                  alt="Converted SVG preview"
                  className="max-w-full"
                  style={{ maxHeight: 360 }}
                 loading="lazy" decoding="async" />
              )}
            </div>
          </Field>

          <Output text={convertedSvg} label="Converted SVG Code" filename="fill-converted.svg" />

          <Btn onClick={() => downloadText(convertedSvg, "converted-vector.svg", "image/svg+xml")} className="w-full">
            Download Converted SVG File
          </Btn>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">SVG Stroke to Fill Converter</h2>
          <p className="text-xs text-slate-500">
            Convert stroke-based vector icons into filled shapes, setting custom fill colors and stripping stroke attributes.
          </p>
        </div>

        <FileDrop accept=".svg,image/svg+xml" onFiles={handleFiles} label="Drop .svg file here or click to browse" />

        <Field label="Input SVG Code">
          <TextArea
            value={svgInput}
            onChange={setSvgInput}
            rows={10}
            mono
            placeholder="<svg ...></svg>"
          />
        </Field>
      </div>
    </ToolShell>
  );
}
