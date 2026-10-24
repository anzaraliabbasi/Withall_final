"use client";
import { useEffect } from "react";

/** Fire-and-forget usage ping when a tool page opens. Never blocks or breaks the tool. */
export default function TrackView({ slug, name, category }: { slug: string; name: string; category: string }) {
  useEffect(() => {
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, category }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* analytics must never break a tool */ }
  }, [slug, name, category]);
  return null;
}
