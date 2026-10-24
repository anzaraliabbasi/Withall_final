import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ToolHive privacy policy: your files never leave your browser. What we (don't) collect and why.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
      <p><strong>Short version: we never see your data.</strong></p>
      <p>
        {SITE_NAME} tools process all input — text, images, PDFs and settings — locally in your
        browser. Files are not uploaded to any server, and results exist only on your device until
        you download or delete them.
      </p>
      <p>
        We may use privacy-respecting, anonymous analytics to understand which tools are popular.
        No personally identifiable data is collected. Your theme preference (light/dark) is stored
        in your browser's local storage.
      </p>
      <p>Questions? Reach out via the contact page.</p>
    </article>
  );
}
