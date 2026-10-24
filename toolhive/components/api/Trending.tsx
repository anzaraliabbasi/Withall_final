"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolUsage } from "@/lib/server/db";

export default function Trending() {
  const [tools, setTools] = useState<ToolUsage[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.topTools?.length) { setTools(d.topTools.slice(0, 6)); setTotal(d.totalToolUses || 0); } })
      .catch(() => {});
  }, []);
  if (!tools.length) return null;
  return (
    <section className="card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">🔥 Trending tools</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">{total.toLocaleString()} total uses</span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tools/${t.slug}`}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-hive-400 hover:text-hive-600 dark:border-slate-700 dark:text-slate-200 dark:hover:text-hive-400"
            >
              <span className="truncate">{t.name}</span>
              <span className="ml-2 shrink-0 text-xs text-slate-500 dark:text-slate-400">{t.uses.toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
