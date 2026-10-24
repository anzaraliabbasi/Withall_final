"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell, Field, Btn, TextArea, Select, Range, ColorInput } from "@/components/ui/kit";
import { downloadBlob } from "@/lib/download";

const FONTS = [
  { name: "Caveat", family: "'Caveat', cursive", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" },
  { name: "Homemade Apple", family: "'Homemade Apple', cursive", url: "https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap" },
  { name: "Liu Jian Mao Cao", family: "'Liu Jian Mao Cao', cursive", url: "https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap" },
];

export default function TextToHandwritingConverter() {
  const [text, setText] = useState(
    "Dear Friend,\n\nThank you for writing to me. Handwritten notes carry a warmth that digital text simply cannot replicate.\n\nWarm regards,\nAlex"
  );
  const [font, setFont] = useState(FONTS[0].name);
  const [fontSize, setFontSize] = useState(28);
  const [inkColor, setInkColor] = useState("#1e3a8a");
  const [paperStyle, setPaperStyle] = useState<"lined" | "grid" | "plain">("lined");
  const [paperColor, setPaperColor] = useState("#fefefe");
  const [margin, setMargin] = useState(40);
  const [fontLoaded, setFontLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    FONTS.forEach((f) => {
      const id = `font-link-${f.name.replace(/\s+/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = f.url;
        document.head.appendChild(link);
      }
    });

    if (document.fonts) {
      document.fonts.ready.then(() => setFontLoaded(true));
    } else {
      setFontLoaded(true);
    }
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const lineSpacing = Math.round(fontSize * 1.5);
    const lines = text.split("\n");

    // Estimate total height needed
    const minHeight = 1000;
    let totalLines = 0;
    ctx.font = `${fontSize}px ${FONTS.find((f) => f.name === font)?.family || "sans-serif"}`;

    const wrappedLines: string[] = [];
    const maxTextWidth = width - margin * 2;

    lines.forEach((line) => {
      if (!line) {
        wrappedLines.push("");
        return;
      }
      const words = line.split(" ");
      let currentLine = "";
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) wrappedLines.push(currentLine);
    });

    totalLines = wrappedLines.length;
    const contentHeight = margin * 2 + totalLines * lineSpacing + 100;
    const height = Math.max(minHeight, contentHeight);

    canvas.width = width;
    canvas.height = height;

    // Background paper
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, width, height);

    // Paper pattern
    if (paperStyle === "lined") {
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      const startY = margin + lineSpacing;
      for (let y = startY; y < height - margin; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(margin / 2, y);
        ctx.lineTo(width - margin / 2, y);
        ctx.stroke();
      }
      // Red left margin line
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin - 10, 0);
      ctx.lineTo(margin - 10, height);
      ctx.stroke();
    } else if (paperStyle === "grid") {
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw text
    const selectedFont = FONTS.find((f) => f.name === font);
    ctx.font = `${fontSize}px ${selectedFont?.family || "sans-serif"}`;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = "alphabetic";

    let currentY = margin + lineSpacing;
    wrappedLines.forEach((l) => {
      // slight natural variation
      const jitterY = (Math.random() - 0.5) * 0.8;
      ctx.fillText(l, margin, currentY + jitterY);
      currentY += lineSpacing;
    });
  }, [text, font, fontSize, inkColor, paperStyle, paperColor, margin]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, fontLoaded]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "handwritten-text.png");
    }, "image/png");
  };

  const downloadPDF = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("Export failed");
    const pngBytes = await blob.arrayBuffer();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const image = await pdfDoc.embedPng(pngBytes);
    
    // Scale image to fit page with margins
    const imgAspect = canvas.width / canvas.height;
    const pageAspect = 612 / 792;
    let drawW = 612 - 40;
    let drawH = drawW / imgAspect;

    if (drawH > 792 - 40) {
      drawH = 792 - 40;
      drawW = drawH * imgAspect;
    }

    const x = (612 - drawW) / 2;
    const y = 792 - drawH - 20;

    page.drawImage(image, { x, y, width: drawW, height: drawH });
    const pdfBytes = await pdfDoc.save();
    downloadBlob(new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" }), "handwritten-text.pdf");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Preview</h3>
            <div className="flex gap-2">
              <Btn onClick={downloadPNG} variant="outline" className="!px-3 !py-1 !text-xs">
                PNG
              </Btn>
              <Btn onClick={downloadPDF} variant="primary" className="!px-3 !py-1 !text-xs">
                PDF
              </Btn>
            </div>
          </div>
          <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900 max-h-[600px]">
            <canvas ref={canvasRef} className="mx-auto block shadow-md max-w-full h-auto" />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Your Text">
          <TextArea value={text} onChange={setText} rows={6} placeholder="Type your text here..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Font Style">
            <Select
              value={font}
              onChange={setFont}
              options={FONTS.map((f) => ({ value: f.name, label: f.name }))}
            />
          </Field>
          <Field label="Paper Style">
            <Select
              value={paperStyle}
              onChange={(v) => setPaperStyle(v as "lined" | "grid" | "plain")}
              options={[
                { value: "lined", label: "Lined Paper" },
                { value: "grid", label: "Grid / Graph" },
                { value: "plain", label: "Plain Paper" },
              ]}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ink Color">
            <ColorInput value={inkColor} onChange={setInkColor} />
          </Field>
          <Field label="Paper Background">
            <ColorInput value={paperColor} onChange={setPaperColor} />
          </Field>
        </div>

        <Field label={`Font Size: ${fontSize}px`}>
          <Range value={fontSize} onChange={setFontSize} min={16} max={48} suffix="px" />
        </Field>

        <Field label={`Margin: ${margin}px`}>
          <Range value={margin} onChange={setMargin} min={10} max={100} suffix="px" />
        </Field>
      </div>
    </ToolShell>
  );
}
