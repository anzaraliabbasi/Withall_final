"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, FileDrop, Btn, StatPill } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf:
        h = (gf - bf) / d + (gf < bf ? 6 : 0);
        break;
      case gf:
        h = (bf - rf) / d + 2;
        break;
      case bf:
        h = (rf - gf) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<ColorInfo | null>(null);
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [recentColors, setRecentColors] = useState<ColorInfo[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
    };
    img.src = url;
  };

  const drawMagnifier = useCallback((px: number, py: number) => {
    if (!imgRef.current || !magnifierCanvasRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const magCanvas = magnifierCanvasRef.current;
    const magCtx = magCanvas.getContext("2d");
    if (!magCtx) return;

    const zoomSize = 11; // 11x11 pixels
    magCanvas.width = 110; // 10x scale
    magCanvas.height = 110;

    magCtx.imageSmoothingEnabled = false;
    magCtx.clearRect(0, 0, 110, 110);

    const srcX = Math.round(px) - Math.floor(zoomSize / 2);
    const srcY = Math.round(py) - Math.floor(zoomSize / 2);

    magCtx.drawImage(
      canvas,
      Math.max(0, srcX),
      Math.max(0, srcY),
      zoomSize,
      zoomSize,
      0,
      0,
      110,
      110
    );

    // Draw central pixel box indicator
    magCtx.strokeStyle = "#ffffff";
    magCtx.lineWidth = 2;
    magCtx.strokeRect(50, 50, 10, 10);
    magCtx.strokeStyle = "#000000";
    magCtx.lineWidth = 1;
    magCtx.strokeRect(49, 49, 12, 12);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = Math.min(Math.max(0, Math.floor((e.clientX - rect.left) * scaleX)), canvas.width - 1);
    const py = Math.min(Math.max(0, Math.floor((e.clientY - rect.top) * scaleY)), canvas.height - 1);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = ctx.getImageData(px, py, 1, 1).data;
    const color: ColorInfo = {
      hex: rgbToHex(p[0], p[1], p[2]),
      rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})`,
      hsl: rgbToHsl(p[0], p[1], p[2]),
      r: p[0],
      g: p[1],
      b: p[2],
    };

    setHoverColor(color);
    drawMagnifier(px, py);
  };

  const handleClick = () => {
    if (!hoverColor) return;
    setPickedColor(hoverColor);
    setRecentColors((prev) => {
      const exists = prev.some((c) => c.hex === hoverColor.hex);
      if (exists) return prev;
      return [hoverColor, ...prev].slice(0, 12);
    });
  };

  const handleCopy = async (val: string, key: string) => {
    await copyToClipboard(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const activeColor = pickedColor || hoverColor;

  return (
    <ToolShell
      side={
        imageSrc ? (
          <div className="space-y-4">
            <div className="flex gap-4 items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Magnifier</span>
                <canvas
                  ref={magnifierCanvasRef}
                  className="h-24 w-24 rounded-full border-2 border-hive-500 shadow-md object-cover"
                />
              </div>

              {activeColor ? (
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg shadow-sm border border-black/10"
                      style={{ backgroundColor: activeColor.hex }}
                    />
                    <div className="font-mono text-lg font-extrabold text-slate-900 dark:text-slate-100">
                      {activeColor.hex}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">{activeColor.rgb}</div>
                  <div className="text-xs font-mono text-slate-500">{activeColor.hsl}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Hover over image to inspect pixel colors</div>
              )}
            </div>

            {activeColor && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Copy Formats
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 font-mono">
                    <span>{activeColor.hex}</span>
                    <Btn
                      variant="outline"
                      className="!px-2.5 !py-1 !text-xs"
                      onClick={() => handleCopy(activeColor.hex, "hex")}
                    >
                      {copiedKey === "hex" ? "Copied" : "Copy HEX"}
                    </Btn>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 font-mono">
                    <span>{activeColor.rgb}</span>
                    <Btn
                      variant="outline"
                      className="!px-2.5 !py-1 !text-xs"
                      onClick={() => handleCopy(activeColor.rgb, "rgb")}
                    >
                      {copiedKey === "rgb" ? "Copied" : "Copy RGB"}
                    </Btn>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 font-mono">
                    <span>{activeColor.hsl}</span>
                    <Btn
                      variant="outline"
                      className="!px-2.5 !py-1 !text-xs"
                      onClick={() => handleCopy(activeColor.hsl, "hsl")}
                    >
                      {copiedKey === "hsl" ? "Copied" : "Copy HSL"}
                    </Btn>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <StatPill label="R" value={activeColor.r} />
                  <StatPill label="G" value={activeColor.g} />
                  <StatPill label="B" value={activeColor.b} />
                </div>
              </div>
            )}

            {recentColors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Recent Picked Swatches ({recentColors.length})
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {recentColors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPickedColor(col)}
                      className="group flex flex-col items-center rounded-xl border border-slate-200 p-1.5 transition hover:border-hive-500 dark:border-slate-800"
                    >
                      <div className="h-8 w-full rounded-lg" style={{ backgroundColor: col.hex }} />
                      <span className="mt-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                        {col.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to start picking colors
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Color Picker</h2>
          <p className="text-xs text-slate-500">
            Hover over any pixel on the image with a magnified loupe, click to inspect and copy exact HEX, RGB, or HSL values.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Click anywhere on image to pick color:
            </span>
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800 cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                className="max-h-[500px] max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
