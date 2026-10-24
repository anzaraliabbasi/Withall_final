"use client";

import { useState } from "react";
import { ToolShell, Field, Select, FileDrop, CodeBox, Btn } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

interface PaletteColor {
  hex: string;
  rgb: string;
  r: number;
  g: number;
  b: number;
  count: number;
  percent: number;
}

interface Pixel {
  r: number;
  g: number;
  b: number;
}

interface Box {
  pixels: Pixel[];
  rMin: number;
  rMax: number;
  gMin: number;
  gMax: number;
  bMin: number;
  bMax: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function createBox(pixels: Pixel[]): Box {
  let rMin = 255,
    rMax = 0;
  let gMin = 255,
    gMax = 0;
  let bMin = 255,
    bMax = 0;

  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i];
    if (p.r < rMin) rMin = p.r;
    if (p.r > rMax) rMax = p.r;
    if (p.g < gMin) gMin = p.g;
    if (p.g > gMax) gMax = p.g;
    if (p.b < bMin) bMin = p.b;
    if (p.b > bMax) bMax = p.b;
  }

  return { pixels, rMin, rMax, gMin, gMax, bMin, bMax };
}

function medianCut(pixels: Pixel[], targetCount: number): Box[] {
  if (pixels.length === 0) return [];
  const boxes: Box[] = [createBox(pixels)];

  while (boxes.length < targetCount) {
    // Find box with greatest range
    let maxBoxIdx = -1;
    let maxRange = -1;

    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.pixels.length <= 1) continue;
      const rRange = b.rMax - b.rMin;
      const gRange = b.gMax - b.gMin;
      const bRange = b.bMax - b.bMin;
      const range = Math.max(rRange, gRange, bRange);
      if (range > maxRange) {
        maxRange = range;
        maxBoxIdx = i;
      }
    }

    if (maxBoxIdx === -1 || maxRange <= 0) break; // Cannot split further

    const boxToSplit = boxes.splice(maxBoxIdx, 1)[0];
    const rRange = boxToSplit.rMax - boxToSplit.rMin;
    const gRange = boxToSplit.gMax - boxToSplit.gMin;
    const bRange = boxToSplit.bMax - boxToSplit.bMin;

    let sortChannel: "r" | "g" | "b" = "r";
    if (gRange >= rRange && gRange >= bRange) sortChannel = "g";
    else if (bRange >= rRange && bRange >= gRange) sortChannel = "b";

    boxToSplit.pixels.sort((a, b) => a[sortChannel] - b[sortChannel]);

    const medianIdx = Math.floor(boxToSplit.pixels.length / 2);
    boxes.push(createBox(boxToSplit.pixels.slice(0, medianIdx)));
    boxes.push(createBox(boxToSplit.pixels.slice(medianIdx)));
  }

  return boxes;
}

export default function ImageColorExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [paletteSize, setPaletteCount] = useState<string>("8");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const processImage = (url: string, countStr: string) => {
    const count = parseInt(countStr) || 8;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 150;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const pixels: Pixel[] = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 30) continue; // skip transparent
        pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
      }

      if (pixels.length === 0) return;

      const boxes = medianCut(pixels, count);
      const totalCount = pixels.length;

      const colors: PaletteColor[] = boxes
        .map((box) => {
          let sumR = 0,
            sumG = 0,
            sumB = 0;
          for (let p of box.pixels) {
            sumR += p.r;
            sumG += p.g;
            sumB += p.b;
          }
          const len = Math.max(1, box.pixels.length);
          const r = Math.round(sumR / len);
          const g = Math.round(sumG / len);
          const b = Math.round(sumB / len);
          return {
            hex: rgbToHex(r, g, b),
            rgb: `rgb(${r}, ${g}, ${b})`,
            r,
            g,
            b,
            count: box.pixels.length,
            percent: Math.round((box.pixels.length / totalCount) * 1000) / 10,
          };
        })
        .sort((a, b) => b.count - a.count);

      setPalette(colors);
    };
    img.src = url;
  };

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    setImageSrc(url);
    processImage(url, paletteSize);
  };

  const handlePaletteCountChange = (newCount: string) => {
    setPaletteCount(newCount);
    if (imageSrc) {
      processImage(imageSrc, newCount);
    }
  };

  const handleCopy = async (hex: string) => {
    await copyToClipboard(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const cssVarsCode = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.percent}% */`).join("\n")}\n}`;

  return (
    <ToolShell
      side={
        palette.length > 0 ? (
          <div className="space-y-4">
            <Field label="Number of Colors to Extract">
              <Select
                value={paletteSize}
                onChange={handlePaletteCountChange}
                options={[
                  { value: "4", label: "4 Colors" },
                  { value: "6", label: "6 Colors" },
                  { value: "8", label: "8 Colors" },
                  { value: "10", label: "10 Colors" },
                  { value: "12", label: "12 Colors" },
                  { value: "16", label: "16 Colors" },
                ]}
              />
            </Field>

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Extracted Color Palette
            </span>

            <div className="grid grid-cols-1 gap-2">
              {palette.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className="h-10 w-12 shrink-0 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{col.hex}</span>
                      <span className="font-semibold text-hive-600 dark:text-hive-400">{col.percent}%</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{col.rgb}</div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full bg-hive-500 transition-all"
                        style={{ width: `${Math.min(100, col.percent)}%` }}
                      />
                    </div>
                  </div>
                  <Btn
                    variant="outline"
                    className="!px-2.5 !py-1 !text-xs shrink-0"
                    onClick={() => handleCopy(col.hex)}
                  >
                    {copiedHex === col.hex ? "Copied" : "Copy"}
                  </Btn>
                </div>
              ))}
            </div>

            <CodeBox code={cssVarsCode} language="css" />
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to extract color palette
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Color Extractor</h2>
          <p className="text-xs text-slate-500">
            Extract beautiful, proportional color palettes using median-cut color quantization.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Source Image:
            </span>
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
              <img src={imageSrc} alt="Source" className="max-h-72 object-contain"  loading="lazy" decoding="async" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
