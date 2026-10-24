import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About ToolHive",
  description: "The story behind ToolHive — a free, private, browser-based toolbox of 117 online tools with no signups and no uploads.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} is a free all-in-one online toolbox — text, image, PDF, social media, security,
        coding, CSS and color utilities collected in one fast, clean website.
      </p>
      <p>
        Our core principle: <strong>your data stays yours.</strong> Every tool runs entirely inside
        your browser using modern web technology. Files you drop into {SITE_NAME} are never uploaded
        to a server — you can even load a tool and disconnect from the internet, and it keeps working.
      </p>
      <p>
        No accounts, no paywalls, no artificial limits. If a tool saves you time, share it with a friend.
      </p>
    </article>
  );
}
