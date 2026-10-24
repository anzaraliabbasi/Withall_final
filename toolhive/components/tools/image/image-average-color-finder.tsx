"use client";

import { useState } from "react";
import { ToolShell, FileDrop, StatPill, Btn } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  percent?: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf:
        h = (gf - bf) / d + (gf < bf ? 6 : 0);
        break;
      case gf:
        h = (bf - rf) / d + 2;
        break;
      case bf:
        h = (rf - gf) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ImageAverageColorFinder() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [avgColor, setAvgColor] = useState<ColorResult | null>(null);
  const [dominantColors, setDominantColors] = useState<ColorResult[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Scale down image for fast analysis
      const maxDim = 200;
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

      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let validPixels = 0;

      // Color quantization map: bin RGB into 16x16x16 buckets
      const bins: { [key: string]: { count: number; sumR: number; sumG: number; sumB: number } } = {};

      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 20) continue; // skip transparent

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        sumR += r;
        sumG += g;
        sumB += b;
        validPixels++;

        // Bin key (quantize by dividing by 16)
        const binKey = `${Math.floor(r / 16)}_${Math.floor(g / 16)}_${Math.floor(b / 16)}`;
        if (!bins[binKey]) {
          bins[binKey] = { count: 0, sumR: 0, sumG: 0, sumB: 0 };
        }
        bins[binKey].count++;
        bins[binKey].sumR += r;
        bins[binKey].sumG += g;
        bins[binKey].sumB += b;
      }

      if (validPixels > 0) {
        const meanR = Math.round(sumR / validPixels);
        const meanG = Math.round(sumG / validPixels);
        const meanB = Math.round(sumB / validPixels);

        setAvgColor({
          hex: rgbToHex(meanR, meanG, meanB),
          rgb: `rgb(${meanR}, ${meanG}, ${meanB})`,
          hsl: rgbToHsl(meanR, meanG, meanB),
          r: meanR,
          g: meanG,
          b: meanB,
        });

        // Sort bins by population
        const sortedBins = Object.values(bins).sort((a, b) => b.count - a.count);
        const topBins = sortedBins.slice(0, 6);

        const dominants: ColorResult[] = topBins.map((bin) => {
          const br = Math.round(bin.sumR / bin.count);
          const bg = Math.round(bin.sumG / bin.count);
          const bb = Math.round(bin.sumB / bin.count);
          return {
            hex: rgbToHex(br, bg, bb),
            rgb: `rgb(${br}, ${bg}, ${bb})`,
            hsl: rgbToHsl(br, bg, bb),
            r: br,
            g: bg,
            b: bb,
            percent: Math.round((bin.count / validPixels) * 1000) / 10,
          };
        });

        setDominantColors(dominants);
      }
    };
    img.src = url;
  };

  const handleCopy = async (hex: string) => {
    await copyToClipboard(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <ToolShell
      side={
        avgColor ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Average Color
              </span>
              <div
                className="mt-2 flex h-24 w-full cursor-pointer flex-col justify-end rounded-2xl p-4 shadow-inner transition hover:opacity-95"
                style={{ backgroundColor: avgColor.hex }}
                onClick={() => handleCopy(avgColor.hex)}
              >
                <div className="rounded-lg bg-slate-950/70 p-2 text-white backdrop-blur flex justify-between items-center">
                  <div>
                    <div className="font-mono text-base font-bold">{avgColor.hex}</div>
                    <div className="text-[11px] opacity-80">
                      {avgColor.rgb} • {avgColor.hsl}
                    </div>
                  </div>
                  <Btn variant="outline" className="!px-2.5 !py-1 !text-xs text-white border-white/30 hover:bg-white/20">
                    {copiedHex === avgColor.hex ? "Copied!" : "Copy HEX"}
                  </Btn>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatPill label="Red (R)" value={avgColor.r} />
              <StatPill label="Green (G)" value={avgColor.g} />
              <StatPill label="Blue (B)" value={avgColor.b} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Top Dominant Color Buckets
              </span>
              <div className="mt-2 space-y-2">
                {dominantColors.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div
                      className="h-10 w-10 shrink-0 rounded-lg shadow-sm border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{col.hex}</span>
                        <span className="font-semibold text-hive-600 dark:text-hive-400">{col.percent}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full bg-hive-500 transition-all"
                          style={{ width: `${Math.min(100, col.percent || 0)}%` }}
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
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to compute average and dominant colors
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image Average Color Finder</h2>
          <p className="text-xs text-slate-500">
            Analyze any uploaded image on HTML canvas to extract exact average RGB/HEX/HSL color and top dominant color buckets.
          </p>
        </div>

        <FileDrop accept="image/*" onFiles={handleFiles} label="Drop an image here or click to browse" />

        {imageSrc && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Analyzed Image:
            </span>
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
              <img src={imageSrc} alt="Analyzed" className="max-h-72 object-contain"  loading="lazy" decoding="async" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
