"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, FileDrop, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setStatus(null);
    setCompressedSize(null);
    setCompressedBytes(null);

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
      setOriginalSize(selected.size);
      setPageCount(count);
      setStatus(`Loaded "${selected.name}" (${(selected.size / 1024).toFixed(1)} KB, ${count} pages).`);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF file. It may be encrypted or corrupted.");
    }
  };

  const compressPDF = async () => {
    if (!buffer || !file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsCompressing(true);
    setError(null);
    setStatus("Optimizing PDF document streams and metadata...");

    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip metadata for privacy & file size reduction
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");

      // Save using object streams compression
      const output = await doc.save({ useObjectStreams: true });

      setCompressedBytes(output);
      setCompressedSize(output.length);

      const savedKb = (originalSize - output.length) / 1024;
      const pct = originalSize > 0 ? (((originalSize - output.length) / originalSize) * 100).toFixed(1) : "0";

      if (savedKb > 0) {
        setStatus(`Optimization complete! Reduced size by ${savedKb.toFixed(1)} KB (${pct}%).`);
      } else {
        setStatus("Optimization complete! Document was already highly optimized.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during compression.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    const name = `${baseName(file.name)}-compressed.pdf`;
    downloadBlob(new Blob([compressedBytes as unknown as BlobPart], { type: "application/pdf" }), name);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const reductionPct =
    originalSize && compressedSize !== null
      ? originalSize > compressedSize
        ? `${(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%`
        : "0%"
      : "0%";

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <StatPill label="Original" value={originalSize ? formatSize(originalSize) : "0 KB"} />
            <StatPill label="Optimized" value={compressedSize !== null ? formatSize(compressedSize) : "—"} />
            <StatPill label="Savings" value={reductionPct} />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <span className="font-semibold">Note on Lossless Structural Optimization:</span>
            <p className="mt-1 leading-relaxed text-[11px] opacity-90">
              This tool compresses PDF object streams, reorganizes file structures, and strips unnecessary document metadata client-side.
              Raster images inside the PDF are preserved at original quality.
            </p>
          </div>

          {!compressedBytes ? (
            <Btn onClick={compressPDF} disabled={!file || isCompressing} className="w-full">
              {isCompressing ? "Compressing..." : "Compress PDF"}
            </Btn>
          ) : (
            <Btn onClick={handleDownload} className="w-full">
              Download Compressed PDF
            </Btn>
          )}

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">PDF Compressor</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reduce PDF file sizes by compressing internal data streams and removing unused metadata without quality loss.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop a PDF file here or click to select"
        />

        {file && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-700 dark:text-slate-300">File Selected: {file.name}</p>
            <p className="text-slate-500 dark:text-slate-400">Total Pages: {pageCount}</p>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
