"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Select, Range, FileDrop, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

type AspectRatio = "free" | "1:1" | "16:9" | "4:3" | "3:2" | "2:3" | "9:16";

interface CropRect {
  x: number; // in pixel coords relative to original image
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("cropped-image");
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [aspect, setAspect] = useState<AspectRatio>("free");
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [format, setFormat] = useState<string>("image/png");
  const [quality, setQuality] = useState<number>(90);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
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
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
      setCrop({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const applyAspect = useCallback(
    (targetAspect: AspectRatio, currentCrop: CropRect, original: { width: number; height: number }) => {
      if (original.width === 0 || original.height === 0) return currentCrop;
      if (targetAspect === "free") return currentCrop;

      let ratio = 1;
      if (targetAspect === "1:1") ratio = 1;
      else if (targetAspect === "16:9") ratio = 16 / 9;
      else if (targetAspect === "4:3") ratio = 4 / 3;
      else if (targetAspect === "3:2") ratio = 3 / 2;
      else if (targetAspect === "2:3") ratio = 2 / 3;
      else if (targetAspect === "9:16") ratio = 9 / 16;

      let w = currentCrop.width || original.width;
      let h = w / ratio;
      if (h > original.height) {
        h = original.height;
        w = h * ratio;
      }
      let x = currentCrop.x;
      let y = currentCrop.y;
      if (x + w > original.width) x = Math.max(0, original.width - w);
      if (y + h > original.height) y = Math.max(0, original.height - h);

      return { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) };
    },
    []
  );

  const handleAspectChange = (newAspect: AspectRatio) => {
    setAspect(newAspect);
    setCrop((prev) => applyAspect(newAspect, prev, imgSize));
  };

  // Update live preview canvas whenever crop or image changes
  useEffect(() => {
    if (!imgRef.current || !previewCanvasRef.current || crop.width <= 0 || crop.height <= 0) return;
    const canvas = previewCanvasRef.current;
    canvas.width = Math.max(1, crop.width);
    canvas.height = Math.max(1, crop.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      imgRef.current,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [crop, imageSrc]);

  // Pointer drag event handlers on the displayed image box
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || imgSize.width === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * imgSize.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * imgSize.height;

    setDragStart({ x: clickX, y: clickY });
    setIsDragging(true);
    setCrop({
      x: Math.min(Math.max(0, Math.round(clickX)), imgSize.width),
      y: Math.min(Math.max(0, Math.round(clickY)), imgSize.height),
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current || imgSize.width === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currX = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * imgSize.width), imgSize.width);
    const currY = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * imgSize.height), imgSize.height);

    let x = Math.min(dragStart.x, currX);
    let y = Math.min(dragStart.y, currY);
    let w = Math.abs(currX - dragStart.x);
    let h = Math.abs(currY - dragStart.y);

    if (aspect !== "free") {
      let ratio = 1;
      if (aspect === "1:1") ratio = 1;
      else if (aspect === "16:9") ratio = 16 / 9;
      else if (aspect === "4:3") ratio = 4 / 3;
      else if (aspect === "3:2") ratio = 3 / 2;
      else if (aspect === "2:3") ratio = 2 / 3;
      else if (aspect === "9:16") ratio = 9 / 16;

      h = w / ratio;
      if (y + h > imgSize.height) {
        h = imgSize.height - y;
        w = h * ratio;
      }
    }

    setCrop({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(w),
      height: Math.round(h),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    if (!imgRef.current || crop.width <= 0 || crop.height <= 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      imgRef.current,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    canvas.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `${fileName}-cropped.${ext}`);
      },
      format,
      quality / 100
    );
  };

  const selectFull = () => {
    setCrop({ x: 0, y: 0, width: imgSize.width, height: imgSize.height });
  };

  return (
    <ToolShell
      side={
        imageSrc ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <StatPill label="Original" value={`${imgSize.width} × ${imgSize.height}`} />
              <StatPill label="Crop Size" value={`${crop.width} × ${crop.height}`} />
            </div>

            <Field label="Aspect Ratio Preset">
              <div className="flex flex-wrap gap-2">
                {(["free", "1:1", "16:9", "4:3", "3:2", "9:16"] as AspectRatio[]).map((a) => (
                  <Btn
                    key={a}
                    variant={aspect === a ? "primary" : "outline"}
                    className="!px-3 !py-1 !text-xs"
                    onClick={() => handleAspectChange(a)}
                  >
                    {a === "free" ? "Freeform" : a}
                  </Btn>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Crop X (px)">
                <input
                  type="number"
                  value={crop.x}
                  onChange={(e) => setCrop({ ...crop, x: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="input-base text-xs font-mono"
                />
              </Field>
              <Field label="Crop Y (px)">
                <input
                  type="number"
                  value={crop.y}
                  onChange={(e) => setCrop({ ...crop, y: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="input-base text-xs font-mono"
                />
              </Field>
              <Field label="Crop Width (px)">
                <input
                  type="number"
                  value={crop.width}
                  onChange={(e) => setCrop({ ...crop, width: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="input-base text-xs font-mono"
                />
              </Field>
              <Field label="Crop Height (px)">
                <input
                  type="number"
                  value={crop.height}
                  onChange={(e) => setCrop({ ...crop, height: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="input-base text-xs font-mono"
                />
              </Field>
            </div>

            <div className="flex gap-2">
              <Btn variant="outline" className="w-full !text-xs" onClick={selectFull}>
                Reset to Full Image
              </Btn>
            </div>

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

            <Field label="Crop Preview">
              <div className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
                <canvas ref={previewCanvasRef} className="max-h-48 max-w-full object-contain" />
              </div>
            </Field>

            <Btn onClick={handleDownload} className="w-full">
              Download Cropped Image
            </Btn>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to start cropping
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Cropper</h2>
          <p className="text-xs text-slate-500">
            Upload an image, drag to select crop box or enter exact pixel coordinates.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Drag on image to select crop region:
            </span>
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-slate-800 cursor-crosshair"
            >
              <img src={imageSrc} alt="Source" className="w-full block object-contain pointer-events-none"  loading="lazy" decoding="async" />
              {crop.width > 0 && crop.height > 0 && imgSize.width > 0 && (
                <div
                  className="absolute border-2 border-hive-500 bg-hive-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                  style={{
                    left: `${(crop.x / imgSize.width) * 100}%`,
                    top: `${(crop.y / imgSize.height) * 100}%`,
                    width: `${(crop.width / imgSize.width) * 100}%`,
                    height: `${(crop.height / imgSize.height) * 100}%`,
                  }}
                >
                  <div className="absolute top-1 left-1 rounded bg-hive-500 px-1 py-0.5 text-[9px] font-bold text-slate-950">
                    {crop.width} × {crop.height}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
