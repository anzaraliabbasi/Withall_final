import rawTools from "@/tool-names.json";

export interface ToolEntry {
  slug: string;
  name: string;
  category: string;
  seoTitle: string;
  shortDesc: string;
}

export interface Category {
  id: string;
  name: string;
  url: string;
  desc: string;
  icon: string;
}

import rawCategories from "@/lib/categories.json";

export const categories = rawCategories as Category[];
export const tools = rawTools as ToolEntry[];

export function getTool(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(catId: string): ToolEntry[] {
  return tools.filter((t) => t.category === catId);
}

export function getCategory(catId: string): Category | undefined {
  return categories.find((c) => c.id === catId);
}

export function categoryByUrl(url: string): Category | undefined {
  return categories.find((c) => c.url === url);
}

export const SITE_NAME = "ToolHive";
export const SITE_TAGLINE = "Every online tool in one hive";
export const SITE_DESC =
  "ToolHive is a free all-in-one toolbox: 117 fast online tools for text, images, PDFs, social media, code, CSS and colors. Everything runs in your browser — no uploads, no sign-up.";
