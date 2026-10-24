"use client";

import { useState, useRef, useCallback } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

interface Point {
  x: number; // 0 - 100%
  y: number; // 0 - 100%
}

const PRESETS = [
  {
    name: "Triangle",
    type: "polygon" as const,
    points: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }],
  },
  {
    name: "Star",
    type: "polygon" as const,
    points: [
      { x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 },
      { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 },
      { x: 2, y: 35 }, { x: 39, y: 35 },
    ],
  },
  {
    name: "Arrow",
    type: "polygon" as const,
    points: [
      { x: 0, y: 20 }, { x: 60, y: 20 }, { x: 60, y: 0 }, { x: 100, y: 50 },
      { x: 60, y: 100 }, { x: 60, y: 80 }, { x: 0, y: 80 },
    ],
  },
  {
    name: "Hexagon",
    type: "polygon" as const,
    points: [
      { x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 },
      { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 },
    ],
  },
  {
    name: "Message Bubble",
    type: "polygon" as const,
    points: [
      { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 },
      { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 },
    ],
  },
  {
    name: "Circle",
    type: "circle" as const,
    circleRadius: 50,
  },
  {
    name: "Ellipse",
    type: "ellipse" as const,
    ellipseRx: 50,
    ellipseRy: 30,
  },
];

export default function CssClipPathGenerator() {
  const [shapeType, setShapeType] = useState<"polygon" | "circle" | "ellipse">("polygon");
  const [points, setPoints] = useState<Point[]>([
    { x: 50, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
  ]);

  const [circleRadius, setCircleRadius] = useState(50);
  const [ellipseRx, setEllipseRx] = useState(50);
  const [ellipseRy, setEllipseRy] = useState(30);

  const [fillColor, setFillColor] = useState("#f59e0b");
  const [activePointIdx, setActivePointIdx] = useState<number | null>(null);

  const gridRef = useRef<SVGSVGElement>(null);
  const draggingIdxRef = useRef<number | null>(null);

  const updatePoint = (idx: number, x: number, y: number) => {
    setPoints((prev) =>
      prev.map((p, i) => (i === idx ? { x: Math.round(Math.max(0, Math.min(100, x))), y: Math.round(Math.max(0, Math.min(100, y))) } : p))
    );
  };

  const addPoint = () => {
    setPoints([...points, { x: 50, y: 50 }]);
    setActivePointIdx(points.length);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, i) => i !== idx));
    setActivePointIdx(null);
  };

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    draggingIdxRef.current = idx;
    setActivePointIdx(idx);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdxRef.current === null || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updatePoint(draggingIdxRef.current, x, y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingIdxRef.current !== null) {
      draggingIdxRef.current = null;
    }
  };

  let clipPathVal = "";
  if (shapeType === "polygon") {
    const ptsStr = points.map((p) => `${p.x}% ${p.y}%`).join(", ");
    clipPathVal = `polygon(${ptsStr})`;
  } else if (shapeType === "circle") {
    clipPathVal = `circle(${circleRadius}% at 50% 50%)`;
  } else {
    clipPathVal = `ellipse(${ellipseRx}% ${ellipseRy}% at 50% 50%)`;
  }

  const cssCode = `clip-path: ${clipPathVal};
-webkit-clip-path: ${clipPathVal};`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Interactive Grid Preview (300px)">
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
              <svg
                ref={gridRef}
                viewBox="0 0 300 300"
                className="h-[300px] w-[300px] cursor-crosshair touch-none select-none rounded-xl border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Background grid lines */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
                  </pattern>
                </defs>
                <rect width="300" height="300" fill="url(#grid)" />

                {/* Clipped Filled Shape Preview */}
                <foreignObject width="300" height="300">
                  <div
                    className="h-full w-full transition-all"
                    style={{
                      backgroundColor: fillColor,
                      clipPath: clipPathVal,
                      WebkitClipPath: clipPathVal,
                    }}
                  />
                </foreignObject>

                {/* Handles overlay for Polygon */}
                {shapeType === "polygon" && (
                  <>
                    <polygon
                      points={points.map((p) => `${(p.x * 300) / 100},${(p.y * 300) / 100}`).join(" ")}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {points.map((p, idx) => {
                      const cx = (p.x * 300) / 100;
                      const cy = (p.y * 300) / 100;
                      const isActive = activePointIdx === idx;
                      return (
                        <g key={idx}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isActive ? 10 : 7}
                            className="cursor-grab fill-amber-500 stroke-white stroke-2 shadow transition-all hover:scale-125"
                            onPointerDown={(e) => handlePointerDown(idx, e)}
                          />
                          <text
                            x={cx}
                            y={cy - 12}
                            textAnchor="middle"
                            className="pointer-events-none fill-slate-700 font-mono text-[10px] font-bold dark:fill-slate-200"
                          >
                            #{idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
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
                  setShapeType(p.type);
                  if (p.points) setPoints(p.points);
                  if (p.circleRadius !== undefined) setCircleRadius(p.circleRadius);
                  if (p.ellipseRx !== undefined) setEllipseRx(p.ellipseRx);
                  if (p.ellipseRy !== undefined) setEllipseRy(p.ellipseRy);
                }}
              >
                {p.name}
              </Btn>
            ))}
          </div>
        </Field>

        <Field label="Shape Type">
          <Select
            value={shapeType}
            onChange={(v) => setShapeType(v as any)}
            options={[
              { value: "polygon", label: "Polygon (Custom Draggable Points)" },
              { value: "circle", label: "Circle" },
              { value: "ellipse", label: "Ellipse" },
            ]}
          />
        </Field>

        {shapeType === "polygon" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Polygon Points ({points.length})
              </span>
              <Btn variant="outline" className="!px-2 !py-1 !text-xs" onClick={addPoint}>
                + Add Point
              </Btn>
            </div>

            <p className="text-xs text-slate-500">
              Drag amber circles on the grid preview, or fine-tune coordinates below:
            </p>

            <div className="max-h-60 overflow-auto space-y-2 pr-1">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 space-y-2 transition ${
                    activePointIdx === idx
                      ? "border-hive-500 bg-hive-500/5"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Point #{idx + 1} ({p.x}%, {p.y}%)
                    </span>
                    {points.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removePoint(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="X Pos">
                      <Range
                        value={p.x}
                        onChange={(v) => updatePoint(idx, v, p.y)}
                        min={0}
                        max={100}
                        suffix="%"
                      />
                    </Field>
                    <Field label="Y Pos">
                      <Range
                        value={p.y}
                        onChange={(v) => updatePoint(idx, p.x, v)}
                        min={0}
                        max={100}
                        suffix="%"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {shapeType === "circle" && (
          <Field label={`Radius (${circleRadius}%)`}>
            <Range value={circleRadius} onChange={setCircleRadius} min={0} max={100} suffix="%" />
          </Field>
        )}

        {shapeType === "ellipse" && (
          <div className="space-y-3">
            <Field label={`Horizontal Radius X (${ellipseRx}%)`}>
              <Range value={ellipseRx} onChange={setEllipseRx} min={0} max={100} suffix="%" />
            </Field>
            <Field label={`Vertical Radius Y (${ellipseRy}%)`}>
              <Range value={ellipseRy} onChange={setEllipseRy} min={0} max={100} suffix="%" />
            </Field>
          </div>
        )}

        <Field label="Fill Color">
          <ColorInput value={fillColor} onChange={setFillColor} />
        </Field>
      </div>
    </ToolShell>
  );
}
