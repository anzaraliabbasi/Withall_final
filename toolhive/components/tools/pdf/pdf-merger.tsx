"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, FileDrop, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface PDFItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  buffer: ArrayBuffer;
}

export default function PDFMerger() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    setError(null);
    setStatus(null);
    const pdfFiles = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }

    const newItems: PDFItem[] = [];

    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = doc.getPageCount();
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          buffer,
        });
      } catch (err) {
        console.error("Failed to parse PDF", err);
        setError(`Failed to read "${file.name}". It may be encrypted or corrupted.`);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (items.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);
    setStatus("Merging PDFs...");

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of items) {
        const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const indices = srcDoc.getPageIndices();
        const copiedPages = await mergedDoc.copyPages(srcDoc, indices);
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const firstBase = baseName(items[0].name);
      const outName = `${firstBase}-merged.pdf`;

      downloadBlob(new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus(`Successfully merged ${items.length} files (${mergedDoc.getPageCount()} pages total).`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = items.reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Total Files" value={items.length} />
            <StatPill label="Total Pages" value={totalPages} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">File Reordering</h3>
            {items.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload PDFs to organize and merge them into a single document.
              </p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.pageCount} page{item.pageCount > 1 ? "s" : ""} • {(item.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, -1)}
                        className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => moveItem(idx, 1)}
                        className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="ml-1 rounded px-1.5 py-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Btn onClick={mergePDFs} disabled={items.length < 2 || isMerging} className="w-full">
            {isMerging ? "Merging..." : `Merge ${items.length} PDF${items.length === 1 ? "" : "s"}`}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">PDF Merger</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Combine multiple PDF documents into a single PDF file entirely in your browser. Rearrange files in any sequence.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple
          onFiles={handleFiles}
          label="Drop PDF files here or click to select multiple"
        />
      </div>
    </ToolShell>
  );
}
