import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using ToolHive's free online tools. Fair use, no warranty, tools provided as-is.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Use</h1>
      <p>
        {SITE_NAME} is provided free of charge, "as is", without warranty of any kind. Tools that
        generate social media mockups are intended for parody, education, illustration and design
        purposes only. Do not use them to impersonate real people, deceive others, or commit fraud.
      </p>
      <p>
        You keep full rights to anything you create with these tools. Do not use the service to
        process content you do not have the rights to.
      </p>
      <p>Use responsibly, and the hive stays sweet for everyone.</p>
    </article>
  );
}
