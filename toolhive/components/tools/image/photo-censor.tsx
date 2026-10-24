"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Select, Range, FileDrop } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

type CensorMode = "pixelate" | "blur" | "blackout";

interface CensorRegion {
  id: string;
  x: number; // original pixel coordinates
  y: number;
  width: number;
  height: number;
  mode: CensorMode;
  intensity: number;
}

export default function PhotoCensor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("censored-photo");
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [currentMode, setCurrentMode] = useState<CensorMode>("pixelate");
  const [intensity, setIntensity] = useState<number>(12); // block size for pixelate, blur radius for blur
  const [regions, setRegions] = useState<CensorRegion[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeRect, setActiveRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
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
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
      setRegions([]);
    };
    img.src = url;
  };

  const drawCanvas = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || imgSize.width === 0) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    canvas.width = imgSize.width;
    canvas.height = imgSize.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw base image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // 2. Apply all censor regions
    const allRegions = [...regions];
    if (activeRect && activeRect.width > 0 && activeRect.height > 0) {
      allRegions.push({
        id: "temp",
        ...activeRect,
        mode: currentMode,
        intensity,
      });
    }

    for (const r of allRegions) {
      if (r.width <= 0 || r.height <= 0) continue;

      if (r.mode === "blackout") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(r.x, r.y, r.width, r.height);
      } else if (r.mode === "pixelate") {
        const blockSize = Math.max(2, r.intensity);
        const smallW = Math.max(1, Math.floor(r.width / blockSize));
        const smallH = Math.max(1, Math.floor(r.height / blockSize));

        const offCanvas = document.createElement("canvas");
        offCanvas.width = smallW;
        offCanvas.height = smallH;
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
          offCtx.imageSmoothingEnabled = false;
          offCtx.drawImage(img, r.x, r.y, r.width, r.height, 0, 0, smallW, smallH);

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(offCanvas, 0, 0, smallW, smallH, r.x, r.y, r.width, r.height);
          ctx.imageSmoothingEnabled = true;
        }
      } else if (r.mode === "blur") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.clip();
        ctx.filter = `blur(${Math.max(2, r.intensity)}px)`;
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }
    }
  }, [imgSize, regions, activeRect, currentMode, intensity]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || imgSize.width === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * imgSize.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * imgSize.height;

    setDragStart({ x: clickX, y: clickY });
    setIsDragging(true);
    setActiveRect({
      x: Math.round(clickX),
      y: Math.round(clickY),
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current || imgSize.width === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currX = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * imgSize.width), imgSize.width);
    const currY = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * imgSize.height), imgSize.height);

    const x = Math.min(dragStart.x, currX);
    const y = Math.min(dragStart.y, currY);
    const w = Math.abs(currX - dragStart.x);
    const h = Math.abs(currY - dragStart.y);

    setActiveRect({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(w),
      height: Math.round(h),
    });
  };

  const handleMouseUp = () => {
    if (isDragging && activeRect && activeRect.width > 5 && activeRect.height > 5) {
      setRegions((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          ...activeRect,
          mode: currentMode,
          intensity,
        },
      ]);
    }
    setIsDragging(false);
    setActiveRect(null);
  };

  const removeRegion = (id: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${fileName}-censored.png`);
    }, "image/png");
  };

  return (
    <ToolShell
      side={
        imageSrc ? (
          <div className="space-y-4">
            <Field label="Censor Effect Type">
              <Select
                value={currentMode}
                onChange={(val) => setCurrentMode(val as CensorMode)}
                options={[
                  { value: "pixelate", label: "Pixelate Block" },
                  { value: "blur", label: "Gaussian Blur" },
                  { value: "blackout", label: "Blackout Box" },
                ]}
              />
            </Field>

            {currentMode !== "blackout" && (
              <Field
                label={currentMode === "pixelate" ? "Block Size (px)" : "Blur Strength (px)"}
                hint={`${intensity}px`}
              >
                <Range value={intensity} onChange={setIntensity} min={4} max={40} suffix="px" />
              </Field>
            )}

            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Applied Censor Regions ({regions.length})
              </span>
              {regions.length > 0 && (
                <Btn variant="outline" className="!px-2.5 !py-1 !text-xs" onClick={() => setRegions([])}>
                  Clear All
                </Btn>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {regions.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    #{i + 1} {r.mode} ({r.width}×{r.height}px)
                  </span>
                  <Btn variant="outline" className="!px-2 !py-0.5 !text-xs" onClick={() => removeRegion(r.id)}>
                    Remove
                  </Btn>
                </div>
              ))}
              {regions.length === 0 && (
                <p className="text-xs text-slate-400 italic">No regions drawn yet. Drag on image to censor.</p>
              )}
            </div>

            <Btn onClick={handleDownload} className="w-full">
              Download Censored Image
            </Btn>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to start censoring sensitive areas
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Photo Censor</h2>
          <p className="text-xs text-slate-500">
            Drag boxes over sensitive photos to pixelate, blur, or blackout faces, documents, or numbers.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop photo here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Drag mouse over photo region to censor:
            </span>
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-1 dark:border-slate-800 cursor-crosshair flex justify-center"
            >
              <canvas ref={canvasRef} className="max-h-[500px] max-w-full object-contain block pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
