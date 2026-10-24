import Link from "next/link";
import Trending from "@/components/api/Trending";
import ToolCard from "@/components/ToolCard";
import { categories, tools, toolsByCategory, SITE_NAME, SITE_DESC } from "@/lib/tools";

const catIcon: Record<string, string> = {
  text: "✍", image: "🖼", pdf: "📄", social: "💬", security: "🔐",
  coding: "⌨", css: "🎨", color: "🌈", misc: "✨",
};

const featured = [
  "qr-code-generator", "pdf-merger", "whatsapp-chat-generator", "case-converter",
  "image-resizer", "css-gradient-generator", "strong-random-password-generator",
  "instagram-post-generator", "json-tree-viewer", "tweet-generator", "css-box-shadow-generator",
  "pdf-compressor",
];

export default function HomePage() {
  const featuredTools = featured
    .map((s) => tools.find((t) => t.slug === s))
    .filter(Boolean) as typeof tools;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-hive-50 via-white to-hive-100 px-6 py-16 text-center dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:px-12">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Every online tool <span className="text-hive-500">in one hive</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          {SITE_DESC}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="#tools" className="btn-primary">Explore Tools →</Link>
          <Link href="/about" className="btn-outline">Learn more about ToolHive</Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
          <div><div className="text-3xl font-extrabold text-hive-600 dark:text-hive-400">{tools.length}+</div><div className="text-xs uppercase tracking-wide text-slate-500">Free tools</div></div>
          <div><div className="text-3xl font-extrabold text-hive-600 dark:text-hive-400">0</div><div className="text-xs uppercase tracking-wide text-slate-500">Uploads needed</div></div>
          <div><div className="text-3xl font-extrabold text-hive-600 dark:text-hive-400">∞</div><div className="text-xs uppercase tracking-wide text-slate-500">Usage</div></div>
        </div>
      </section>

      {/* Featured */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Featured Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="tools">
          {featuredTools.map((t) => (
            <ToolCard key={t.slug} tool={t} icon={catIcon[t.category]} />
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.map((c) => {
        const catTools = toolsByCategory(c.id);
        return (
          <section key={c.id} className="mt-14">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  <span className="text-hive-500">#</span> {c.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
              </div>
              <Link href={`/${c.url}`} className="shrink-0 text-sm font-semibold text-hive-700 hover:text-hive-600 dark:text-hive-400">
                See all ({catTools.length}) →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.slice(0, 6).map((t) => (
                <ToolCard key={t.slug} tool={t} icon={catIcon[t.category]} />
              ))}
            </div>
          </section>
        );
      })}
      <Trending />
    </>
  );
}
