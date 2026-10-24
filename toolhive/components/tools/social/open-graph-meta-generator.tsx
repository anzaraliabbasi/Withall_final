"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  TextArea,
  Select,
  CodeBox,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { readImageAsDataUrl } from "./_post";

export default function OpenGraphMetaGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [title, setTitle] = useState("ToolHive — 100+ Free Developer Utilities & Generators");
  const [description, setDescription] = useState(
    "Instant client-side tools for web developers, designers, and social media creators. No signup required."
  );
  const [siteName, setSiteName] = useState("ToolHive");
  const [url, setUrl] = useState("https://toolhive.dev");
  const [imageUrl, setImageUrl] = useState("");
  const [twitterCardType, setTwitterCardType] = useState<"summary_large_image" | "summary">("summary_large_image");

  const [platformPreview, setPlatformPreview] = useState<"twitter" | "facebook" | "linkedin" | "discord" | "imessage">("twitter");

  const handleImageUpload = async (files: File[]) => {
    if (files[0]) {
      const src = await readImageAsDataUrl(files[0]);
      setImageUrl(src);
    }
  };

  const getDomain = (rawUrl: string) => {
    try {
      const u = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
      return u.hostname;
    } catch {
      return "example.com";
    }
  };

  const domain = getDomain(url);

  // HTML Meta Tags snippet
  const metaTagsCode = `<!-- Open Graph Meta Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : '<!-- <meta property="og:image" content="https://example.com/og.png" /> -->'}

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="${twitterCardType}" />
<meta property="twitter:domain" content="${domain}" />
<meta property="twitter:url" content="${url}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : '<!-- <meta name="twitter:image" content="https://example.com/og.png" /> -->'}`;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Link Preview Card
            </h3>
            <Btn
              onClick={() => exportPng("og-link-preview.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          <Field label="Preview Platform Preset">
            <Select
              value={platformPreview}
              onChange={(v) =>
                setPlatformPreview(
                  v as "twitter" | "facebook" | "linkedin" | "discord" | "imessage"
                )
              }
              options={[
                { value: "twitter", label: "Twitter / X Card" },
                { value: "facebook", label: "Facebook Link Card" },
                { value: "linkedin", label: "LinkedIn Post Card" },
                { value: "discord", label: "Discord Embed" },
                { value: "imessage", label: "iMessage Bubble Preview" },
              ]}
            />
          </Field>

          {/* Exportable Preview Container */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl p-4 transition-all"
            style={{
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Platform 1: Twitter / X Card */}
            {platformPreview === "twitter" && (
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#000000] text-slate-100 shadow-xl">
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="OG Media" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                  ) : (
                    <div className="p-6 text-center text-white font-extrabold text-xl">
                      {title}
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">{domain}</div>
                  <div className="text-sm font-bold truncate">{title}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">{description}</div>
                </div>
              </div>
            )}

            {/* Platform 2: Facebook Card */}
            {platformPreview === "facebook" && (
              <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#242526] text-slate-100 shadow-xl">
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="OG Media" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                  ) : (
                    <div className="p-6 text-center text-white font-extrabold text-xl">
                      {title}
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1 bg-[#3a3b3c]/50">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {domain}
                  </div>
                  <div className="text-sm font-bold">{title}</div>
                  <div className="text-xs text-slate-300 line-clamp-2">{description}</div>
                </div>
              </div>
            )}

            {/* Platform 3: LinkedIn Card */}
            {platformPreview === "linkedin" && (
              <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#1d2226] text-white shadow-xl">
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-gradient-to-r from-blue-700 to-sky-600 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="OG Media" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                  ) : (
                    <div className="p-6 text-center text-white font-extrabold text-xl">
                      {title}
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-1 border-t border-slate-700">
                  <div className="text-sm font-bold line-clamp-1">{title}</div>
                  <div className="text-xs text-slate-400">{domain}</div>
                </div>
              </div>
            )}

            {/* Platform 4: Discord Embed */}
            {platformPreview === "discord" && (
              <div className="flex rounded-lg border-l-4 border-l-sky-500 border-y border-r border-slate-700 bg-[#2b2d31] p-4 text-slate-200 shadow-xl">
                <div className="space-y-1.5 flex-1 pr-3">
                  <div className="text-xs font-semibold text-sky-400">{siteName}</div>
                  <div className="text-sm font-bold text-sky-300 underline">{title}</div>
                  <div className="text-xs text-slate-300 line-clamp-3">{description}</div>
                  {imageUrl && (
                    <div className="mt-3 aspect-[1.91/1] max-w-sm overflow-hidden rounded-lg">
                      <img src={imageUrl} alt="Discord Embed" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Platform 5: iMessage Card */}
            {platformPreview === "imessage" && (
              <div className="mx-auto max-w-xs overflow-hidden rounded-3xl bg-[#007aff] p-1 text-white shadow-xl">
                <div className="overflow-hidden rounded-[1.25rem] bg-white text-slate-900">
                  <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img src={imageUrl} alt="iMessage preview" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-tr from-sky-500 to-indigo-500 font-extrabold text-white">
                        🌐 {domain}
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-[11px] uppercase font-bold text-slate-400">{domain}</div>
                    <div className="text-xs font-bold leading-tight line-clamp-2">{title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <CodeBox code={metaTagsCode} language="html" />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Open Graph & Meta Tag Builder
        </h2>

        <Field label="Page Title (og:title)">
          <TextInput value={title} onChange={setTitle} placeholder="Page Title" />
        </Field>

        <Field label="Page Description (og:description)">
          <TextArea value={description} onChange={setDescription} rows={3} placeholder="Brief summary of your webpage..." />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Site Name (og:site_name)">
            <TextInput value={siteName} onChange={setSiteName} placeholder="My Website" />
          </Field>
          <Field label="Target URL (og:url)">
            <TextInput value={url} onChange={setUrl} placeholder="https://mywebsite.com" />
          </Field>
        </div>

        <Field label="Open Graph Image (og:image)">
          <FileDrop accept="image/*" onFiles={handleImageUpload} label="Upload Preview Image (1200 x 630 recommended)" />
        </Field>

        <Field label="Twitter Card Format">
          <Select
            value={twitterCardType}
            onChange={(v) => setTwitterCardType(v as "summary_large_image" | "summary")}
            options={[
              { value: "summary_large_image", label: "Large Image Summary (summary_large_image)" },
              { value: "summary", label: "Small Thumbnail Summary (summary)" },
            ]}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
