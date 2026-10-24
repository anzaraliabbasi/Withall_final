"use client";

import { useState } from "react";
import { ToolShell, Field, Btn, Range, ColorInput, TextInput, Select, CodeBox } from "@/components/ui/kit";

export default function CssTextGlitchEffectGenerator() {
  const [text, setText] = useState("GLITCH EFFECT");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [color1, setColor1] = useState("#06b6d4"); // Cyan
  const [color2, setColor2] = useState("#ec4899"); // Magenta
  const [speed, setSpeed] = useState(2); // seconds

  const cssKeyframes = `@keyframes glitch-anim-1 {
  0% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(-1px, 1px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, 1px); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-2px, -1px); }
  100% { clip-path: inset(30% 0 30% 0); transform: translate(0, 0); }
}

@keyframes glitch-anim-2 {
  0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
  25% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 2px); }
  50% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -2px); }
  75% { clip-path: inset(50% 0 20% 0); transform: translate(-1px, 1px); }
  100% { clip-path: inset(20% 0 40% 0); transform: translate(2px, 0); }
}`;

  const cssClasses = `.glitch-text {
  position: relative;
  font-size: ${fontSize}px;
  font-weight: 900;
  color: ${textColor};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: inset(50% 0 50% 0);
}

.glitch-text::before {
  left: -2px;
  text-shadow: 2px 0 ${color1};
  animation: glitch-anim-1 ${speed}s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: 2px;
  text-shadow: -2px 0 ${color2};
  animation: glitch-anim-2 ${speed * 0.8}s infinite linear alternate-reverse;
}`;

  const fullCss = `${cssKeyframes}\n\n${cssClasses}`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Live Glitch Preview">
            <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-950 p-6 text-center shadow-inner overflow-hidden">
              <style>{fullCss}</style>
              <span className="glitch-text" data-text={text}>
                {text}
              </span>
            </div>
          </Field>
          <CodeBox code={fullCss} language="css" />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Text Content">
          <TextInput value={text} onChange={setText} placeholder="Enter glitch text..." />
        </Field>

        <Field label={`Font Size (${fontSize}px)`}>
          <Range value={fontSize} onChange={setFontSize} min={20} max={80} suffix="px" />
        </Field>

        <Field label="Base Text Color">
          <ColorInput value={textColor} onChange={setTextColor} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Glitch Color 1">
            <ColorInput value={color1} onChange={setColor1} />
          </Field>
          <Field label="Glitch Color 2">
            <ColorInput value={color2} onChange={setColor2} />
          </Field>
        </div>

        <Field label={`Animation Cycle (${speed}s)`}>
          <Range value={speed} onChange={setSpeed} min={0.5} max={5} step={0.1} suffix="s" />
        </Field>

        <Field label="Color Combos">
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#06b6d4");
                setColor2("#ec4899");
              }}
            >
              Cyberpunk (Cyan/Pink)
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#f59e0b");
                setColor2("#ef4444");
              }}
            >
              Hive Fire (Amber/Red)
            </Btn>
            <Btn
              variant="outline"
              className="!px-2.5 !py-1 !text-xs"
              onClick={() => {
                setColor1("#10b981");
                setColor2("#3b82f6");
              }}
            >
              Matrix (Emerald/Blue)
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
