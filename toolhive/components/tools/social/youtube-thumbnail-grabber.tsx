"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, Btn } from "@/components/ui/kit";
import { downloadBlob } from "@/lib/download";

export default function YoutubeThumbnailGrabber() {
  const [urlInput, setUrlInput] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [downloading, setDownloading] = useState<string | null>(null);

  // Extract YouTube video ID
  const extractVideoId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    // If it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/shorts/ID
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : "";
  };

  const videoId = extractVideoId(urlInput);

  const qualities = [
    { label: "Maximum Resolution", resolution: "1280 x 720", file: "maxresdefault.jpg" },
    { label: "High Quality (HQ)", resolution: "480 x 360", file: "hqdefault.jpg" },
    { label: "Medium Quality (MQ)", resolution: "320 x 180", file: "mqdefault.jpg" },
    { label: "Standard Quality (SD)", resolution: "640 x 480", file: "sddefault.jpg" },
  ];

  const handleDownload = async (fileName: string, qualityLabel: string) => {
    if (!videoId) return;
    const imageUrl = `https://i.ytimg.com/vi/${videoId}/${fileName}`;
    setDownloading(fileName);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      downloadBlob(blob, `youtube-thumbnail-${videoId}-${fileName}`);
    } catch {
      // Fallback: open image in new tab if direct fetch is blocked
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <ToolShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            YouTube Thumbnail Grabber
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Extract and download full HD thumbnails from any YouTube video or Short.
          </p>
        </div>

        <Field label="YouTube Video URL or Video ID">
          <TextInput
            value={urlInput}
            onChange={setUrlInput}
            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
          />
        </Field>

        {videoId ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Extracted Video ID:
              </span>
              <span className="ml-2 font-mono text-sm font-bold text-hive-600 dark:text-hive-400">
                {videoId}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {qualities.map((q) => {
                const imgUrl = `https://i.ytimg.com/vi/${videoId}/${q.file}`;
                return (
                  <div
                    key={q.file}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {q.label}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {q.resolution}
                        </span>
                      </div>

                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                        <img
                          src={imgUrl}
                          alt={q.label}
                          className="h-full w-full object-cover"
                          onError={(e) =>  {
                            // If maxres fails, fallback image display
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Btn
                        onClick={() => handleDownload(q.file, q.label)}
                        disabled={downloading === q.file}
                        className="w-full !text-xs !py-2"
                      >
                        {downloading === q.file ? "Downloading..." : "Download Image"}
                      </Btn>
                      <Btn
                        variant="outline"
                        onClick={() => window.open(imgUrl, "_blank")}
                        className="!text-xs !py-2 !px-3"
                      >
                        Open
                      </Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Paste a valid YouTube link or ID above to extract thumbnails.
            </p>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
