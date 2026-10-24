"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

export default function SignPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [targetPage, setTargetPage] = useState<string>("1");
  const [sigX, setSigX] = useState<string>("100");
  const [sigY, setSigY] = useState<string>("150");
  const [sigWidth, setSigWidth] = useState<string>("150");

  const [penColor, setPenColor] = useState<string>("#0f172a");
  const [penWidth, setPenWidth] = useState<number>(2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize signature canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

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
      setStatus(`Loaded "${selected.name}" with ${count} page${count > 1 ? "s" : ""}.`);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF file.");
    }
  };

  const signPDF = async () => {
    const canvas = canvasRef.current;
    if (!buffer || !file || !canvas || !hasSignature) {
      setError("Please load a PDF and draw a signature first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Embedding signature into PDF...");

    try {
      // Export signature canvas to PNG arrayBuffer
      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch(dataUrl);
      const pngBuffer = await res.arrayBuffer();

      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pngImage = await pdfDoc.embedPng(pngBuffer);

      const pNum = parseInt(targetPage, 10);
      if (isNaN(pNum) || pNum < 1 || pNum > pdfDoc.getPageCount()) {
        setError("Invalid page number selected.");
        setIsProcessing(false);
        return;
      }

      const page = pdfDoc.getPage(pNum - 1);
      const requestedWidth = parseFloat(sigWidth) || 150;
      const dims = pngImage.scaleToFit(requestedWidth, requestedWidth);

      const x = parseFloat(sigX) || 100;
      const y = parseFloat(sigY) || 150;

      page.drawImage(pngImage, {
        x,
        y,
        width: dims.width,
        height: dims.height,
      });

      const signedBytes = await pdfDoc.save();
      const outName = `${baseName(file.name)}-signed.pdf`;
      downloadBlob(new Blob([signedBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus(`Successfully signed page ${pNum} and saved PDF.`);
    } catch (err) {
      console.error(err);
      setError("Failed to embed signature into PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Total Pages" value={pageCount} />
            <StatPill label="Signature" value={hasSignature ? "Ready" : "Empty"} />
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-slate-500">Draw Signature</h3>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="relative rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <canvas
                ref={canvasRef}
                width={360}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full touch-none cursor-crosshair rounded bg-white dark:bg-slate-900"
              />
              {!hasSignature && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  Draw signature here with mouse or touch
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Ink Color">
                <Select
                  value={penColor}
                  onChange={setPenColor}
                  options={[
                    { value: "#0f172a", label: "Dark Slate / Black" },
                    { value: "#1e40af", label: "Navy Blue" },
                    { value: "#991b1b", label: "Dark Red" },
                  ]}
                />
              </Field>
              <Field label="Stroke Thickness">
                <Select
                  value={penWidth.toString()}
                  onChange={(v) => setPenWidth(parseInt(v, 10))}
                  options={[
                    { value: "1", label: "Fine (1px)" },
                    { value: "2", label: "Medium (2px)" },
                    { value: "3", label: "Thick (3px)" },
                  ]}
                />
              </Field>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xs font-semibold uppercase text-slate-500">Placement Settings</h3>

            <Field label="Target Page">
              <Select
                value={targetPage}
                onChange={setTargetPage}
                options={Array.from({ length: pageCount }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `Page ${i + 1}`,
                }))}
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="X (pt)">
                <TextInput type="number" value={sigX} onChange={setSigX} />
              </Field>
              <Field label="Y (pt)">
                <TextInput type="number" value={sigY} onChange={setSigY} />
              </Field>
              <Field label="Width (pt)">
                <TextInput type="number" value={sigWidth} onChange={setSigWidth} />
              </Field>
            </div>
          </div>

          <Btn onClick={signPDF} disabled={!file || !hasSignature || isProcessing} className="w-full">
            {isProcessing ? "Signing..." : "Sign PDF & Download"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sign PDF</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Draw your handwritten signature, position it onto any page of your PDF document, and save the signed copy.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop PDF file here or click to browse"
        />
      </div>
    </ToolShell>
  );
}
