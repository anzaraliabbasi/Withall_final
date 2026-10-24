"use client";
import { useState } from "react";
import { ToolShell, Field } from "@/components/ui/kit";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErr("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
          website: fd.get("website"), // honeypot
        }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || "Something went wrong"); setState("error"); return; }
      setState("sent");
    } catch { setErr("Network error"); setState("error"); }
  }

  if (state === "sent")
    return (
      <div className="card p-6 text-sm text-slate-600 dark:text-slate-300">
        <p className="text-lg font-bold text-hive-600 dark:text-hive-400">Message received 🐝</p>
        <p className="mt-2">Thanks! We read every message and usually reply within a few days.</p>
      </div>
    );

  return (
    <ToolShell>
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Your name (optional)"><input name="name" maxLength={100} placeholder="Anzar" className="input-base" /></Field>
        <Field label="Email"><input required name="email" type="email" maxLength={254} placeholder="you@example.com" className="input-base" /></Field>
        <Field label="Message"><textarea required name="message" rows={6} maxLength={5000} placeholder="Found a bug? Want a new tool? Tell us." className="input-base resize-y" /></Field>
        {/* honeypot — hidden from humans, bots fill it */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0" />
        {state === "error" && <p className="text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={state === "sending"} className="btn-primary">{state === "sending" ? "Sending…" : "Send message"}</button>
      </form>
    </ToolShell>
  );
}
