import type { Metadata } from "next";
import ContactForm from "@/components/api/ContactForm";

export const metadata: Metadata = {
  title: "Contact — ToolHive",
  description: "Found a bug or want a new tool? Send the ToolHive team a message.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Found a bug, want a new tool, or have a suggestion for the hive? We would love to hear from you.
        </p>
      </header>
      <ContactForm />
    </div>
  );
}
