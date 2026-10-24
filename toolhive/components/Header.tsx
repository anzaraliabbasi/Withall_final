"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, tools } from "@/lib/tools";

function HiveLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-hive-400 to-hive-600 text-slate-950 shadow-md">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 4.5L7.34 9.25v5.5L12 17.5l4.66-2.75v-5.5L12 6.5z" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
        Tool<span className="text-hive-700 dark:text-hive-400">Hive</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("th-theme", next ? "dark" : "light");
    setDark(next);
  };

  const hits = q.trim()
    ? tools
        .filter((t) => (t.name + " " + t.slug).toLowerCase().includes(q.trim().toLowerCase()))
        .slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#FAF9F6]/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <HiveLogo />

        <div ref={boxRef} className="relative mx-auto hidden w-full max-w-md sm:block">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search tools…"
            className="input-base !rounded-full !py-2 pl-10"
          />
          <svg className="pointer-events-none absolute left-3.5 top-2.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          {open && hits.length > 0 ? (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {hits.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="block px-4 py-2.5 text-sm hover:bg-hive-500/10"
                  onClick={() => { setOpen(false); setQ(""); }}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
          <div className="relative">
            <button type="button" className="rounded-lg px-3 py-2 hover:text-hive-600" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)} onFocus={() => setMenuOpen(true)}>
              Categories ▾
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                {categories.map((c) => (
                  <Link key={c.id} href={`/${c.url}`} className="block px-4 py-2 text-sm hover:bg-hive-500/10">
                    {c.icon} {c.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
          className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-slate-300 text-slate-500 transition hover:text-hive-500 dark:border-slate-700 dark:text-slate-400 lg:ml-0"
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
