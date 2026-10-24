"use client";

import Link from "next/link";
import type { ToolEntry } from "@/lib/tools";

export default function ToolCard({ tool, icon }: { tool: ToolEntry; icon?: string }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex flex-col gap-2 p-5 transition hover:-translate-y-0.5 hover:border-hive-400 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hive-500/10 text-xl">
          {icon ?? "🔧"}
        </span>
        <span className="font-bold text-slate-800 group-hover:text-hive-600 dark:text-slate-100 dark:group-hover:text-hive-400">
          {tool.name}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{tool.shortDesc}</p>
    </Link>
  );
}
