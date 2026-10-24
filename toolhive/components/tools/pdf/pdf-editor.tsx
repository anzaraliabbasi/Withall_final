"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, ColorInput, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface PageState {
  id: string;
  originalIndex: number; // 0-based
  pageNumber: number; // 1-based display
  rotation: number; // 0, 90, 180, 270
}

interface TextOverlay {
  id: string;
  pageIndex: number; // 1-based
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface RectOverlay {
  id: string;
  pageIndex: number; // 1-based
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
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

export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);

  // Text annotation tool state
  const [textPage, setTextPage] = useState<number>(1);
  const [textValue, setTextValue] = useState<string>("Sample Text");
  const [textX, setTextX] = useState<string>("50");
  const [textY, setTextY] = useState<string>("700");
  const [textSize, setTextSize] = useState<string>("18");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);

  // Rect/Whiteout annotation tool state
  const [rectPage, setRectPage] = useState<number>(1);
  const [rectX, setRectX] = useState<string>("50");
  const [rectY, setRectY] = useState<string>("600");
  const [rectW, setRectW] = useState<string>("200");
  const [rectH, setRectH] = useState<string>("50");
  const [rectColor, setRectColor] = useState<string>("#ffffff");
  const [rectOverlays, setRectOverlays] = useState<RectOverlay[]>([]);

  const [activeTab, setActiveTab] = useState<"pages" | "text" | "rect">("pages");
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

      const initialPages: PageState[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i + 1}-${Date.now()}`,
        originalIndex: i,
        pageNumber: i + 1,
        rotation: 0,
      }));

      setFile(selected);
      setBuffer(buf);
      setPages(initialPages);
      setTextOverlays([]);
      setRectOverlays([]);
      setTextPage(1);
      setRectPage(1);
      setStatus(`Loaded "${selected.name}" with ${count} pages.`);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF file. It may be encrypted or corrupted.");
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setPages(updated);
  };

  const deletePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const addTextOverlay = () => {
    if (!textValue.trim()) return;
    const item: TextOverlay = {
      id: `text-${Date.now()}`,
      pageIndex: textPage,
      text: textValue,
      x: parseFloat(textX) || 50,
      y: parseFloat(textY) || 700,
      size: parseFloat(textSize) || 18,
      color: textColor,
    };
    setTextOverlays((prev) => [...prev, item]);
    setStatus(`Added text annotation to Page ${textPage}.`);
  };

  const addRectOverlay = () => {
    const item: RectOverlay = {
      id: `rect-${Date.now()}`,
      pageIndex: rectPage,
      x: parseFloat(rectX) || 50,
      y: parseFloat(rectY) || 600,
      width: parseFloat(rectW) || 200,
      height: parseFloat(rectH) || 50,
      color: rectColor,
    };
    setRectOverlays((prev) => [...prev, item]);
    setStatus(`Added rectangle overlay to Page ${rectPage}.`);
  };

  const exportEditedPDF = async () => {
    if (!buffer || !file || pages.length === 0) {
      setError("Please load a PDF document and ensure at least one page remains.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Generating edited PDF...");

    try {
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const font = await newDoc.embedFont(StandardFonts.Helvetica);

      for (let idx = 0; idx < pages.length; idx++) {
        const pageState = pages[idx];
        const [copiedPage] = await newDoc.copyPages(srcDoc, [pageState.originalIndex]);

        // Apply page rotation
        if (pageState.rotation !== 0) {
          const currentRot = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRot + pageState.rotation) % 360));
        }

        // Apply whiteout / rect overlays for this original page number
        const rectsForPage = rectOverlays.filter((r) => r.pageIndex === pageState.pageNumber);
        for (const rect of rectsForPage) {
          copiedPage.drawRectangle({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            color: hexToRgb(rect.color),
          });
        }

        // Apply text overlays for this original page number
        const textForPage = textOverlays.filter((t) => t.pageIndex === pageState.pageNumber);
        for (const txt of textForPage) {
          copiedPage.drawText(txt.text, {
            x: txt.x,
            y: txt.y,
            size: txt.size,
            font,
            color: hexToRgb(txt.color),
          });
        }

        newDoc.addPage(copiedPage);
      }

      const editedBytes = await newDoc.save();
      const outName = `${baseName(file.name)}-edited.pdf`;
      downloadBlob(new Blob([editedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus(`Exported edited PDF (${newDoc.getPageCount()} pages) successfully.`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving the edited PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <StatPill label="Pages" value={pages.length} />
            <StatPill label="Texts" value={textOverlays.length} />
            <StatPill label="Rects" value={rectOverlays.length} />
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("pages")}
              className={`flex-1 pb-2 text-xs font-semibold ${
                activeTab === "pages"
                  ? "border-b-2 border-hive-500 text-hive-600 dark:text-hive-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              Organize Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex-1 pb-2 text-xs font-semibold ${
                activeTab === "text"
                  ? "border-b-2 border-hive-500 text-hive-600 dark:text-hive-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              Add Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rect")}
              className={`flex-1 pb-2 text-xs font-semibold ${
                activeTab === "rect"
                  ? "border-b-2 border-hive-500 text-hive-600 dark:text-hive-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              Whiteout / Rect
            </button>
          </div>

          {activeTab === "pages" && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-slate-500">Page List & Structure</h3>
              {pages.length === 0 ? (
                <p className="text-xs text-slate-400">Upload a PDF to view and organize pages.</p>
              ) : (
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {pages.map((p, idx) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Page {p.pageNumber}
                        </span>
                        {p.rotation !== 0 && (
                          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Rotated {p.rotation}°
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => rotatePage(idx)}
                          className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Rotate +90°"
                        >
                          ↻
                        </button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePage(idx, -1)}
                          className="rounded px-1.5 py-0.5 text-xs text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === pages.length - 1}
                          onClick={() => movePage(idx, 1)}
                          className="rounded px-1.5 py-0.5 text-xs text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePage(idx)}
                          className="rounded px-1.5 py-0.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-3">
              <Field label="Target Page">
                <Select
                  value={textPage.toString()}
                  onChange={(v) => setTextPage(parseInt(v, 10))}
                  options={pages.map((p) => ({ value: p.pageNumber.toString(), label: `Page ${p.pageNumber}` }))}
                />
              </Field>
              <Field label="Text Content">
                <TextInput value={textValue} onChange={setTextValue} placeholder="Enter text..." />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="X (pt)">
                  <TextInput type="number" value={textX} onChange={setTextX} />
                </Field>
                <Field label="Y (pt)">
                  <TextInput type="number" value={textY} onChange={setTextY} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Font Size">
                  <TextInput type="number" value={textSize} onChange={setTextSize} />
                </Field>
                <Field label="Color">
                  <ColorInput value={textColor} onChange={setTextColor} />
                </Field>
              </div>
              <Btn onClick={addTextOverlay} disabled={!file} className="w-full !py-1.5 !text-xs">
                + Add Text Annotation
              </Btn>
            </div>
          )}

          {activeTab === "rect" && (
            <div className="space-y-3">
              <Field label="Target Page">
                <Select
                  value={rectPage.toString()}
                  onChange={(v) => setRectPage(parseInt(v, 10))}
                  options={pages.map((p) => ({ value: p.pageNumber.toString(), label: `Page ${p.pageNumber}` }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="X (pt)">
                  <TextInput type="number" value={rectX} onChange={setRectX} />
                </Field>
                <Field label="Y (pt)">
                  <TextInput type="number" value={rectY} onChange={setRectY} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Width (pt)">
                  <TextInput type="number" value={rectW} onChange={setRectW} />
                </Field>
                <Field label="Height (pt)">
                  <TextInput type="number" value={rectH} onChange={setRectH} />
                </Field>
              </div>
              <Field label="Fill Color">
                <ColorInput value={rectColor} onChange={setRectColor} />
              </Field>
              <Btn onClick={addRectOverlay} disabled={!file} className="w-full !py-1.5 !text-xs">
                + Add Whiteout / Rect
              </Btn>
            </div>
          )}

          <Btn onClick={exportEditedPDF} disabled={!file || pages.length === 0 || isProcessing} className="w-full">
            {isProcessing ? "Exporting..." : "Save & Export PDF"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">PDF Editor</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reorder, rotate, or delete pages, insert text annotations, and draw whiteout cover boxes on any page.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop PDF file here or click to browse"
        />

        {(textOverlays.length > 0 || rectOverlays.length > 0) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pending Annotations
            </h3>

            {textOverlays.length > 0 && (
              <div className="mb-3 space-y-1">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Text Items:</p>
                {textOverlays.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                  >
                    <span>
                      Page {t.pageIndex}: &quot;{t.text}&quot; at ({t.x}, {t.y})
                    </span>
                    <button
                      type="button"
                      onClick={() => setTextOverlays((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {rectOverlays.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Rectangle / Whiteouts:</p>
                {rectOverlays.map((r, idx) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                  >
                    <span>
                      Page {r.pageIndex}: {r.width}x{r.height} at ({r.x}, {r.y})
                    </span>
                    <button
                      type="button"
                      onClick={() => setRectOverlays((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
