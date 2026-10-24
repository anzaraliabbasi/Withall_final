"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounced } from "@/components/ui/kit";
import QRCode from "qrcode";
import { ToolShell, Field, TextArea, Range, Select, ColorInput, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, downloadText } from "@/lib/download";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://toolhive.dev");
  const debouncedText = useDebounced(text, 250);
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");

  const [dataUrl, setDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [error, setError] = useState<string>("");

  const generateQr = useCallback(async () => {
    if (!debouncedText.trim()) {
      setDataUrl("");
      setSvgString("");
      setError("Please enter content to generate QR code");
      return;
    }

    try {
      setError("");
      const options: QRCode.QRCodeToDataURLOptions = {
        width: size,
        margin: margin,
        errorCorrectionLevel: ecLevel,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      };

      const url = await QRCode.toDataURL(debouncedText, options);
      setDataUrl(url);

      const svg = await QRCode.toString(debouncedText, {
        type: "svg",
        margin: margin,
        errorCorrectionLevel: ecLevel,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setSvgString(svg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
    }
  }, [debouncedText, size, margin, ecLevel, darkColor, lightColor]);

  useEffect(() => {
    generateQr();
  }, [generateQr]);

  const handleDownloadPng = () => {
    if (!svgString) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => { if (blob) downloadBlob(blob, "qrcode.png"); }, "image/png");
    };
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    downloadText(svgString, "qrcode.svg", "image/svg+xml");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Dimensions" value={`${size} × ${size} px`} />

          <Field label="QR Code Preview">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              {dataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="rounded-lg shadow-sm"
                  style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
                 loading="lazy" decoding="async" />
              ) : (
                <div className="text-xs text-slate-400">No QR Code generated</div>
              )}
            </div>
          </Field>

          {error ? (
            <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {error}
            </div>
          ) : (
            <div className="flex gap-2">
              <Btn onClick={handleDownloadPng} variant="primary" className="flex-1">
                Download PNG
              </Btn>
              <Btn onClick={handleDownloadSvg} variant="outline" className="flex-1">
                Download SVG
              </Btn>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="QR Code Content / URL">
          <TextArea
            value={text}
            onChange={setText}
            placeholder="Enter URL, text, WiFi string, or contact details..."
            rows={4}
          />
        </Field>

        <Field label={`Resolution Size (${size}px)`}>
          <Range value={size} onChange={setSize} min={128} max={1024} step={32} suffix="px" />
        </Field>

        <Field label={`Margin Border (${margin})`}>
          <Range value={margin} onChange={setMargin} min={0} max={10} step={1} />
        </Field>

        <Field label="Error Correction Level">
          <Select
            value={ecLevel}
            onChange={(v) => setEcLevel(v as "L" | "M" | "Q" | "H")}
            options={[
              { value: "L", label: "Low (7% recovery)" },
              { value: "M", label: "Medium (15% recovery)" },
              { value: "Q", label: "Quartile (25% recovery)" },
              { value: "H", label: "High (30% recovery)" },
            ]}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Foreground / Dark Color">
            <ColorInput value={darkColor} onChange={setDarkColor} />
          </Field>

          <Field label="Background / Light Color">
            <ColorInput value={lightColor} onChange={setLightColor} />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
