import Link from "next/link";
import { categories, SITE_NAME } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-hive-400 to-hive-600 text-slate-950">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
              </svg>
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Tool<span className="text-hive-700 dark:text-hive-400">Hive</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-500 dark:text-slate-400">
            {SITE_NAME} is a free all-in-one online toolbox. 117 tools, zero uploads, zero sign-ups.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Categories</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/${c.url}`} className="text-slate-600 hover:text-hive-600 dark:text-slate-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">More</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.slice(5).map((c) => (
              <li key={c.id}>
                <Link href={`/${c.url}`} className="text-slate-600 hover:text-hive-600 dark:text-slate-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Site</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/about" className="text-slate-600 hover:text-hive-600 dark:text-slate-300">About</Link></li>
            <li><Link href="/privacy" className="text-slate-600 hover:text-hive-600 dark:text-slate-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-600 hover:text-hive-600 dark:text-slate-300">Terms of Use</Link></li>
            <li><Link href="/contact" className="text-slate-600 hover:text-hive-600 dark:text-slate-300">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-500 dark:text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} {SITE_NAME}. Made with care — all processing happens in your browser.
      </div>
    </footer>
  );
}
