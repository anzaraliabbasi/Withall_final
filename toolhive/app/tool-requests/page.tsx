import type { Metadata } from "next";
import ToolRequests from "@/components/api/ToolRequests";

export const metadata: Metadata = {
  title: "Request a Tool — ToolHive",
  description: "Vote for the next tool we build or request your own. The community decides what joins the hive.",
  alternates: { canonical: "/tool-requests" },
};

export default function ToolRequestsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tool requests 🐝</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Missing something? Request a new tool or upvote existing requests — the most wanted get built next.
        </p>
      </header>
      <ToolRequests />
    </div>
  );
}
