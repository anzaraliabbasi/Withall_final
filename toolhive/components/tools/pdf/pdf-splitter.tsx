"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

type SplitMode = "ranges" | "everyN" | "single";

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<SplitMode>("ranges");

  const [rangesInput, setRangesInput] = useState<string>("1-2, 3");
  const [everyN, setEveryN] = useState<string>("1");
  const [singlePage, setSinglePage] = useState<string>("1");

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
      setPdfDoc(doc);
      setPageCount(count);
      setSinglePage("1");
      setRangesInput(count > 1 ? `1-${Math.min(2, count)}, ${Math.min(3, count)}` : "1");
      setStatus(`Loaded "${selected.name}" with ${count} page${count > 1 ? "s" : ""}.`);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF file. It may be encrypted or corrupted.");
    }
  };

  const parseRanges = (input: string, maxPages: number): number[][] => {
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    const groups: number[][] = [];

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          const rangePages: number[] = [];
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) {
              rangePages.push(i - 1); // 0-based
            }
          }
          if (rangePages.length > 0) groups.push(rangePages);
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          groups.push([pageNum - 1]);
        }
      }
    }
    return groups;
  };

  const splitPDF = async () => {
    if (!pdfDoc || !buffer || !file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Splitting PDF...");

    try {
      const name = baseName(file.name);

      if (mode === "ranges") {
        const pageGroups = parseRanges(rangesInput, pageCount);
        if (pageGroups.length === 0) {
          setError("Invalid page ranges specified.");
          setIsProcessing(false);
          return;
        }

        for (let idx = 0; idx < pageGroups.length; idx++) {
          const group = pageGroups[idx];
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(pdfDoc, group);
          copiedPages.forEach((p) => newDoc.addPage(p));
          const bytes = await newDoc.save();

          const rangeLabel = group.length === 1 ? `page_${group[0] + 1}` : `pages_${group[0] + 1}-${group[group.length - 1] + 1}`;
          downloadBlob(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), `${name}_${rangeLabel}.pdf`);
        }
        setStatus(`Created and downloaded ${pageGroups.length} split PDF file(s).`);
      } else if (mode === "everyN") {
        const n = parseInt(everyN, 10);
        if (isNaN(n) || n < 1) {
          setError("Please enter a valid page interval (at least 1).");
          setIsProcessing(false);
          return;
        }

        let fileCount = 0;
        for (let i = 0; i < pageCount; i += n) {
          const indices: number[] = [];
          for (let j = i; j < Math.min(i + n, pageCount); j++) {
            indices.push(j);
          }

          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(pdfDoc, indices);
          copiedPages.forEach((p) => newDoc.addPage(p));
          const bytes = await newDoc.save();

          fileCount++;
          const start = indices[0] + 1;
          const end = indices[indices.length - 1] + 1;
          const rangeLabel = start === end ? `page_${start}` : `pages_${start}-${end}`;
          downloadBlob(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), `${name}_part${fileCount}_${rangeLabel}.pdf`);
        }
        setStatus(`Split document into ${fileCount} file(s).`);
      } else if (mode === "single") {
        const targetPage = parseInt(singlePage, 10);
        if (isNaN(targetPage) || targetPage < 1 || targetPage > pageCount) {
          setError(`Please enter a page number between 1 and ${pageCount}.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const [copied] = await newDoc.copyPages(pdfDoc, [targetPage - 1]);
        newDoc.addPage(copied);
        const bytes = await newDoc.save();

        downloadBlob(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), `${name}_page_${targetPage}.pdf`);
        setStatus(`Extracted page ${targetPage} successfully.`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="File Name" value={file ? file.name : "None"} />
            <StatPill label="Total Pages" value={pageCount} />
          </div>

          <Field label="Split Method">
            <Select
              value={mode}
              onChange={(v) => setMode(v as SplitMode)}
              options={[
                { value: "ranges", label: "Custom Ranges (e.g. 1-2, 3-5)" },
                { value: "everyN", label: "Split Every N Pages" },
                { value: "single", label: "Extract Single Page" },
              ]}
            />
          </Field>

          {mode === "ranges" && (
            <Field label="Page Ranges" hint={`Enter comma-separated ranges or page numbers (1 to ${pageCount || "N"})`}>
              <TextInput
                value={rangesInput}
                onChange={setRangesInput}
                placeholder="e.g. 1-3, 4, 5-8"
              />
            </Field>
          )}

          {mode === "everyN" && (
            <Field label="Split Interval (Pages per PDF)" hint="Each output PDF will contain up to this many pages">
              <TextInput
                type="number"
                value={everyN}
                onChange={setEveryN}
                placeholder="1"
              />
            </Field>
          )}

          {mode === "single" && (
            <Field label="Page Number to Extract" hint={`Enter a page number between 1 and ${pageCount || "N"}`}>
              <TextInput
                type="number"
                value={singlePage}
                onChange={setSinglePage}
                placeholder="1"
              />
            </Field>
          )}

          <Btn onClick={splitPDF} disabled={!file || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Split PDF"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">PDF Splitter</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Extract specific page ranges, split by page intervals, or save individual pages as separate PDF files.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop a PDF file here or click to select"
        />
      </div>
    </ToolShell>
  );
}
