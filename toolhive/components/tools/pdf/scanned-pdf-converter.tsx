"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, FileDrop, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

export default function ScannedPDFConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

  const [pageCount, setPageCount] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaAuthor, setMetaAuthor] = useState<string>("");
  const [metaProducer, setMetaProducer] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState(false);
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
      setPageCount(count);
      setOriginalSize(selected.size);

      setMetaTitle(doc.getTitle() || "None");
      setMetaAuthor(doc.getAuthor() || "None");
      setMetaProducer(doc.getProducer() || "None");

      setStatus(`Loaded scanned PDF document (${(selected.size / 1024).toFixed(1)} KB, ${count} pages).`);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF document.");
    }
  };

  const optimizeScannedPDF = async () => {
    if (!buffer || !file) {
      setError("Please upload a scanned PDF first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Optimizing scanned PDF stream compression & stripping metadata...");

    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip metadata for privacy & cleaner files
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
      if (savedKb > 0) {
        setStatus(`Optimization complete! Saved ${savedKb.toFixed(1)} KB.`);
      } else {
        setStatus("Optimization complete! Document stream structures normalized.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to optimize PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    const outName = `${baseName(file.name)}-optimized-scan.pdf`;
    downloadBlob(new Blob([compressedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Original Size" value={originalSize ? formatSize(originalSize) : "0 KB"} />
            <StatPill label="Optimized Size" value={compressedSize !== null ? formatSize(compressedSize) : "—"} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Document Metadata Overview</h3>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Title:</span> {metaTitle}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Author:</span> {metaAuthor}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Producer:</span> {metaProducer}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Total Pages:</span> {pageCount}</p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
            <span className="font-semibold">Client-Side Scanned PDF Optimizer:</span>
            <p className="mt-1 leading-relaxed text-[11px] opacity-90">
              This tool optimizes scanned PDF files client-side by compressing object streams, removing redundant scanner metadata, and reorganizing page structures. (Note: Full raster-to-vector OCR conversion requires server-side processing).
            </p>
          </div>

          {!compressedBytes ? (
            <Btn onClick={optimizeScannedPDF} disabled={!file || isProcessing} className="w-full">
              {isProcessing ? "Optimizing..." : "Optimize Scanned PDF"}
            </Btn>
          ) : (
            <Btn onClick={handleDownload} className="w-full">
              Download Optimized PDF
            </Btn>
          )}

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Scanned PDF Converter & Optimizer</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clean up, strip scanner metadata, and optimize storage streams for scanned document PDFs in your browser.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop scanned PDF file here or click to browse"
        />
      </div>
    </ToolShell>
  );
}
