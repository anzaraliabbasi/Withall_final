"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, Btn } from "@/components/ui/kit";
import { downloadBlob } from "@/lib/download";

interface VimeoMetaData {
  title: string;
  author_name: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

export default function VimeoThumbnailGrabber() {
  const [urlInput, setUrlInput] = useState("https://vimeo.com/76979871");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<VimeoMetaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVimeoInfo = async () => {
    setError(null);
    setMeta(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Please enter a valid Vimeo URL.");
      return;
    }

    setLoading(true);
    try {
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(trimmed)}`;
      const res = await fetch(oembedUrl);
      if (!res.ok) {
        throw new Error("Could not fetch video info. Ensure the video is public and the URL is correct.");
      }
      const data = await res.json();
      if (!data.thumbnail_url) {
        throw new Error("No thumbnail found for this video.");
      }

      // Upgrade thumbnail quality if possible (e.g., replace _640 with _1280 or original)
      const highResThumb = data.thumbnail_url.replace(/_\d+x\d+/, "_1280");

      setMeta({
        title: data.title || "Vimeo Video",
        author_name: data.author_name || "Vimeo Creator",
        thumbnail_url: highResThumb,
        thumbnail_width: data.thumbnail_width || 1280,
        thumbnail_height: data.thumbnail_height || 720,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while fetching the thumbnail.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!meta) return;
    try {
      const res = await fetch(meta.thumbnail_url);
      const blob = await res.blob();
      downloadBlob(blob, `vimeo-thumbnail-${Date.now()}.jpg`);
    } catch {
      window.open(meta.thumbnail_url, "_blank");
    }
  };

  return (
    <ToolShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Vimeo Thumbnail Grabber
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Extract high-resolution thumbnail images from any public Vimeo video.
          </p>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Field label="Vimeo Video URL">
              <TextInput
                value={urlInput}
                onChange={setUrlInput}
                placeholder="e.g. https://vimeo.com/76979871"
              />
            </Field>
          </div>
          <Btn onClick={fetchVimeoInfo} disabled={loading} className="!py-2.5">
            {loading ? "Fetching..." : "Fetch Thumbnail"}
          </Btn>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {meta && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {meta.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By {meta.author_name}
              </p>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
              <img
                src={meta.thumbnail_url}
                alt={meta.title}
                className="h-full w-full object-cover"
                onError={(e) =>  {
                  // Fallback if high res replacement failed
                  if (meta && (e.target as HTMLImageElement).src !== meta.thumbnail_url) {
                    (e.target as HTMLImageElement).src = meta.thumbnail_url;
                  }
                }}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Btn onClick={handleDownload} className="w-full">
                Download High-Res Thumbnail
              </Btn>
              <Btn
                variant="outline"
                onClick={() => window.open(meta.thumbnail_url, "_blank")}
                className="!px-4"
              >
                Open Image
              </Btn>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
