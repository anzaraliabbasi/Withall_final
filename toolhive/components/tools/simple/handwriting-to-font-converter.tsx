"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Select, ColorInput, Range } from "@/components/ui/kit";
import { downloadBlob, downloadText } from "@/lib/download";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");

type Category = "uppercase" | "lowercase" | "digits";

export default function HandwritingToFontConverter() {
  const [category, setCategory] = useState<Category>("uppercase");
  const [penColor, setPenColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [activeChar, setActiveChar] = useState("A");

  // We store ImageData or path data for each character
  // Store canvas paths per character: char -> Array<{ x: number, y: number, isNew: boolean }>
  const drawingsRef = useRef<Record<string, Array<{ x: number; y: number; drag: boolean }>>>({});
  const activeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCount, setDrawnCount] = useState(0);

  const charList = category === "uppercase" ? UPPERCASE : category === "lowercase" ? LOWERCASE : DIGITS;

  const redrawCanvas = useCallback(() => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Baseline & guide lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    // Guideline
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height * 0.75);
    ctx.stroke();

    const points = drawingsRef.current[activeChar] || [];
    if (points.length === 0) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      if (points[i].drag && i > 0) {
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
      } else {
        ctx.moveTo(points[i].x - 0.5, points[i].y);
      }
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
  }, [activeChar, penColor, strokeWidth]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    addPoint(e, false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    addPoint(e, true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      updateDrawnCount();
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const addPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    drag: boolean
  ) => {
    const coords = getCanvasCoords(e);
    if (!drawingsRef.current[activeChar]) {
      drawingsRef.current[activeChar] = [];
    }
    drawingsRef.current[activeChar].push({ x: coords.x, y: coords.y, drag });
    redrawCanvas();
  };

  const clearCurrent = () => {
    drawingsRef.current[activeChar] = [];
    redrawCanvas();
    updateDrawnCount();
  };

  const clearAll = () => {
    drawingsRef.current = {};
    redrawCanvas();
    updateDrawnCount();
  };

  const updateDrawnCount = () => {
    const count = Object.keys(drawingsRef.current).filter(
      (k) => drawingsRef.current[k] && drawingsRef.current[k].length > 0
    ).length;
    setDrawnCount(count);
  };

  const exportSpriteSheet = () => {
    const allChars = [...UPPERCASE, ...LOWERCASE, ...DIGITS];
    const cellSize = 120;
    const cols = 10;
    const rows = Math.ceil(allChars.length / cols);

    const canvas = document.createElement("canvas");
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allChars.forEach((ch, idx) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = c * cellSize;
      const y = r * cellSize;

      // Draw box outline subtly
      ctx.strokeStyle = "rgba(200, 200, 200, 0.4)";
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Label character top left
      ctx.font = "12px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(ch, x + 6, y + 16);

      const points = drawingsRef.current[ch] || [];
      if (points.length > 0) {
        ctx.save();
        ctx.translate(x, y);

        // Map 200x200 canvas coords to cellSize 120x120
        const scale = cellSize / 200;
        ctx.scale(scale, scale);

        ctx.strokeStyle = penColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < points.length; i++) {
          ctx.beginPath();
          if (points[i].drag && i > 0) {
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
          } else {
            ctx.moveTo(points[i].x - 0.5, points[i].y);
          }
          ctx.lineTo(points[i].x, points[i].y);
          ctx.stroke();
        }
        ctx.restore();
      }
    });

    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "glyph-sprite-sheet.png");
    }, "image/png");
  };

  const exportCurrentSVG = () => {
    const points = drawingsRef.current[activeChar] || [];
    let pathData = "";

    for (let i = 0; i < points.length; i++) {
      if (!points[i].drag || i === 0) {
        pathData += `M ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} `;
      } else {
        pathData += `L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} `;
      }
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <path d="${pathData.trim()}" fill="none" stroke="${penColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    downloadText(svgContent, `glyph-${activeChar}.svg`, "image/svg+xml");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Drawing Board</h3>
              <p className="text-xs text-slate-400">Current Character: <span className="font-bold text-hive-600 dark:text-hive-400 text-lg">{activeChar}</span></p>
            </div>
            <div className="flex gap-2">
              <Btn onClick={clearCurrent} variant="outline" className="!px-3 !py-1 !text-xs">
                Clear
              </Btn>
              <Btn onClick={exportCurrentSVG} variant="outline" className="!px-3 !py-1 !text-xs">
                Export SVG
              </Btn>
            </div>
          </div>

          <div className="flex justify-center p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <canvas
              ref={activeCanvasRef}
              width={200}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair rounded border border-slate-300 dark:border-slate-700 touch-none bg-white"
            />
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-3 text-xs text-amber-800 dark:text-amber-300">
            <strong>Glyph sheet for font editors:</strong> Draw each letter/digit, then export a transparent sprite sheet PNG or individual SVGs to import into font creation tools like Calligraphr, FontForge, or Glyphs.
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Field label="Category">
            <Select
              value={category}
              onChange={(v) => {
                const cat = v as Category;
                setCategory(cat);
                const firstChar = cat === "uppercase" ? "A" : cat === "lowercase" ? "a" : "0";
                setActiveChar(firstChar);
              }}
              options={[
                { value: "uppercase", label: "Uppercase (A-Z)" },
                { value: "lowercase", label: "Lowercase (a-z)" },
                { value: "digits", label: "Digits (0-9)" },
              ]}
            />
          </Field>
          <div className="text-xs font-semibold text-slate-500">
            Drawn: {drawnCount} / 62
          </div>
        </div>

        <Field label="Character Grid">
          <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9">
            {charList.map((ch) => {
              const hasDrawing = drawingsRef.current[ch] && drawingsRef.current[ch].length > 0;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setActiveChar(ch)}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition ${
                    activeChar === ch
                      ? "border-hive-500 bg-hive-500 text-white shadow"
                      : hasDrawing
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {ch}
                  {hasDrawing && activeChar !== ch ? (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Pen Color">
            <ColorInput value={penColor} onChange={setPenColor} />
          </Field>
          <Field label={`Stroke Width: ${strokeWidth}px`}>
            <Range value={strokeWidth} onChange={setStrokeWidth} min={1} max={12} suffix="px" />
          </Field>
        </div>

        <div className="flex gap-2 pt-2">
          <Btn onClick={exportSpriteSheet} variant="primary" className="w-full">
            Export Sprite Sheet (PNG)
          </Btn>
          <Btn onClick={clearAll} variant="outline" className="w-1/3">
            Clear All
          </Btn>
        </div>
      </div>
    </ToolShell>
  );
}
