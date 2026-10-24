"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, Select, CodeBox } from "@/components/ui/kit";

type LoaderType =
  | "spinner"
  | "pulse"
  | "ring"
  | "dots"
  | "bars"
  | "cube"
  | "chase"
  | "ripple"
  | "progress"
  | "hourglass";

export default function CssLoaderGenerator() {
  const [type, setType] = useState<LoaderType>("spinner");
  const [size, setSize] = useState(48);
  const [color1, setColor1] = useState("#f59e0b"); // Primary
  const [color2, setColor2] = useState("#fde68a"); // Track / secondary
  const [speed, setSpeed] = useState(1.0); // seconds

  let cssCode = "";
  let jsxPreview = null;

  if (type === "spinner") {
    cssCode = `/* Spinner Loader */
.loader-spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${Math.max(2, Math.round(size / 8))}px solid ${color2};
  border-top-color: ${color1};
  border-radius: 50%;
  animation: spin ${speed}s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`;
    jsxPreview = (
      <div
        className="rounded-full border-solid animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${Math.max(2, Math.round(size / 8))}px`,
          borderColor: color2,
          borderTopColor: color1,
          animationDuration: `${speed}s`,
        }}
      />
    );
  } else if (type === "pulse") {
    cssCode = `/* Pulse Loader */
.loader-pulse {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color1};
  border-radius: 50%;
  animation: pulse-anim ${speed}s ease-in-out infinite;
}

@keyframes pulse-anim {
  0%, 100% { transform: scale(0.2); opacity: 0.3; }
  50% { transform: scale(1); opacity: 1; }
}`;
    jsxPreview = (
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color1,
          animation: `pulse-anim ${speed}s ease-in-out infinite`,
        }}
      >
        <style>{`
          @keyframes pulse-anim {
            0%, 100% { transform: scale(0.2); opacity: 0.3; }
            50% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  } else if (type === "ring") {
    cssCode = `/* Ring Loader */
.loader-ring {
  width: ${size}px;
  height: ${size}px;
  border: ${Math.max(2, Math.round(size / 10))}px solid transparent;
  border-left-color: ${color1};
  border-right-color: ${color1};
  border-radius: 50%;
  animation: ring-anim ${speed}s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes ring-anim {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    jsxPreview = (
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${Math.max(2, Math.round(size / 10))}px`,
          borderStyle: "solid",
          borderColor: "transparent",
          borderLeftColor: color1,
          borderRightColor: color1,
          animation: `spin ${speed}s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
        }}
      />
    );
  } else if (type === "dots") {
    const dotSize = Math.max(6, Math.round(size / 4));
    cssCode = `/* Bouncing Dots Loader */
.loader-dots {
  display: flex;
  align-items: center;
  gap: ${Math.round(dotSize / 2)}px;
}

.loader-dots div {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background-color: ${color1};
  border-radius: 50%;
  animation: bounce-dots ${speed}s infinite ease-in-out both;
}

.loader-dots div:nth-child(1) { animation-delay: -${(speed * 0.32).toFixed(2)}s; }
.loader-dots div:nth-child(2) { animation-delay: -${(speed * 0.16).toFixed(2)}s; }

@keyframes bounce-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}`;
    jsxPreview = (
      <div className="flex items-center" style={{ gap: `${Math.round(dotSize / 2)}px` }}>
        <style>{`
          @keyframes bounce-dots {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
        <div
          className="rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor: color1,
            animation: `bounce-dots ${speed}s infinite ease-in-out both`,
            animationDelay: `-${(speed * 0.32).toFixed(2)}s`,
          }}
        />
        <div
          className="rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor: color1,
            animation: `bounce-dots ${speed}s infinite ease-in-out both`,
            animationDelay: `-${(speed * 0.16).toFixed(2)}s`,
          }}
        />
        <div
          className="rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor: color1,
            animation: `bounce-dots ${speed}s infinite ease-in-out both`,
          }}
        />
      </div>
    );
  } else if (type === "bars") {
    const barWidth = Math.max(4, Math.round(size / 6));
    cssCode = `/* Wave Bars Loader */
.loader-bars {
  display: flex;
  align-items: center;
  gap: ${Math.round(barWidth / 2)}px;
  height: ${size}px;
}

.loader-bars div {
  width: ${barWidth}px;
  height: 100%;
  background-color: ${color1};
  animation: wave-bars ${speed}s ease-in-out infinite;
}

.loader-bars div:nth-child(1) { animation-delay: -${(speed * 0.4).toFixed(2)}s; }
.loader-bars div:nth-child(2) { animation-delay: -${(speed * 0.3).toFixed(2)}s; }
.loader-bars div:nth-child(3) { animation-delay: -${(speed * 0.2).toFixed(2)}s; }
.loader-bars div:nth-child(4) { animation-delay: -${(speed * 0.1).toFixed(2)}s; }

@keyframes wave-bars {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}`;
    jsxPreview = (
      <div className="flex items-center" style={{ gap: `${Math.round(barWidth / 2)}px`, height: `${size}px` }}>
        <style>{`
          @keyframes wave-bars {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1); }
          }
        `}</style>
        {[0.4, 0.3, 0.2, 0.1].map((delay, idx) => (
          <div
            key={idx}
            className="rounded-sm"
            style={{
              width: `${barWidth}px`,
              height: "100%",
              backgroundColor: color1,
              animation: `wave-bars ${speed}s ease-in-out infinite`,
              animationDelay: `-${(speed * delay).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
    );
  } else if (type === "cube") {
    cssCode = `/* Rotating Cube Loader */
.loader-cube {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color1};
  border-radius: ${Math.round(size / 8)}px;
  animation: flip-cube ${speed}s ease-in-out infinite;
}

@keyframes flip-cube {
  0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
  50% { transform: perspective(120px) rotateX(-180deg) rotateY(0deg); background-color: ${color2}; }
  100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); }
}`;
    jsxPreview = (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color1,
          borderRadius: `${Math.round(size / 8)}px`,
          animation: `flip-cube ${speed}s ease-in-out infinite`,
        }}
      >
        <style>{`
          @keyframes flip-cube {
            0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
            50% { transform: perspective(120px) rotateX(-180deg) rotateY(0deg); background-color: ${color2}; }
            100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); }
          }
        `}</style>
      </div>
    );
  } else if (type === "chase") {
    cssCode = `/* Chasing Dots Loader */
.loader-chase {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: chase-spin ${speed * 2.5}s linear infinite;
}

.loader-chase-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  animation: chase-dot ${speed * 2}s infinite ease-in-out both;
}

.loader-chase-dot::before {
  content: '';
  display: block;
  width: 25%;
  height: 25%;
  background-color: ${color1};
  border-radius: 100%;
}

@keyframes chase-spin { 100% { transform: rotate(360deg); } }
@keyframes chase-dot {
  80%, 100% { transform: rotate(360deg); }
}`;
    jsxPreview = (
      <div
        className="relative flex items-center justify-center animate-spin"
        style={{ width: `${size}px`, height: `${size}px`, animationDuration: `${speed * 2}s` }}
      >
        <div
          className="absolute h-3 w-3 rounded-full top-0"
          style={{ backgroundColor: color1 }}
        />
        <div
          className="absolute h-3 w-3 rounded-full bottom-0"
          style={{ backgroundColor: color1 }}
        />
        <div
          className="absolute h-3 w-3 rounded-full left-0"
          style={{ backgroundColor: color1 }}
        />
        <div
          className="absolute h-3 w-3 rounded-full right-0"
          style={{ backgroundColor: color1 }}
        />
      </div>
    );
  } else if (type === "ripple") {
    cssCode = `/* Ripple Rings Loader */
.loader-ripple {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader-ripple div {
  position: absolute;
  border: 4px solid ${color1};
  opacity: 1;
  border-radius: 50%;
  animation: ripple-anim ${speed}s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.loader-ripple div:nth-child(2) {
  animation-delay: -${(speed / 2).toFixed(2)}s;
}

@keyframes ripple-anim {
  0% { top: ${size / 2}px; left: ${size / 2}px; width: 0; height: 0; opacity: 1; }
  100% { top: 0px; left: 0px; width: ${size}px; height: ${size}px; opacity: 0; }
}`;
    jsxPreview = (
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <style>{`
          @keyframes ripple-anim {
            0% { top: ${size / 2}px; left: ${size / 2}px; width: 0; height: 0; opacity: 1; }
            100% { top: 0px; left: 0px; width: ${size}px; height: ${size}px; opacity: 0; }
          }
        `}</style>
        <div
          className="absolute rounded-full border-4"
          style={{
            borderColor: color1,
            animation: `ripple-anim ${speed}s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
          }}
        />
        <div
          className="absolute rounded-full border-4"
          style={{
            borderColor: color1,
            animation: `ripple-anim ${speed}s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
            animationDelay: `-${(speed / 2).toFixed(2)}s`,
          }}
        />
      </div>
    );
  } else if (type === "progress") {
    cssCode = `/* Progress Bar Loader */
.loader-progress {
  width: ${size * 2}px;
  height: ${Math.max(4, Math.round(size / 6))}px;
  background-color: ${color2};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.loader-progress-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 40%;
  background-color: ${color1};
  border-radius: 4px;
  animation: progress-anim ${speed}s ease-in-out infinite;
}

@keyframes progress-anim {
  0% { left: -40%; }
  100% { left: 100%; }
}`;
    jsxPreview = (
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: `${size * 2.5}px`,
          height: `${Math.max(6, Math.round(size / 6))}px`,
          backgroundColor: color2,
        }}
      >
        <style>{`
          @keyframes progress-anim {
            0% { left: -40%; }
            100% { left: 100%; }
          }
        `}</style>
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: "40%",
            backgroundColor: color1,
            animation: `progress-anim ${speed}s ease-in-out infinite`,
          }}
        />
      </div>
    );
  } else {
    // hourglass
    cssCode = `/* Hourglass Loader */
.loader-hourglass {
  display: inline-block;
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.loader-hourglass::after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  box-sizing: border-box;
  border: ${size / 2}px solid ${color1};
  border-color: ${color1} transparent ${color1} transparent;
  animation: hourglass-anim ${speed}s infinite;
}

@keyframes hourglass-anim {
  0% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
  50% { transform: rotate(900deg); animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); }
  100% { transform: rotate(1800deg); }
}`;
    jsxPreview = (
      <div
        className="rounded-full"
        style={{
          width: 0,
          height: 0,
          borderWidth: `${size / 2}px`,
          borderStyle: "solid",
          borderColor: `${color1} transparent ${color1} transparent`,
          animation: `spin ${speed}s infinite cubic-bezier(0.55, 0.055, 0.675, 0.19)`,
        }}
      />
    );
  }

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Animated Preview">
            <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-950">
              {jsxPreview}
            </div>
          </Field>
          <CodeBox code={cssCode} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Loader Type">
          <Select
            value={type}
            onChange={(v) => setType(v as LoaderType)}
            options={[
              { value: "spinner", label: "1. Dual Border Spinner" },
              { value: "pulse", label: "2. Pulsing Scale Circle" },
              { value: "ring", label: "3. Rotating Ring" },
              { value: "dots", label: "4. Bouncing Wave Dots" },
              { value: "bars", label: "5. Equalizer Wave Bars" },
              { value: "cube", label: "6. 3D Flipping Cube" },
              { value: "chase", label: "7. Chasing Orbit Dots" },
              { value: "ripple", label: "8. Expanding Ripple Rings" },
              { value: "progress", label: "9. Indeterminate Progress Bar" },
              { value: "hourglass", label: "10. Spinning Hourglass" },
            ]}
          />
        </Field>

        <Field label={`Size (${size}px)`}>
          <Range value={size} onChange={setSize} min={20} max={100} suffix="px" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary Color">
            <ColorInput value={color1} onChange={setColor1} />
          </Field>
          <Field label="Secondary / Track Color">
            <ColorInput value={color2} onChange={setColor2} />
          </Field>
        </div>

        <Field label={`Animation Duration (${speed}s)`}>
          <Range value={speed} onChange={setSpeed} min={0.3} max={3} step={0.1} suffix="s" />
        </Field>

        <Field label="Brand Colors">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setColor1("#f59e0b"); setColor2("#fde68a"); }}
            >
              Hive Amber
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setColor1("#3b82f6"); setColor2("#bfdbfe"); }}
            >
              Ocean Blue
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => { setColor1("#ec4899"); setColor2("#fbcfe8"); }}
            >
              Neon Pink
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
