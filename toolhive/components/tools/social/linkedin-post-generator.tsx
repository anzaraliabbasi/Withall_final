"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  TextArea,
  Select,
  Toggle,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, VerifiedBadge, formatStat, readImageAsDataUrl, DotsIcon } from "./_post";

export default function LinkedinPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [authorName, setAuthorName] = useState("Marcus Vance");
  const [headline, setHeadline] = useState("VP of Engineering @ AI Labs | Ex-Google | Scaling Cloud Architectures");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [connectionBadge, setConnectionBadge] = useState("1st");
  const [timeAgo, setTimeAgo] = useState("2h • Edited • 🌐");

  const [isCompanyPage, setIsCompanyPage] = useState(false);
  const [companyFollowers, setCompanyFollowers] = useState("142,500 followers");

  const [postText, setPostText] = useState(
    "Leadership isn't about having all the answers. It's about asking the right questions and empowering your team to build extraordinary solutions.\n\n3 key lessons from scaling our dev team from 5 to 50 engineers:\n1. Over-communicate context\n2. Foster psychological safety\n3. Automate repetitive tasks\n\n#leadership #engineering #management #tech"
  );

  const [mediaUrl, setMediaUrl] = useState("");

  const [reactionsCount, setReactionsCount] = useState("1850");
  const [commentsCount, setCommentsCount] = useState("142");
  const [repostsCount, setRepostsCount] = useState("88");

  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");

  const themeStyles = {
    light: {
      bg: "#ffffff",
      text: "#000000",
      subtext: "#666666",
      border: "#e0e0e0",
      accent: "#0a66c2",
      hover: "#f3f2ef",
    },
    dark: {
      bg: "#1d2226",
      text: "#ffffff",
      subtext: "#a0a0a0",
      border: "#383b3d",
      accent: "#70b5f9",
      hover: "#282d31",
    },
  }[cardTheme];

  const handleAvatarUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setAvatarUrl(url);
    }
  };

  const handleMediaUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setMediaUrl(url);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              LinkedIn Post Mockup
            </h3>
            <Btn
              onClick={() => exportPng("linkedin-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable LinkedIn Post Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl border p-4 shadow-xl transition-all"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar
                  src={avatarUrl}
                  name={authorName}
                  size={48}
                  shape={isCompanyPage ? "square" : "circle"}
                />
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1 font-bold text-[15px]">
                    <span>{authorName}</span>
                    {isCompanyPage ? (
                      <VerifiedBadge type="linkedin" size={15} />
                    ) : (
                      <span className="text-xs font-normal text-slate-500">
                        • {connectionBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs line-clamp-1" style={{ color: themeStyles.subtext }}>
                    {isCompanyPage ? companyFollowers : headline}
                  </span>
                  <span className="text-[11px] mt-0.5" style={{ color: themeStyles.subtext }}>
                    {timeAgo}
                  </span>
                </div>
              </div>
              <DotsIcon size={20} color={themeStyles.subtext} />
            </div>

            {/* Post Content */}
            <div className="mt-3 text-xs leading-relaxed whitespace-pre-wrap">
              {postText.split(" ").map((word, idx) => {
                if (word.startsWith("#")) {
                  return (
                    <span key={idx} className="font-semibold" style={{ color: themeStyles.accent }}>
                      {word}{" "}
                    </span>
                  );
                }
                return word + " ";
              })}
            </div>

            {/* Media Image */}
            {mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: themeStyles.border }}>
                <img src={mediaUrl} alt="LinkedIn Post Media" className="w-full max-h-96 object-cover"  loading="lazy" decoding="async" />
              </div>
            )}

            {/* Reaction Metrics Bar */}
            <div className="mt-3 flex items-center justify-between pb-2 text-[11px] border-b" style={{ color: themeStyles.subtext, borderColor: themeStyles.border }}>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[9px]">👍</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px]">👏</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white text-[9px]">❤️</span>
                </div>
                <span className="ml-1 font-medium">{formatStat(reactionsCount)}</span>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span>{formatStat(commentsCount)} comments</span>
                <span>•</span>
                <span>{formatStat(repostsCount)} reposts</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="mt-2 grid grid-cols-4 text-center text-xs font-semibold" style={{ color: themeStyles.subtext }}>
              <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>👍</span> Like
              </button>
              <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>💬</span> Comment
              </button>
              <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>🔁</span> Repost
              </button>
              <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>↗️</span> Send
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          LinkedIn Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Author Name">
            <TextInput value={authorName} onChange={setAuthorName} />
          </Field>
          <Field label="Company Page Mode">
            <Toggle checked={isCompanyPage} onChange={setIsCompanyPage} label="Page Mode" />
          </Field>
        </div>

        {isCompanyPage ? (
          <Field label="Company Followers String">
            <TextInput value={companyFollowers} onChange={setCompanyFollowers} />
          </Field>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Professional Headline">
              <TextInput value={headline} onChange={setHeadline} />
            </Field>
            <Field label="Connection Degree">
              <Select
                value={connectionBadge}
                onChange={setConnectionBadge}
                options={[
                  { value: "1st", label: "1st degree" },
                  { value: "2nd", label: "2nd degree" },
                  { value: "3rd+", label: "3rd+ degree" },
                ]}
              />
            </Field>
          </div>
        )}

        <Field label="Avatar / Logo Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Profile or Company Logo" />
        </Field>

        <Field label="Post Text">
          <TextArea value={postText} onChange={setPostText} rows={4} />
        </Field>

        <Field label="Attached Image Media">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Post Media Image" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Reactions">
            <TextInput value={reactionsCount} onChange={setReactionsCount} />
          </Field>
          <Field label="Comments">
            <TextInput value={commentsCount} onChange={setCommentsCount} />
          </Field>
          <Field label="Reposts">
            <TextInput value={repostsCount} onChange={setRepostsCount} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time String">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
          <Field label="Theme">
            <Select
              value={cardTheme}
              onChange={(v) => setCardTheme(v as "light" | "dark")}
              options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
              ]}
            />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
