"use client";

import { useState } from "react";
import { ToolShell, Field, Select, FileDrop, StatPill, Output } from "@/components/ui/kit";
import { baseName } from "@/lib/download";

export default function ImageToBase64Converter() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image");
  const [fileSize, setFileSize] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [outputMode, setOutputMode] = useState<string>("data-uri");

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileName(baseName(file.name));
    setFileSize(file.size);
    setMimeType(file.type || "image/png");

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setDataUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFormattedOutput = (): string => {
    if (!dataUrl) return "";
    const rawBase64 = dataUrl.replace(/^data:[^;]+;base64,/, "");

    switch (outputMode) {
      case "base64-only":
        return rawBase64;
      case "html":
        return `<img src="${dataUrl}" alt="${fileName}"  loading="lazy" decoding="async" />`;
      case "css":
        return `background-image: url("${dataUrl}");`;
      case "markdown":
        return `![${fileName}](${dataUrl})`;
      case "data-uri":
      default:
        return dataUrl;
    }
  };

  const formattedResult = getFormattedOutput();

  return (
    <ToolShell
      side={
        dataUrl ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <StatPill label="File Size" value={formatFileSize(fileSize)} />
              <StatPill label="Base64 Length" value={`${formattedResult.length.toLocaleString()} chars`} />
            </div>

            <Field label="Output Format Mode">
              <Select
                value={outputMode}
                onChange={setOutputMode}
                options={[
                  { value: "data-uri", label: "Data URI (data:image/...;base64,...)" },
                  { value: "base64-only", label: "Raw Base64 String Only" },
                  { value: "html", label: "HTML <img> Tag" },
                  { value: "css", label: "CSS Background-Image" },
                  { value: "markdown", label: "Markdown Image Tag" },
                ]}
              />
            </Field>

            <Field label="Image Preview">
              <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-3 dark:border-slate-800">
                <img src={dataUrl} alt={fileName} className="max-h-48 object-contain"  loading="lazy" decoding="async" />
              </div>
            </Field>

            <Output
              text={formattedResult}
              label={`Base64 Output (${outputMode})`}
              filename={`${fileName}-base64.txt`}
              mono
            />
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Upload an image to convert to Base64
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Image to Base64 Converter</h2>
          <p className="text-xs text-slate-500">
            Convert image files (PNG, JPG, SVG, WebP, GIF) to Data URLs or raw Base64 strings for direct inline embedding.
          </p>
        </div>

        <FileDrop
          accept="image/*"
          onFiles={handleFiles}
          label="Drop an image file here or click to browse"
        />

        {dataUrl && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 text-xs font-mono space-y-1">
            <div>
              <span className="font-semibold text-slate-500">File Name:</span> {fileName}
            </div>
            <div>
              <span className="font-semibold text-slate-500">MIME Type:</span> {mimeType}
            </div>
            <div>
              <span className="font-semibold text-slate-500">Overhead:</span> ~33% larger than binary
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
