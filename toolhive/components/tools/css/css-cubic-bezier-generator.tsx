"use client";

import { useState, useRef, useEffect } from "react";
import { ToolShell, Field, Btn, Range, CodeBox } from "@/components/ui/kit";

const PRESETS = [
  { name: "Ease", x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 },
  { name: "Linear", x1: 0.0, y1: 0.0, x2: 1.0, y2: 1.0 },
  { name: "Ease-In", x1: 0.42, y1: 0.0, x2: 1.0, y2: 1.0 },
  { name: "Ease-Out", x1: 0.0, y1: 0.0, x2: 0.58, y2: 1.0 },
  { name: "Ease-In-Out", x1: 0.42, y1: 0.0, x2: 0.58, y2: 1.0 },
  { name: "Snappy Back", x1: 0.175, y1: 0.885, x2: 0.32, y2: 1.275 },
  { name: "Elastic Bounce", x1: 0.68, y1: -0.55, x2: 0.265, y2: 1.55 },
];

export default function CssCubicBezierGenerator() {
  const [x1, setX1] = useState(0.25);
  const [y1, setY1] = useState(0.1);
  const [x2, setX2] = useState(0.25);
  const [y2, setY2] = useState(1.0);
  const [duration, setDuration] = useState(1.5);

  const [animating, setAnimated] = useState(false);
  const gridRef = useRef<SVGSVGElement>(null);
  const activeHandleRef = useRef<1 | 2 | null>(null);

  const bezierStr = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  const cssCode = `transition-timing-function: ${bezierStr};
transition-duration: ${duration}s;`;

  // SVG parameters
  // Main unit box is 200x200 inside 260x260 viewBox with padding
  const padding = 30;
  const size = 200;

  // Convert (x, y) [0..1, -0.5..1.5] to SVG canvas coords
  // x: 0 -> padding, 1 -> padding + size
  // y: 0 -> padding + size, 1 -> padding
  const toSvgX = (x: number) => padding + x * size;
  const toSvgY = (y: number) => padding + size - y * size;

  const p0 = { x: toSvgX(0), y: toSvgY(0) };
  const cp1 = { x: toSvgX(x1), y: toSvgY(y1) };
  const cp2 = { x: toSvgX(x2), y: toSvgY(y2) };
  const p3 = { x: toSvgX(1), y: toSvgY(1) };

  const handlePointerDown = (handle: 1 | 2, e: React.PointerEvent) => {
    e.stopPropagation();
    activeHandleRef.current = handle;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeHandleRef.current || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert SVG client coords to normalized bezier coords
    // Scale from actual SVG bounding box to viewBox (260)
    const scale = 260 / rect.width;
    const svgX = clientX * scale;
    const svgY = clientY * scale;

    const normX = Math.min(1, Math.max(0, parseFloat(((svgX - padding) / size).toFixed(3))));
    const normY = parseFloat(((padding + size - svgY) / size).toFixed(3));

    if (activeHandleRef.current === 1) {
      setX1(normX);
      setY1(normY);
    } else {
      setX2(normX);
      setY2(normY);
    }
  };

  const handlePointerUp = () => {
    activeHandleRef.current = null;
  };

  const triggerAnimation = () => {
    setAnimated(false);
    setTimeout(() => setAnimated(true), 50);
  };

  useEffect(() => {
    triggerAnimation();
  }, [x1, y1, x2, y2, duration]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Interactive Bezier Curve Grid">
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
              <svg
                ref={gridRef}
                viewBox="0 0 260 260"
                className="h-[260px] w-[260px] touch-none select-none rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Reference unit box (0,0) to (1,1) */}
                <rect
                  x={padding}
                  y={padding}
                  width={size}
                  height={size}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  className="text-slate-300 dark:text-slate-700"
                />

                {/* Diagonal linear reference line */}
                <line
                  x1={p0.x}
                  y1={p0.y}
                  x2={p3.x}
                  y2={p3.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="text-slate-300 dark:text-slate-700"
                />

                {/* Handle lines */}
                <line x1={p0.x} y1={p0.y} x2={cp1.x} y2={cp1.y} stroke="#f59e0b" strokeWidth="2" />
                <line x1={p3.x} y1={p3.y} x2={cp2.x} y2={cp2.y} stroke="#3b82f6" strokeWidth="2" />

                {/* Cubic Bezier Path */}
                <path
                  d={`M ${p0.x},${p0.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p3.x},${p3.y}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                />

                {/* Control Point 1 (Amber) */}
                <circle
                  cx={cp1.x}
                  cy={cp1.y}
                  r="8"
                  className="cursor-grab fill-amber-500 stroke-white stroke-2 shadow hover:scale-125"
                  onPointerDown={(e) => handlePointerDown(1, e)}
                />
                <text x={cp1.x} y={cp1.y - 12} textAnchor="middle" className="fill-amber-600 font-mono text-[10px] font-bold">
                  P1
                </text>

                {/* Control Point 2 (Blue) */}
                <circle
                  cx={cp2.x}
                  cy={cp2.y}
                  r="8"
                  className="cursor-grab fill-blue-500 stroke-white stroke-2 shadow hover:scale-125"
                  onPointerDown={(e) => handlePointerDown(2, e)}
                />
                <text x={cp2.x} y={cp2.y - 12} textAnchor="middle" className="fill-blue-600 font-mono text-[10px] font-bold">
                  P2
                </text>
              </svg>
            </div>
          </Field>

          <Field label="Animated Preview Ball">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="relative h-10 w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                <div
                  className="absolute top-1 h-8 w-8 rounded-full bg-hive-500 shadow-md"
                  style={{
                    left: animating ? "calc(100% - 36px)" : "4px",
                    transitionProperty: "left",
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: bezierStr,
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Btn variant="primary" className="!px-3 !py-1 !text-xs" onClick={triggerAnimation}>
                  Replay Animation 🚀
                </Btn>
              </div>
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
                  setX1(p.x1); setY1(p.y1);
                  setX2(p.x2); setY2(p.y2);
                }}
              >
                {p.name}
              </Btn>
            ))}
          </div>
        </Field>

        <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">
            Control Point P1 (Amber)
          </div>
          <Field label={`P1 X (${x1})`}>
            <Range value={x1} onChange={setX1} min={0} max={1} step={0.01} />
          </Field>
          <Field label={`P1 Y (${y1})`}>
            <Range value={y1} onChange={setY1} min={-0.5} max={1.5} step={0.01} />
          </Field>

          <div className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Control Point P2 (Blue)
          </div>
          <Field label={`P2 X (${x2})`}>
            <Range value={x2} onChange={setX2} min={0} max={1} step={0.01} />
          </Field>
          <Field label={`P2 Y (${y2})`}>
            <Range value={y2} onChange={setY2} min={-0.5} max={1.5} step={0.01} />
          </Field>
        </div>

        <Field label={`Animation Duration (${duration}s)`}>
          <Range value={duration} onChange={setDuration} min={0.2} max={5} step={0.1} suffix="s" />
        </Field>
      </div>
    </ToolShell>
  );
}
