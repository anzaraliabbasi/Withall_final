"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { ToolShell, Field, TextInput, Select, Range, ColorInput, Toggle, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, downloadText } from "@/lib/download";

export default function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [error, setError] = useState("");

  const svgRef = useRef<SVGSVGElement | null>(null);

  const renderBarcode = useCallback(() => {
    if (!svgRef.current) return;
    if (!value.trim()) {
      setError("Please enter value to generate barcode");
      return;
    }

    try {
      setError("");
      // Clear SVG
      svgRef.current.innerHTML = "";

      JsBarcode(svgRef.current, value.trim(), {
        format: format,
        lineColor: lineColor,
        background: background,
        width: width,
        height: height,
        displayValue: displayValue,
        fontSize: fontSize,
        margin: 10,
        valid: (valid) => {
          if (!valid) {
            setError(`Invalid value format for ${format}`);
          }
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to generate ${format} barcode`);
    }
  }, [value, format, lineColor, background, width, height, displayValue, fontSize]);

  useEffect(() => {
    renderBarcode();
  }, [renderBarcode]);

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    downloadText(svgData, `barcode-${format.toLowerCase()}.svg`, "image/svg+xml");
  };

  const handleDownloadPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width || 400;
      canvas.height = img.height || 200;
      if (ctx) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `barcode-${format.toLowerCase()}.png`);
        });
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Format Standard" value={format} />

          <Field label="Barcode SVG Preview">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950 overflow-x-auto min-h-[160px]">
              <svg ref={svgRef} className="max-w-full" />
            </div>
          </Field>

          {error ? (
            <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {error}
            </div>
          ) : (
            <div className="flex gap-2">
              <Btn onClick={handleDownloadSvg} variant="primary" className="flex-1">
                Download SVG
              </Btn>
              <Btn onClick={handleDownloadPng} variant="outline" className="flex-1">
                Download PNG
              </Btn>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Barcode Value" hint={format === "EAN13" ? "Requires 12 or 13 digits" : "Text or digits depending on format"}>
          <TextInput
            value={value}
            onChange={setValue}
            placeholder="e.g. 123456789012"
            mono
          />
        </Field>

        <Field label="Barcode Symbology Format">
          <Select
            value={format}
            onChange={(v) => {
              setFormat(v);
              // auto adjust default sample values for standard formats
              if (v === "EAN13" && value.length !== 12 && value.length !== 13) {
                setValue("978020137962");
              } else if (v === "UPC" && value.length !== 11 && value.length !== 12) {
                setValue("123456789012");
              }
            }}
            options={[
              { value: "CODE128", label: "CODE128 (Auto / Standard)" },
              { value: "EAN13", label: "EAN-13 (12 or 13 digits)" },
              { value: "UPC", label: "UPC-A (12 digits)" },
              { value: "CODE39", label: "CODE39 (Alphanumeric)" },
              { value: "ITF", label: "ITF / Interleaved 2 of 5" },
              { value: "PHARMACODE", label: "Pharmacode" },
            ]}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={`Bar Width (${width}px)`}>
            <Range value={width} onChange={setWidth} min={1} max={5} step={1} />
          </Field>

          <Field label={`Bar Height (${height}px)`}>
            <Range value={height} onChange={setHeight} min={30} max={150} step={5} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Bar / Line Color">
            <ColorInput value={lineColor} onChange={setLineColor} />
          </Field>

          <Field label="Background Color">
            <ColorInput value={background} onChange={setBackground} />
          </Field>
        </div>

        <Toggle checked={displayValue} onChange={setDisplayValue} label="Show Text Below Barcode" />

        {displayValue && (
          <Field label={`Font Size (${fontSize}px)`}>
            <Range value={fontSize} onChange={setFontSize} min={10} max={30} step={1} />
          </Field>
        )}
      </div>
    </ToolShell>
  );
}
