import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool, getCategory, SITE_NAME } from "@/lib/tools";
import { toolIntro, toolHowTo, toolFaqs } from "@/lib/content";
import ToolRenderer from "@/components/tools/ToolRenderer";
import ToolCard from "@/components/ToolCard";
import TrackView from "@/components/api/TrackView";

export const dynamicParams = true;

export function generateStaticParams() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { tools } = require("@/lib/tools");
  return tools.map((t: { slug: string }) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.seoTitle,
    description: `${tool.shortDesc} Free, unlimited and private — runs 100% in your browser.`,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const category2 = getCategory(tool.category);
  const category = getCategory(tool.category);
  const faqs = toolFaqs(tool);
  const related = category ? require("@/lib/tools").toolsByCategory(tool.category).filter((t: { slug: string }) => t.slug !== tool.slug).slice(0, 3) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://toolhive.example.com/` },
          { "@type": "ListItem", position: 2, name: category ? category.name : "Tools", item: `https://toolhive.example.com/${category ? category.url : ""}` },
          { "@type": "ListItem", position: 3, name: tool.name },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: tool.shortDesc,
        url: `https://toolhive.example.com/tools/${tool.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/" className="hover:text-hive-600">{SITE_NAME}</Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/${category.url}`} className="hover:text-hive-600">{category.name}</Link>
          </>
        ) : null}
        {" / "}
        <span className="text-slate-500 dark:text-slate-300">{tool.name}</span>
      </nav>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {tool.name}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{tool.shortDesc}</p>

      {/* The interactive tool */}
      <section className="mt-6">
        <TrackView slug={tool.slug} name={tool.name} category={tool.category} />
        <ToolRenderer slug={tool.slug} />
      </section>

      {/* SEO content */}
      <article className="mt-12 max-w-3xl space-y-10 text-sm leading-7 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">What is Online {tool.name}?</h2>
          <p className="mt-3">{toolIntro(tool)}</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to use Online {tool.name}?</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {toolHowTo(tool).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
          <div className="mt-3 space-y-5">
            {faqs.map((f, i) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{f.q}</h3>
                <p className="mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((t: any) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
