"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, ColorInput, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface WhiteoutRect {
  id: string;
  pageNumber: number; // 0 for All Pages, 1..N for specific page
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  unit: "pt" | "mm";
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return rgb(1, 1, 1);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

export default function WhiteoutPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [unit, setUnit] = useState<"pt" | "mm">("pt");
  const [targetPage, setTargetPage] = useState<string>("1");
  const [xPos, setXPos] = useState<string>("50");
  const [yPos, setYPos] = useState<string>("100");
  const [rectWidth, setRectWidth] = useState<string>("200");
  const [rectHeight, setRectHeight] = useState<string>("60");
  const [boxColor, setBoxColor] = useState<string>("#ffffff");

  const [rectangles, setRectangles] = useState<WhiteoutRect[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setStatus(null);
    const selected = files[0];
    if (!selected || (!selected.type.includes("pdf") && !selected.name.endsWith(".pdf"))) {
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      const buf = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const count = doc.getPageCount();

      setFile(selected);
      setBuffer(buf);
      setPageCount(count);
      setTargetPage("1");
      setRectangles([]);
      setStatus(`Loaded "${selected.name}" with ${count} pages.`);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF document.");
    }
  };

  const addRectangle = () => {
    const rect: WhiteoutRect = {
      id: `rect-${Date.now()}`,
      pageNumber: parseInt(targetPage, 10),
      x: parseFloat(xPos) || 0,
      y: parseFloat(yPos) || 0,
      width: parseFloat(rectWidth) || 100,
      height: parseFloat(rectHeight) || 50,
      color: boxColor,
      unit,
    };

    setRectangles((prev) => [...prev, rect]);
    setStatus(`Added whiteout box to ${targetPage === "0" ? "All Pages" : `Page ${targetPage}`}.`);
  };

  const removeRectangle = (id: string) => {
    setRectangles((prev) => prev.filter((r) => r.id !== id));
  };

  const applyWhiteout = async () => {
    if (!buffer || !file || rectangles.length === 0) {
      setError("Please load a PDF and add at least one whiteout box.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Applying whiteout rectangles...");

    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = doc.getPageCount();

      for (const rect of rectangles) {
        // Convert mm to points if unit is mm (1 mm = 2.83465 pt)
        const mult = rect.unit === "mm" ? 2.83465 : 1;
        const x = rect.x * mult;
        const y = rect.y * mult;
        const width = rect.width * mult;
        const height = rect.height * mult;
        const color = hexToRgb(rect.color);

        if (rect.pageNumber === 0) {
          // Apply to all pages
          const pages = doc.getPages();
          for (const page of pages) {
            page.drawRectangle({ x, y, width, height, color });
          }
        } else if (rect.pageNumber >= 1 && rect.pageNumber <= totalPages) {
          const page = doc.getPage(rect.pageNumber - 1);
          page.drawRectangle({ x, y, width, height, color });
        }
      }

      const updatedBytes = await doc.save();
      const outName = `${baseName(file.name)}-whiteout.pdf`;
      downloadBlob(new Blob([updatedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus("Whiteout applied successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to apply whiteout overlays to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pageOptions = [
    { value: "0", label: "All Pages" },
    ...Array.from({ length: pageCount }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Page ${i + 1}`,
    })),
  ];

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Total Pages" value={pageCount} />
            <StatPill label="Boxes Queued" value={rectangles.length} />
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xs font-semibold uppercase text-slate-500">Configure Whiteout Box</h3>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Unit">
                <Select
                  value={unit}
                  onChange={(v) => setUnit(v as "pt" | "mm")}
                  options={[
                    { value: "pt", label: "Points (pt)" },
                    { value: "mm", label: "Millimeters (mm)" },
                  ]}
                />
              </Field>

              <Field label="Target Page">
                <Select value={targetPage} onChange={setTargetPage} options={pageOptions} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label={`X Position (${unit})`}>
                <TextInput type="number" value={xPos} onChange={setXPos} />
              </Field>
              <Field label={`Y Position (${unit})`}>
                <TextInput type="number" value={yPos} onChange={setYPos} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label={`Width (${unit})`}>
                <TextInput type="number" value={rectWidth} onChange={setRectWidth} />
              </Field>
              <Field label={`Height (${unit})`}>
                <TextInput type="number" value={rectHeight} onChange={setRectHeight} />
              </Field>
            </div>

            <Field label="Cover / Fill Color">
              <ColorInput value={boxColor} onChange={setBoxColor} />
            </Field>

            <Btn onClick={addRectangle} disabled={!file} className="w-full !py-1.5 !text-xs">
              + Add Cover Rectangle
            </Btn>
          </div>

          <Btn onClick={applyWhiteout} disabled={!file || rectangles.length === 0 || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Apply & Download PDF"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Whiteout PDF</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Cover sensitive sections, signatures, or unwanted text with solid white (or custom colored) redaction rectangles.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop PDF file here or click to browse"
        />

        {rectangles.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Queued Whiteout Boxes ({rectangles.length})
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {rectangles.map((rect) => (
                <li
                  key={rect.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rounded border border-slate-300 shadow-sm"
                      style={{ backgroundColor: rect.color }}
                    />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {rect.pageNumber === 0 ? "All Pages" : `Page ${rect.pageNumber}`}
                      </span>
                      <span className="ml-2 text-slate-400">
                        ({rect.x}, {rect.y}) — {rect.width}x{rect.height} {rect.unit}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRectangle(rect.id)}
                    className="text-rose-500 hover:bg-rose-50 p-1 rounded dark:hover:bg-rose-950/30"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
