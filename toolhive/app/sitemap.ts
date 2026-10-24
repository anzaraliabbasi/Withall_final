import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

const BASE = "https://gettoolhive.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, priority: 1 },
    ...categories.map((c) => ({ url: `${BASE}/${c.url}`, lastModified: now, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${BASE}/tools/${t.slug}`, lastModified: now, priority: 0.7 })),
    { url: `${BASE}/about`, lastModified: now, priority: 0.3 },
    { url: `${BASE}/tool-requests`, lastModified: now, priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, priority: 0.2 },
  ];
}
