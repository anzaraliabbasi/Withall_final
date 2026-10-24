import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryByUrl, toolsByCategory, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

const catIcon: Record<string, string> = {
  text: "✍", image: "🖼", pdf: "📄", social: "💬", security: "🔐",
  coding: "⌨", css: "🎨", color: "🌈", misc: "✨",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.url }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryByUrl(category);
  if (!cat) return {};
  return {
    title: `${cat.name} — Free Online Tools`,
    description: cat.desc,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = categoryByUrl(category);
  if (!cat) notFound();
  const tools = toolsByCategory(cat.id);

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        <span className="text-hive-500">#</span> {cat.name}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} icon={catIcon[cat.id]} />
        ))}
      </div>
      <div className="mt-10 text-sm">
        <Link href="/" className="font-semibold text-hive-600 dark:text-hive-400">← All categories</Link>
      </div>
    </>
  );
}
