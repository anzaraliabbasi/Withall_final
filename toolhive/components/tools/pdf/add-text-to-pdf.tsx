"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, ColorInput, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface TextEntry {
  id: string;
  pageNumber: number; // 1-based, or 0 for All Pages
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  fontName: string;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return rgb(0, 0, 0);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

export default function AddTextToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [targetPage, setTargetPage] = useState<string>("1");
  const [textInput, setTextValue] = useState<string>("Confidential / Approved");
  const [xPos, setXPos] = useState<string>("50");
  const [yPos, setYPos] = useState<string>("750");
  const [fontSize, setFontSize] = useState<string>("16");
  const [textColor, setTextColor] = useState<string>("#1e293b");
  const [fontFamily, setFontFamily] = useState<string>(StandardFonts.Helvetica);

  const [entries, setEntries] = useState<TextEntry[]>([]);
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
      setEntries([]);
      setStatus(`Loaded "${selected.name}" with ${count} pages.`);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF file.");
    }
  };

  const addEntry = () => {
    if (!textInput.trim()) {
      setError("Please enter text content.");
      return;
    }
    setError(null);

    const entry: TextEntry = {
      id: `text-${Date.now()}`,
      pageNumber: parseInt(targetPage, 10),
      text: textInput,
      x: parseFloat(xPos) || 50,
      y: parseFloat(yPos) || 750,
      size: parseFloat(fontSize) || 16,
      color: textColor,
      fontName: fontFamily,
    };

    setEntries((prev) => [...prev, entry]);
    setStatus(`Added text layer for ${targetPage === "0" ? "All Pages" : `Page ${targetPage}`}.`);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const applyTextAndSave = async () => {
    if (!buffer || !file || entries.length === 0) {
      setError("Please upload a PDF and add at least one text layer.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Embedding text into PDF...");

    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Cache font embeddings
      const fontCache = new Map<string, unknown>();
      for (const entry of entries) {
        if (!fontCache.has(entry.fontName)) {
          const font = await pdfDoc.embedFont(entry.fontName as StandardFonts);
          fontCache.set(entry.fontName, font);
        }
      }

      for (const entry of entries) {
        const font = fontCache.get(entry.fontName) as import("pdf-lib").PDFFont;
        const color = hexToRgb(entry.color);

        if (entry.pageNumber === 0) {
          // Apply to all pages
          const pages = pdfDoc.getPages();
          for (const page of pages) {
            page.drawText(entry.text, {
              x: entry.x,
              y: entry.y,
              size: entry.size,
              font,
              color,
            });
          }
        } else if (entry.pageNumber >= 1 && entry.pageNumber <= pdfDoc.getPageCount()) {
          const page = pdfDoc.getPage(entry.pageNumber - 1);
          page.drawText(entry.text, {
            x: entry.x,
            y: entry.y,
            size: entry.size,
            font,
            color,
          });
        }
      }

      const updatedBytes = await pdfDoc.save();
      const outName = `${baseName(file.name)}-with-text.pdf`;
      downloadBlob(new Blob([updatedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus("Successfully added text to PDF!");
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF with text overlays.");
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
            <StatPill label="Text Layers" value={entries.length} />
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xs font-semibold uppercase text-slate-500">Add Text Configuration</h3>

            <Field label="Target Page">
              <Select value={targetPage} onChange={setTargetPage} options={pageOptions} />
            </Field>

            <Field label="Text String">
              <TextInput value={textInput} onChange={setTextValue} placeholder="Text overlay..." />
            </Field>

            <Field label="Font Style">
              <Select
                value={fontFamily}
                onChange={setFontFamily}
                options={[
                  { value: StandardFonts.Helvetica, label: "Helvetica Standard" },
                  { value: StandardFonts.HelveticaBold, label: "Helvetica Bold" },
                  { value: StandardFonts.HelveticaOblique, label: "Helvetica Italic" },
                  { value: StandardFonts.TimesRoman, label: "Times Roman" },
                  { value: StandardFonts.Courier, label: "Courier Monospace" },
                ]}
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="X Position (pt)">
                <TextInput type="number" value={xPos} onChange={setXPos} />
              </Field>
              <Field label="Y Position (pt)">
                <TextInput type="number" value={yPos} onChange={setYPos} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Font Size (pt)">
                <TextInput type="number" value={fontSize} onChange={setFontSize} />
              </Field>
              <Field label="Text Color">
                <ColorInput value={textColor} onChange={setTextColor} />
              </Field>
            </div>

            <Btn onClick={addEntry} disabled={!file} className="w-full !py-1.5 !text-xs">
              + Add Text Layer
            </Btn>
          </div>

          <Btn onClick={applyTextAndSave} disabled={!file || entries.length === 0 || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Apply & Download PDF"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add Text to PDF</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Overlay typed text, titles, headers, page numbers, or watermark labels onto any PDF document page.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop PDF file here or click to select"
        />

        {entries.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Queued Text Layers ({entries.length})
            </h3>
            <ul className="space-y-2">
              {entries.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                      &quot;{item.text}&quot;
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.pageNumber === 0 ? "All Pages" : `Page ${item.pageNumber}`} • ({item.x}, {item.y}) •{" "}
                      {item.size}pt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(item.id)}
                    className="ml-2 text-rose-500 hover:bg-rose-50 p-1 rounded dark:hover:bg-rose-950/30"
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
