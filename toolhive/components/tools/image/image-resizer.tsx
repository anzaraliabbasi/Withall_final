"use client";

import { useState, useRef, useEffect } from "react";
import { ToolShell, Field, Btn, Select, Range, Toggle, FileDrop, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("resized-image");
  const [origSize, setOrigSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<string>("image/png");
  const [quality, setQuality] = useState<number>(90);
  const [scalePercent, setScalePercent] = useState<number>(100);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(baseName(file.name));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImageSrc(url);
      setOrigSize({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setScalePercent(100);
    };
    img.src = url;
  };

  const updateWidth = (newW: number) => {
    const w = Math.max(1, newW);
    setTargetWidth(w);
    if (lockAspect && origSize.width > 0) {
      const newH = Math.round((w / origSize.width) * origSize.height);
      setTargetHeight(newH);
      setScalePercent(Math.round((w / origSize.width) * 100));
    }
  };

  const updateHeight = (newH: number) => {
    const h = Math.max(1, newH);
    setTargetHeight(h);
    if (lockAspect && origSize.height > 0) {
      const newW = Math.round((h / origSize.height) * origSize.width);
      setTargetWidth(newW);
      setScalePercent(Math.round((h / origSize.height) * 100));
    }
  };

  const applyPercent = (pct: number) => {
    setScalePercent(pct);
    if (origSize.width > 0 && origSize.height > 0) {
      const w = Math.round((origSize.width * pct) / 100);
      const h = Math.round((origSize.height * pct) / 100);
      setTargetWidth(Math.max(1, w));
      setTargetHeight(Math.max(1, h));
    }
  };

  const applyPresetMax = (maxDim: number) => {
    if (origSize.width === 0 || origSize.height === 0) return;
    const ratio = Math.min(maxDim / origSize.width, maxDim / origSize.height);
    const w = Math.round(origSize.width * ratio);
    const h = Math.round(origSize.height * ratio);
    setTargetWidth(w);
    setTargetHeight(h);
    setScalePercent(Math.round(ratio * 100));
  };

  useEffect(() => {
    if (!imgRef.current || !previewCanvasRef.current || targetWidth <= 0 || targetHeight <= 0) return;
    const canvas = previewCanvasRef.current;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(imgRef.current, 0, 0, targetWidth, targetHeight);
  }, [targetWidth, targetHeight, imageSrc]);

  const handleDownload = () => {
    if (!imgRef.current || targetWidth <= 0 || targetHeight <= 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, 0, 0, targetWidth, targetHeight);

    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    canvas.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `${fileName}-${targetWidth}x${targetHeight}.${ext}`);
      },
      format,
      quality / 100
    );
  };

  return (
    <ToolShell
      side={
        imageSrc ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <StatPill label="Original" value={`${origSize.width} × ${origSize.height}`} />
              <StatPill label="Resized" value={`${targetWidth} × ${targetHeight}`} />
            </div>

            <Toggle checked={lockAspect} onChange={setLockAspect} label="Lock Aspect Ratio" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Target Width (px)">
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => updateWidth(parseInt(e.target.value) || 1)}
                  className="input-base text-xs font-mono"
                />
              </Field>
              <Field label="Target Height (px)">
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => updateHeight(parseInt(e.target.value) || 1)}
                  className="input-base text-xs font-mono"
                />
              </Field>
            </div>

            <Field label="Quick Percentage Scale">
              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100, 150, 200].map((pct) => (
                  <Btn
                    key={pct}
                    variant={scalePercent === pct ? "primary" : "outline"}
                    className="!px-2.5 !py-1 !text-xs"
                    onClick={() => applyPercent(pct)}
                  >
                    {pct}%
                  </Btn>
                ))}
              </div>
            </Field>

            <Field label="Max Dimension Presets">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "1920px (Full HD)", max: 1920 },
                  { label: "1280px (HD)", max: 1280 },
                  { label: "1080px (Instagram)", max: 1080 },
                  { label: "800px (Web)", max: 800 },
                  { label: "500px (Thumb)", max: 500 },
                ].map((p) => (
                  <Btn key={p.max} variant="outline" className="!px-2.5 !py-1 !text-xs" onClick={() => applyPresetMax(p.max)}>
                    {p.label}
                  </Btn>
                ))}
              </div>
            </Field>

            <Field label="Export Format">
              <Select
                value={format}
                onChange={setFormat}
                options={[
                  { value: "image/png", label: "PNG (.png)" },
                  { value: "image/jpeg", label: "JPEG (.jpg)" },
                  { value: "image/webp", label: "WebP (.webp)" },
                ]}
              />
            </Field>

            {format !== "image/png" && (
              <Field label="Quality" hint={`${quality}%`}>
                <Range value={quality} onChange={setQuality} min={10} max={100} suffix="%" />
              </Field>
            )}

            <Field label="Resized Preview">
              <div className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
                <canvas ref={previewCanvasRef} className="max-h-48 max-w-full object-contain" />
              </div>
            </Field>

            <Btn onClick={handleDownload} className="w-full">
              Download Resized Image
            </Btn>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to resize
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Resizer</h2>
          <p className="text-xs text-slate-500">
            Scale dimensions by percentage or target pixels with optional aspect ratio lock and high quality resampling.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Original Image Preview:
            </span>
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
              <img src={imageSrc} alt="Original" className="max-h-72 object-contain"  loading="lazy" decoding="async" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
