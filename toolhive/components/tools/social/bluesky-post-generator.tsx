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
import {
  Avatar,
  VerifiedBadge,
  formatStat,
  readImageAsDataUrl,
  HeartIcon,
  CommentIcon,
  RepostIcon,
  DotsIcon,
} from "./_post";

export default function BlueskyPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("Alice Skyline");
  const [handle, setHandle] = useState("alice.bsky.social");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [timeAgo, setTimeAgo] = useState("3h");

  const [postText, setPostText] = useState(
    "The open decentralized social web protocol AT Protocol is growing fast! Excited to see custom feeds and algorithmic transparency in action. 🦋 #bluesky #atproto"
  );
  const [mediaUrl, setMediaUrl] = useState("");

  const [replies, setReplies] = useState("84");
  const [reposts, setReposts] = useState("210");
  const [likes, setLikes] = useState("1420");
  const [quotes, setQuotes] = useState("32");

  const [cardTheme, setCardTheme] = useState<"dark" | "navy" | "light">("dark");

  const themeStyles = {
    dark: {
      bg: "#0b0f14",
      cardBg: "#161e27",
      text: "#f1f5f9",
      subtext: "#8b98a5",
      border: "#273444",
      blue: "#208bfe",
    },
    navy: {
      bg: "#101923",
      cardBg: "#1e293b",
      text: "#ffffff",
      subtext: "#94a3b8",
      border: "#334155",
      blue: "#208bfe",
    },
    light: {
      bg: "#f8fafc",
      cardBg: "#ffffff",
      text: "#0f172a",
      subtext: "#64748b",
      border: "#e2e8f0",
      blue: "#208bfe",
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
              Bluesky Post Mockup
            </h3>
            <Btn
              onClick={() => exportPng("bluesky-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable Bluesky Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl border p-5 shadow-2xl transition-all"
            style={{
              backgroundColor: themeStyles.cardBg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Header: Avatar, Name, Handle, Time, Butterfly Logo */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} name={name} size={44} />
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1 font-bold text-[15px]">
                    <span>{name}</span>
                    {isVerified && <VerifiedBadge type="blue" size={15} />}
                  </div>
                  <span className="text-xs" style={{ color: themeStyles.subtext }}>
                    @{handle.endsWith(".bsky.social") ? handle : `${handle}.bsky.social`}
                  </span>
                </div>
              </div>

              {/* Bluesky Butterfly Accent Icon */}
              <div className="flex items-center gap-2" style={{ color: themeStyles.blue }}>
                <svg width="24" height="24" viewBox="0 0 568 501" fill="currentColor">
                  <path d="M123.121 33.664c61.277 46.12 115.681 128.06 160.879 199.98 45.198-71.92 99.602-153.86 160.879-199.98C488.613-2.052 567.997-15.612 567.997 70.082c0 17.094-9.805 143.626-15.56 164.127-20.003 71.258-92.83 89.472-157.653 78.502 113.25 19.336 142.1 83.25 79.775 147.288-118.423 121.67-171.393-30.528-190.56-85.166-19.167 54.638-72.137 206.836-190.56 85.166-62.325-64.038-33.475-127.952 79.775-147.288-64.823 10.97-137.65-7.244-157.653-78.502C9.805 213.708 0 87.176 0 70.082c0-85.694 79.384-72.134 123.121-36.418z" />
                </svg>
                <span className="text-xs font-semibold" style={{ color: themeStyles.subtext }}>{timeAgo}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mt-3.5 text-sm leading-relaxed whitespace-pre-wrap">
              {postText.split(" ").map((word, idx) => {
                if (word.startsWith("#") || word.startsWith("@") || word.startsWith("http")) {
                  return (
                    <span key={idx} className="font-semibold" style={{ color: themeStyles.blue }}>
                      {word}{" "}
                    </span>
                  );
                }
                return word + " ";
              })}
            </div>

            {/* Attached Media */}
            {mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: themeStyles.border }}>
                <img src={mediaUrl} alt="BSKY Media" className="w-full max-h-80 object-cover"  loading="lazy" decoding="async" />
              </div>
            )}

            {/* Action Bar with Counts */}
            <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t font-semibold" style={{ color: themeStyles.subtext, borderColor: themeStyles.border }}>
              <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <CommentIcon size={18} />
                <span>{formatStat(replies)}</span>
              </button>

              <button type="button" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <RepostIcon size={18} />
                <span>{formatStat(reposts)}</span>
              </button>

              <button type="button" className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                <HeartIcon size={18} />
                <span>{formatStat(likes)}</span>
              </button>

              <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <DotsIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Bluesky Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Display Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Handle (@...)">
            <TextInput value={handle} onChange={setHandle} placeholder="user.bsky.social" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Verified Check">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Check" />
          </Field>
          <Field label="Time String">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Bluesky Avatar" />
        </Field>

        <Field label="Post Text">
          <TextArea value={postText} onChange={setPostText} rows={4} />
        </Field>

        <Field label="Attached Media Image">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Post Image" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Replies">
            <TextInput value={replies} onChange={setReplies} />
          </Field>
          <Field label="Reposts">
            <TextInput value={reposts} onChange={setReposts} />
          </Field>
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
        </div>

        <Field label="Theme">
          <Select
            value={cardTheme}
            onChange={(v) => setCardTheme(v as "dark" | "navy" | "light")}
            options={[
              { value: "dark", label: "Midnight Dark (#161e27)" },
              { value: "navy", label: "Navy Blue (#1e293b)" },
              { value: "light", label: "Clean Light (#ffffff)" },
            ]}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
