"use client";
import { useEffect, useState } from "react";
import { ToolShell, Field } from "@/components/ui/kit";
import type { ToolRequest } from "@/lib/server/db";

export default function ToolRequests() {
  const [items, setItems] = useState<ToolRequest[] | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = () => fetch("/api/tool-requests").then((r) => r.json()).then((d) => setItems(d.requests || [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setMsg("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/tool-requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: fd.get("title"), description: fd.get("description"), website: fd.get("website") }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(d.error || "Something went wrong"); return; }
    setMsg("Request added!"); (e.target as HTMLFormElement).reset(); load();
  }

  async function upvote(id: number) {
    setItems((prev) => prev ? prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)) : prev);
    fetch(`/api/tool-requests/${id}/upvote`, { method: "POST" }).then(load).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <ToolShell>
        <form className="space-y-4" onSubmit={submit}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request a tool</h2>
          <Field label="What should it do?"><input required name="title" maxLength={120} placeholder="e.g. HEIC to JPG converter" className="input-base" /></Field>
          <Field label="Details (optional)"><textarea name="description" rows={3} maxLength={1000} className="input-base resize-y" /></Field>
          <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
          {msg && <p className="text-sm text-emerald-600">{msg}</p>}
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" className="btn-primary">Submit request</button>
        </form>
      </ToolShell>
      <section className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Most wanted ({items?.length ?? 0})</h2>
        {items === null ? (
          <p className="mt-3 text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No requests yet — be the first!</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {items.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-700">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{r.title}</p>
                  {r.description && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{r.description}</p>}
                </div>
                <button onClick={() => upvote(r.id)}
                  className="shrink-0 rounded-md border border-slate-200 px-3 py-1 text-sm font-bold text-hive-600 transition hover:border-hive-400 hover:bg-hive-50 dark:border-slate-700 dark:text-hive-400 dark:hover:bg-slate-800"
                  aria-label={`Upvote ${r.title}`}>▲ {r.votes}</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
