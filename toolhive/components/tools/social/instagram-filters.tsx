"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolShell, Field, Range, Btn, FileDrop } from "@/components/ui/kit";
import { downloadBlob } from "@/lib/download";

interface FilterPreset {
  name: string;
  filter: string;
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
}

const PRESETS: FilterPreset[] = [
  { name: "Normal", filter: "none", brightness: 100, contrast: 100, saturate: 100, sepia: 0, grayscale: 0 },
  { name: "Clarendon", filter: "contrast(120%) saturate(135%)", brightness: 105, contrast: 120, saturate: 135, sepia: 0, grayscale: 0 },
  { name: "Gingham", filter: "brightness(105%) hue-rotate(-10deg)", brightness: 105, contrast: 90, saturate: 90, sepia: 10, grayscale: 0 },
  { name: "Moon", filter: "grayscale(100%) contrast(110%)", brightness: 110, contrast: 110, saturate: 100, sepia: 0, grayscale: 100 },
  { name: "Lark", filter: "contrast(90%) brightness(110%) saturate(110%)", brightness: 110, contrast: 90, saturate: 110, sepia: 0, grayscale: 0 },
  { name: "Reyes", filter: "sepia(22%) brightness(110%) contrast(85%)", brightness: 110, contrast: 85, saturate: 75, sepia: 22, grayscale: 0 },
  { name: "Juno", filter: "contrast(115%) saturate(130%)", brightness: 100, contrast: 115, saturate: 130, sepia: 0, grayscale: 0 },
  { name: "Slumber", filter: "saturate(66%) brightness(105%) sepia(15%)", brightness: 105, contrast: 100, saturate: 66, sepia: 15, grayscale: 0 },
  { name: "Crema", filter: "contrast(90%) brightness(110%) sepia(10%)", brightness: 110, contrast: 90, saturate: 90, sepia: 10, grayscale: 0 },
];

export default function InstagramFilters() {
  const [imgSrc, setImgSrc] = useState<string>(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E"
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("Clarendon");
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(120);
  const [saturate, setSaturate] = useState(135);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const applyPreset = (preset: FilterPreset) => {
    setSelectedPreset(preset.name);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturate(preset.saturate);
    setSepia(preset.sepia);
    setGrayscale(preset.grayscale);
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%) grayscale(${grayscale}%)`;
    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [brightness, contrast, saturate, sepia, grayscale]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      renderCanvas();
    };
    img.src = imgSrc;
  }, [imgSrc, renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImgSrc(url);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `instagram-filter-${selectedPreset.toLowerCase()}.png`);
      }
    }, "image/png");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Filtered Canvas Preview
            </h3>
            <Btn onClick={handleDownload} variant="primary" className="!text-xs !py-1.5 !px-3">
              Download PNG
            </Btn>
          </div>

          <div className="flex justify-center items-center overflow-hidden p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="max-h-[500px] w-auto rounded-xl object-contain shadow-md" />
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Instagram Filter Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apply authentic Instagram photo filters and fine-tune image color parameters.
          </p>
        </div>

        <Field label="Upload Image">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Drop photo to apply filters" />
        </Field>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2 block">
            Preset Filters
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => {
              const active = selectedPreset === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                    active
                      ? "border-hive-500 bg-hive-500/10 text-hive-600 dark:text-hive-400"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 block">
            Fine-Tune Adjustments
          </span>

          <Field label={`Brightness (${brightness}%)`}>
            <Range value={brightness} onChange={setBrightness} min={50} max={180} suffix="%" />
          </Field>

          <Field label={`Contrast (${contrast}%)`}>
            <Range value={contrast} onChange={setContrast} min={50} max={180} suffix="%" />
          </Field>

          <Field label={`Saturation (${saturate}%)`}>
            <Range value={saturate} onChange={setSaturate} min={0} max={200} suffix="%" />
          </Field>

          <Field label={`Sepia Tone (${sepia}%)`}>
            <Range value={sepia} onChange={setSepia} min={0} max={100} suffix="%" />
          </Field>

          <Field label={`Grayscale (${grayscale}%)`}>
            <Range value={grayscale} onChange={setGrayscale} min={0} max={100} suffix="%" />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
