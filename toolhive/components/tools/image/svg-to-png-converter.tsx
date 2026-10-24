"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Select, TextArea, FileDrop, ColorInput, StatPill } from "@/components/ui/kit";
import { downloadBlob, downloadText } from "@/lib/download";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <circle cx="50" cy="50" r="45" fill="#f59e0b" />
  <path d="M 30 40 L 40 40 L 40 60 L 30 60 Z" fill="#ffffff" />
  <path d="M 60 40 L 70 40 L 70 60 L 60 60 Z" fill="#ffffff" />
  <path d="M 30 70 Q 50 85 70 70" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" />
</svg>`;

export default function SvgToPngConverter() {
  const [svgCode, setSvgCode] = useState<string>(SAMPLE_SVG);
  const [scale, setScale] = useState<string>("2");
  const [bgOption, setBgOption] = useState<string>("transparent");
  const [customBg, setCustomBg] = useState<string>("#ffffff");
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [renderError, setRenderError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setSvgCode(e.target.result);
      }
    };
    reader.readAsText(file);
  };

  const renderSvg = useCallback(() => {
    setRenderError(null);
    if (!svgCode.trim()) return;

    try {
      const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        imgRef.current = img;
        const mult = parseFloat(scale) || 1;
        const w = Math.max(1, Math.round((img.naturalWidth || 300) * mult));
        const h = Math.max(1, Math.round((img.naturalHeight || 300) * mult));
        setDimensions({ width: w, height: h });

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, w, h);
            if (bgOption === "white") {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, w, h);
            } else if (bgOption === "black") {
              ctx.fillStyle = "#000000";
              ctx.fillRect(0, 0, w, h);
            } else if (bgOption === "custom") {
              ctx.fillStyle = customBg;
              ctx.fillRect(0, 0, w, h);
            }
            ctx.drawImage(img, 0, 0, w, h);
          }
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        setRenderError("Failed to parse SVG markup as image.");
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch {
      setRenderError("Error creating Blob from SVG string.");
    }
  }, [svgCode, scale, bgOption, customBg]);

  useEffect(() => {
    renderSvg();
  }, [renderSvg]);

  const handleDownload = () => {
    if (!canvasRef.current || dimensions.width === 0) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `converted-svg-${dimensions.width}x${dimensions.height}.png`);
    }, "image/png");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <StatPill label="Scale Multiplier" value={`${scale}x`} />
            <StatPill label="Output Resolution" value={`${dimensions.width} × ${dimensions.height}`} />
          </div>

          <Field label="Resolution Scale Factor">
            <Select
              value={scale}
              onChange={setScale}
              options={[
                { value: "1", label: "1x (Original Size)" },
                { value: "2", label: "2x (High DPI)" },
                { value: "3", label: "3x (Retina)" },
                { value: "4", label: "4x (Ultra HD)" },
                { value: "8", label: "8x (Max Detail)" },
              ]}
            />
          </Field>

          <Field label="Background Mode">
            <Select
              value={bgOption}
              onChange={setBgOption}
              options={[
                { value: "transparent", label: "Transparent Background" },
                { value: "white", label: "Solid White (#FFFFFF)" },
                { value: "black", label: "Solid Black (#000000)" },
                { value: "custom", label: "Custom Background Color" },
              ]}
            />
          </Field>

          {bgOption === "custom" && (
            <Field label="Custom Color">
              <ColorInput value={customBg} onChange={setCustomBg} />
            </Field>
          )}

          {renderError ? (
            <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{renderError}</div>
          ) : (
            <Field label="Render Preview">
              <div className="flex justify-center overflow-auto rounded-xl border border-slate-200 bg-[checkerboard] p-4 dark:border-slate-800 bg-slate-900">
                <canvas ref={canvasRef} className="max-h-64 max-w-full object-contain" />
              </div>
            </Field>
          )}

          <div className="flex gap-2">
            <Btn onClick={handleDownload} disabled={!!renderError || dimensions.width === 0} className="w-full">
              Download PNG
            </Btn>
            <Btn
              variant="outline"
              className="!px-3 !text-xs"
              onClick={() => downloadText(svgCode, "vector.svg", "image/svg+xml")}
            >
              Save SVG
            </Btn>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">SVG to PNG Converter</h2>
          <p className="text-xs text-slate-500">
            Render raw SVG code or .svg vector files directly onto an HTML canvas at 1x to 8x resolution scale.
          </p>
        </div>

        <FileDrop accept=".svg,image/svg+xml" onFiles={handleFiles} label="Drop .svg file here or click to browse" />

        <Field label="Paste SVG Code">
          <TextArea
            value={svgCode}
            onChange={setSvgCode}
            rows={10}
            mono
            placeholder="<svg xmlns=...></svg>"
          />
        </Field>
      </div>
    </ToolShell>
  );
}
