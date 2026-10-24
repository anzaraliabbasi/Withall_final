"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Select, Range, TextInput, Toggle, FileDrop, ColorInput } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

type TemplateType = "meme" | "subtitle" | "polaroid" | "topbanner" | "speechbubble";

export default function ImageCaptionGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("captioned-image");
  const [template, setTemplate] = useState<TemplateType>("meme");

  const [topText, setTopText] = useState<string>("WHEN YOUR CODE WORKS");
  const [bottomText, setBottomText] = useState<string>("ON THE FIRST TRY");
  const [fontSize, setFontSize] = useState<number>(36);
  const [fontFamily, setFontFamily] = useState<string>("Impact");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [isUppercase, setIsUppercase] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(baseName(file.name));
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImageSrc(url);
    };
    img.src = url;
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Default canvas size if no image loaded yet
    const baseW = imgRef.current ? imgRef.current.naturalWidth : 600;
    const baseH = imgRef.current ? imgRef.current.naturalHeight : 450;

    let canvasW = baseW;
    let canvasH = baseH;

    if (template === "polaroid") {
      canvasH = baseH + Math.round(baseH * 0.25); // Add 25% white bottom padding
    }

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.clearRect(0, 0, canvasW, canvasH);

    // Fill white background for polaroid layout
    if (template === "polaroid") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // Draw base image
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, 0, 0, baseW, baseH);
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, baseW, baseH);
      ctx.fillStyle = "#64748b";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload an image to see live captioning", baseW / 2, baseH / 2);
    }

    const formatText = (t: string) => (isUppercase ? t.toUpperCase() : t);
    const upperTop = formatText(topText);
    const upperBottom = formatText(bottomText);

    if (template === "meme") {
      ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = textColor;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(2, fontSize / 10);
      ctx.lineJoin = "round";

      if (upperTop) {
        ctx.strokeText(upperTop, canvasW / 2, 20);
        ctx.fillText(upperTop, canvasW / 2, 20);
      }

      if (upperBottom) {
        ctx.textBaseline = "bottom";
        ctx.strokeText(upperBottom, canvasW / 2, baseH - 20);
        ctx.fillText(upperBottom, canvasW / 2, baseH - 20);
      }
    } else if (template === "subtitle") {
      if (upperBottom) {
        const barH = fontSize * 1.8;
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, baseH - barH, canvasW, barH);

        ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.fillText(upperBottom, canvasW / 2, baseH - barH / 2);
      }
    } else if (template === "polaroid") {
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      if (upperTop) {
        ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.fillText(upperTop, canvasW / 2, baseH + 30);
      }
      if (upperBottom) {
        ctx.font = `${Math.round(fontSize * 0.7)}px ${fontFamily}, sans-serif`;
        ctx.fillText(upperBottom, canvasW / 2, baseH + 30 + fontSize);
      }
    } else if (template === "topbanner") {
      if (upperTop) {
        const barH = fontSize * 1.8;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvasW, barH);

        ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        ctx.fillText(upperTop, canvasW / 2, barH / 2);
      }
    } else if (template === "speechbubble") {
      if (upperTop) {
        const padding = 16;
        ctx.font = `${fontSize}px ${fontFamily}, sans-serif`;
        const textMetrics = ctx.measureText(upperTop);
        const bubbleW = textMetrics.width + padding * 2;
        const bubbleH = fontSize + padding * 2;
        const bx = 30;
        const by = 30;

        // Draw Speech Bubble
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bx, by, bubbleW, bubbleH, 12);
        ctx.fill();
        ctx.stroke();

        // Pointer triangle
        ctx.beginPath();
        ctx.moveTo(bx + 20, by + bubbleH);
        ctx.lineTo(bx + 10, by + bubbleH + 20);
        ctx.lineTo(bx + 40, by + bubbleH);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(upperTop, bx + padding, by + padding);
      }
    }
  }, [imageSrc, template, topText, bottomText, fontSize, fontFamily, textColor, isUppercase]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${fileName}-captioned.png`);
    }, "image/png");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Field label="Caption Template">
            <Select
              value={template}
              onChange={(v) => setTemplate(v as TemplateType)}
              options={[
                { value: "meme", label: "Classic Meme (Top & Bottom)" },
                { value: "subtitle", label: "Dark Subtitle Bar" },
                { value: "polaroid", label: "Polaroid / White Footer" },
                { value: "topbanner", label: "Dark Top Header Banner" },
                { value: "speechbubble", label: "Comic Speech Bubble" },
              ]}
            />
          </Field>

          <Field label="Top / Main Caption">
            <TextInput value={topText} onChange={setTopText} placeholder="Enter main caption text..." />
          </Field>

          <Field label="Bottom / Sub Caption">
            <TextInput value={bottomText} onChange={setBottomText} placeholder="Enter secondary text..." />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Font Family">
              <Select
                value={fontFamily}
                onChange={setFontFamily}
                options={[
                  { value: "Impact", label: "Impact (Meme)" },
                  { value: "Arial", label: "Arial Sans" },
                  { value: "Georgia", label: "Georgia Serif" },
                  { value: "Courier New", label: "Courier Mono" },
                  { value: "Trebuchet MS", label: "Trebuchet" },
                ]}
              />
            </Field>

            <Field label="Text Color">
              <ColorInput value={textColor} onChange={setTextColor} />
            </Field>
          </div>

          <Field label="Font Size" hint={`${fontSize}px`}>
            <Range value={fontSize} onChange={setFontSize} min={14} max={96} suffix="px" />
          </Field>

          <Toggle checked={isUppercase} onChange={setIsUppercase} label="UPPERCASE TEXT" />

          <Btn onClick={handleDownload} className="w-full">
            Download Captioned Image
          </Btn>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Caption & Meme Generator</h2>
          <p className="text-xs text-slate-500">
            Add meme text, subtitles, speech bubbles, or polaroid banners to images directly on HTML canvas.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop photo here or click to browse" />

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Live Captioned Result:
          </span>
          <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
            <canvas ref={canvasRef} className="max-h-[500px] max-w-full object-contain" />
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
