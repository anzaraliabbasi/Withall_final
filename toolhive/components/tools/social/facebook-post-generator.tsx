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

export default function FacebookPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("Tech Insights");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [timestamp, setTimestamp] = useState("2 hrs ago");
  const [privacy, setPrivacy] = useState<"public" | "friends" | "only_me">("public");

  const [postText, setPostText] = useState(
    "Exciting news! We just released our annual state of software engineering report. Over 10,000 developers participated across 45 countries. What is your favorite framework in 2026?"
  );
  const [mediaUrl, setMediaUrl] = useState("");

  const [reactionsCount, setReactionsCount] = useState("3.4K");
  const [commentsCount, setCommentsCount] = useState("420");
  const [sharesCount, setSharesCount] = useState("180");

  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");

  const themeStyles = {
    light: {
      bg: "#ffffff",
      text: "#050505",
      subtext: "#65670b",
      border: "#e4e6eb",
      buttonBg: "#f0f2f5",
      hoverBg: "#e4e6eb",
    },
    dark: {
      bg: "#242526",
      text: "#e4e6eb",
      subtext: "#b0b3b8",
      border: "#3e4042",
      buttonBg: "#3a3b3c",
      hoverBg: "#4e4f50",
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
              Facebook Post Mockup
            </h3>
            <Btn
              onClick={() => exportPng("facebook-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable FB Post Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl border shadow-xl transition-all p-4"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily:
                'Segoe UI, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} name={name} size={42} />
                <div>
                  <div className="flex items-center gap-1 font-bold text-[15px]">
                    <span>{name}</span>
                    {isVerified && <VerifiedBadge type="blue" size={15} />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{timestamp}</span>
                    <span>·</span>
                    {privacy === "public" && (
                      <span title="Public">🌐</span>
                    )}
                    {privacy === "friends" && (
                      <span title="Friends">👥</span>
                    )}
                    {privacy === "only_me" && (
                      <span title="Only me">🔒</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <DotsIcon size={20} />
                <button type="button" className="text-lg font-bold">✕</button>
              </div>
            </div>

            {/* Body Text */}
            <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {postText}
            </div>

            {/* Media Image */}
            {mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: themeStyles.border }}>
                <img src={mediaUrl} alt="FB Post Media" className="w-full max-h-96 object-cover"  loading="lazy" decoding="async" />
              </div>
            )}

            {/* Engagement Metrics Row */}
            <div className="mt-3 flex items-center justify-between pb-2 text-xs text-slate-500 border-b" style={{ borderColor: themeStyles.border }}>
              <div className="flex items-center gap-1">
                {/* Reaction Bubbles */}
                <div className="flex -space-x-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
                    👍
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    ❤️
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white text-[10px] font-bold">
                    😆
                  </span>
                </div>
                <span className="ml-1 font-medium">{formatStat(reactionsCount)}</span>
              </div>

              <div className="flex items-center gap-3 font-medium">
                <span>{formatStat(commentsCount)} Comments</span>
                <span>{formatStat(sharesCount)} Shares</span>
              </div>
            </div>

            {/* FB Action Bar */}
            <div className="mt-2 grid grid-cols-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 rounded-lg transition"
                style={{ color: themeStyles.text }}
              >
                <span>👍</span> Like
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 rounded-lg transition"
                style={{ color: themeStyles.text }}
              >
                <span>💬</span> Comment
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 rounded-lg transition"
                style={{ color: themeStyles.text }}
              >
                <span>↗️</span> Share
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Facebook Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Page / User Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Timestamp">
            <TextInput value={timestamp} onChange={setTimestamp} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Verified Blue Check">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Verified" />
          </Field>
          <Field label="Privacy Indicator">
            <Select
              value={privacy}
              onChange={(v) => setPrivacy(v as "public" | "friends" | "only_me")}
              options={[
                { value: "public", label: "Public (Globe 🌐)" },
                { value: "friends", label: "Friends (People 👥)" },
                { value: "only_me", label: "Only Me (Lock 🔒)" },
              ]}
            />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Page/User Avatar" />
        </Field>

        <Field label="Post Text">
          <TextArea value={postText} onChange={setPostText} rows={4} />
        </Field>

        <Field label="Post Media Image">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Post Image" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Reactions">
            <TextInput value={reactionsCount} onChange={setReactionsCount} />
          </Field>
          <Field label="Comments">
            <TextInput value={commentsCount} onChange={setCommentsCount} />
          </Field>
          <Field label="Shares">
            <TextInput value={sharesCount} onChange={setSharesCount} />
          </Field>
        </div>

        <Field label="Card Theme">
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
    </ToolShell>
  );
}
