"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, Btn, FileDrop } from "@/components/ui/kit";
import { downloadBlob } from "@/lib/download";

export default function InstagramPhotoDownloader() {
  const [imageUrl, setImageUrl] = useState(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E"
  );
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!imageUrl.trim()) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error("Unable to fetch image. Link may have expired or CORS policy blocked direct access.");
      const blob = await res.blob();
      downloadBlob(blob, `instagram-photo-${Date.now()}.jpg`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Download failed.";
      setError(msg + " Try right-clicking the preview and selecting 'Save Image As'.");
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setImageUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <ToolShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Instagram Photo Helper & Downloader
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Preview and save high-quality Instagram photo links directly.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 space-y-1.5">
          <p className="font-bold">💡 How to get a direct Instagram Image URL:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Open the Instagram post in your browser.</li>
            <li>Right-click the photo and select <strong>"Inspect"</strong> (or <strong>"Copy Image Address"</strong>).</li>
            <li>Paste the direct image link (starts with <code>https://instagram...</code> or <code>https://scontent...</code>) below.</li>
          </ol>
        </div>

        <Field label="Direct Image CDN URL">
          <TextInput
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="https://scontent.cdninstagram.com/v/..."
          />
        </Field>

        <Field label="Or Upload Local Photo to Preview/Save">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Drop photo file here" />
        </Field>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {imageUrl ? (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Image Preview
            </h3>

            <div className="flex justify-center items-center overflow-hidden rounded-xl bg-slate-100 p-2 dark:bg-slate-900">
              <img
                src={imageUrl}
                alt="Instagram Preview"
                className="max-h-[400px] w-auto rounded-lg object-contain shadow"
                onError={() =>  setError("Failed to load image preview. Please check the URL.")}
              />
            </div>

            <div className="flex gap-3">
              <Btn onClick={handleDownload} disabled={downloading} className="w-full">
                {downloading ? "Downloading..." : "Download Photo"}
              </Btn>
              <Btn variant="outline" onClick={() => window.open(imageUrl, "_blank")} className="!px-4">
                Open Original
              </Btn>
            </div>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
