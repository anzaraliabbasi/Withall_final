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
  ShareIcon,
  DotsIcon,
} from "./_post";

export default function ThreadsPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("Elena Rostova");
  const [handle, setHandle] = useState("elena_code");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [timeAgo, setTimeAgo] = useState("2h");

  const [postText, setPostText] = useState(
    "Threads clean aesthetic and fast text-first conversation feeds feel so refreshing. What is your favorite feature on Threads so far?"
  );
  const [mediaUrl, setMediaUrl] = useState("");

  const [replies, setReplies] = useState("48");
  const [likes, setLikes] = useState("320");
  const [reposts, setReposts] = useState("24");

  const [cardTheme, setCardTheme] = useState<"dark" | "light">("dark");

  const themeStyles = {
    dark: {
      bg: "#101010",
      text: "#f3f5f7",
      subtext: "#777777",
      border: "#262626",
    },
    light: {
      bg: "#ffffff",
      text: "#000000",
      subtext: "#999999",
      border: "#f0f0f0",
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
              Threads Post Mockup
            </h3>
            <Btn
              onClick={() => exportPng("threads-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable Threads Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl border p-5 shadow-2xl transition-all"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Top Threads Logo Accent */}
            <div className="flex justify-end pb-1 text-slate-500 font-bold text-lg">
              @
            </div>

            <div className="flex items-start gap-3">
              {/* Left Column: Avatar + Threads Line */}
              <div className="flex flex-col items-center">
                <Avatar src={avatarUrl} name={name} size={42} />
                <div className="mt-2 w-[2px] flex-1 rounded-full bg-slate-700/40 min-h-[40px]" />
              </div>

              {/* Right Column: Main Content */}
              <div className="flex-1 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <span>{handle}</span>
                    {isVerified && <VerifiedBadge type="blue" size={15} />}
                  </div>

                  <div className="flex items-center gap-2 text-xs" style={{ color: themeStyles.subtext }}>
                    <span>{timeAgo}</span>
                    <DotsIcon size={16} />
                  </div>
                </div>

                {/* Text Body */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {postText}
                </p>

                {/* Media Image */}
                {mediaUrl && (
                  <div className="mt-2 overflow-hidden rounded-2xl border" style={{ borderColor: themeStyles.border }}>
                    <img src={mediaUrl} alt="Threads Media" className="w-full max-h-80 object-cover"  loading="lazy" decoding="async" />
                  </div>
                )}

                {/* Action Icons */}
                <div className="flex items-center gap-4 pt-2" style={{ color: themeStyles.text }}>
                  <button type="button" className="hover:opacity-70"><HeartIcon size={20} /></button>
                  <button type="button" className="hover:opacity-70"><CommentIcon size={20} /></button>
                  <button type="button" className="hover:opacity-70"><RepostIcon size={20} /></button>
                  <button type="button" className="hover:opacity-70"><ShareIcon size={20} /></button>
                </div>

                {/* Stats Row */}
                <div className="pt-2 text-xs font-normal" style={{ color: themeStyles.subtext }}>
                  <span>{formatStat(replies)} replies</span>
                  <span className="mx-1.5">•</span>
                  <span>{formatStat(likes)} likes</span>
                  {reposts && (
                    <>
                      <span className="mx-1.5">•</span>
                      <span>{formatStat(reposts)} reposts</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Threads Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Display Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Username (@handle)">
            <TextInput value={handle} onChange={setHandle} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Verified Badge">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Check" />
          </Field>
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Avatar" />
        </Field>

        <Field label="Post Text">
          <TextArea value={postText} onChange={setPostText} rows={4} />
        </Field>

        <Field label="Attached Media Image">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Post Media" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Replies">
            <TextInput value={replies} onChange={setReplies} />
          </Field>
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
          <Field label="Reposts">
            <TextInput value={reposts} onChange={setReposts} />
          </Field>
        </div>

        <Field label="Theme">
          <Select
            value={cardTheme}
            onChange={(v) => setCardTheme(v as "dark" | "light")}
            options={[
              { value: "dark", label: "Dark Mode (#101010)" },
              { value: "light", label: "Light Mode (#FFFFFF)" },
            ]}
          />
        </Field>
      </div>
    </ToolShell>
  );
}
