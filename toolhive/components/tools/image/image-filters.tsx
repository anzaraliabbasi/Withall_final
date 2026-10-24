"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Btn, Range, FileDrop } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface FilterSettings {
  brightness: number; // 0..200, def 100
  contrast: number; // 0..200, def 100
  saturate: number; // 0..200, def 100
  hueRotate: number; // 0..360, def 0
  grayscale: number; // 0..100, def 0
  sepia: number; // 0..100, def 0
  blur: number; // 0..20, def 0
  opacity: number; // 0..100, def 100
  invert: number; // 0..100, def 0
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  opacity: 100,
  invert: 0,
};

export default function ImageFilters() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("filtered-image");
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const getFilterString = useCallback((f: FilterSettings) => {
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale}%) sepia(${f.sepia}%) blur(${f.blur}px) opacity(${f.opacity}%) invert(${f.invert}%)`;
  }, []);

  const renderCanvas = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showOriginal) {
      ctx.filter = "none";
    } else {
      ctx.filter = getFilterString(filters);
    }
    ctx.drawImage(img, 0, 0);
  }, [filters, showOriginal, getFilterString]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, imageSrc]);

  const applyPreset = (preset: Partial<FilterSettings>) => {
    setFilters({ ...DEFAULT_FILTERS, ...preset });
  };

  const handleDownload = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = getFilterString(filters);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${fileName}-filtered.png`);
    }, "image/png");
  };

  return (
    <ToolShell
      side={
        imageSrc ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter Controls</span>
              <Btn variant="outline" className="!px-2.5 !py-1 !text-xs" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Reset Filters
              </Btn>
            </div>

            <Field label="Presets">
              <div className="flex flex-wrap gap-1.5">
                <Btn variant="outline" className="!px-2 !py-0.5 !text-xs" onClick={() => applyPreset(DEFAULT_FILTERS)}>
                  Original
                </Btn>
                <Btn
                  variant="outline"
                  className="!px-2 !py-0.5 !text-xs"
                  onClick={() => applyPreset({ sepia: 70, contrast: 110, brightness: 95, saturate: 80 })}
                >
                  Vintage
                </Btn>
                <Btn
                  variant="outline"
                  className="!px-2 !py-0.5 !text-xs"
                  onClick={() => applyPreset({ grayscale: 100, contrast: 130 })}
                >
                  B&W Drama
                </Btn>
                <Btn
                  variant="outline"
                  className="!px-2 !py-0.5 !text-xs"
                  onClick={() => applyPreset({ hueRotate: 180, saturate: 160, contrast: 120 })}
                >
                  Cyberpunk
                </Btn>
                <Btn
                  variant="outline"
                  className="!px-2 !py-0.5 !text-xs"
                  onClick={() => applyPreset({ brightness: 115, saturate: 130, sepia: 20 })}
                >
                  Warm Soft
                </Btn>
                <Btn
                  variant="outline"
                  className="!px-2 !py-0.5 !text-xs"
                  onClick={() => applyPreset({ blur: 4, contrast: 110 })}
                >
                  Soft Blur
                </Btn>
              </div>
            </Field>

            <Field label="Brightness" hint={`${filters.brightness}%`}>
              <Range
                value={filters.brightness}
                onChange={(v) => setFilters({ ...filters, brightness: v })}
                min={0}
                max={200}
                suffix="%"
              />
            </Field>

            <Field label="Contrast" hint={`${filters.contrast}%`}>
              <Range
                value={filters.contrast}
                onChange={(v) => setFilters({ ...filters, contrast: v })}
                min={0}
                max={200}
                suffix="%"
              />
            </Field>

            <Field label="Saturation" hint={`${filters.saturate}%`}>
              <Range
                value={filters.saturate}
                onChange={(v) => setFilters({ ...filters, saturate: v })}
                min={0}
                max={200}
                suffix="%"
              />
            </Field>

            <Field label="Hue Rotate" hint={`${filters.hueRotate}°`}>
              <Range
                value={filters.hueRotate}
                onChange={(v) => setFilters({ ...filters, hueRotate: v })}
                min={0}
                max={360}
                suffix="°"
              />
            </Field>

            <Field label="Grayscale" hint={`${filters.grayscale}%`}>
              <Range
                value={filters.grayscale}
                onChange={(v) => setFilters({ ...filters, grayscale: v })}
                min={0}
                max={100}
                suffix="%"
              />
            </Field>

            <Field label="Sepia" hint={`${filters.sepia}%`}>
              <Range
                value={filters.sepia}
                onChange={(v) => setFilters({ ...filters, sepia: v })}
                min={0}
                max={100}
                suffix="%"
              />
            </Field>

            <Field label="Blur" hint={`${filters.blur}px`}>
              <Range
                value={filters.blur}
                onChange={(v) => setFilters({ ...filters, blur: v })}
                min={0}
                max={20}
                suffix="px"
              />
            </Field>

            <Field label="Invert" hint={`${filters.invert}%`}>
              <Range
                value={filters.invert}
                onChange={(v) => setFilters({ ...filters, invert: v })}
                min={0}
                max={100}
                suffix="%"
              />
            </Field>

            <Field label="Opacity" hint={`${filters.opacity}%`}>
              <Range
                value={filters.opacity}
                onChange={(v) => setFilters({ ...filters, opacity: v })}
                min={0}
                max={100}
                suffix="%"
              />
            </Field>

            <Btn onClick={handleDownload} className="w-full">
              Download Filtered Image
            </Btn>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to apply filters
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Filters</h2>
          <p className="text-xs text-slate-500">
            Apply CSS canvas filters like brightness, contrast, saturation, hue rotation, sepia, and blur in real-time.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Canvas Result
              </span>
              <button
                type="button"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                className="text-xs font-medium text-hive-600 dark:text-hive-400 underline cursor-pointer"
              >
                Press & Hold for Original
              </button>
            </div>
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
              <canvas ref={canvasRef} className="max-h-[450px] max-w-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
