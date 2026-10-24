"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  TextArea,
  Select,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, formatStat, readImageAsDataUrl, CommentIcon, ShareIcon, DotsIcon } from "./_post";

export default function RedditPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [subreddit, setSubreddit] = useState("r/nextjs");
  const [author, setAuthor] = useState("u/frontend_wiz");
  const [timeAgo, setTimeAgo] = useState("4 hours ago");
  const [iconUrl, setIconUrl] = useState("");

  const [flairText, setFlairText] = useState("Showcase");
  const [flairColor, setFlairColor] = useState("#0079D3");

  const [title, setTitle] = useState("Built an open-source tool hive with Next.js 15 & Tailwind! Thoughts?");
  const [bodyText, setBodyText] = useState(
    "Hey Reddit! Over the past few weeks I built a client-side developer toolbox featuring over 100+ utilities. Everything runs 100% locally in your browser with zero server roundtrips.\n\nKey tech stack:\n- Next.js 15 App Router\n- React 19 & Tailwind CSS\n- Web Crypto & HTML Canvas APIs"
  );
  const [mediaUrl, setMediaUrl] = useState("");

  const [upvotes, setUpvotes] = useState("1420");
  const [comments, setComments] = useState("184");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const themeStyles = {
    light: {
      bg: "#ffffff",
      text: "#222222",
      subtext: "#787c7e",
      border: "#ccc",
      hover: "#f6f7f8",
    },
    dark: {
      bg: "#1a1a1b",
      text: "#d7dadc",
      subtext: "#818384",
      border: "#343536",
      hover: "#272729",
    },
  }[theme];

  const handleIconUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setIconUrl(url);
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
              Reddit Post Mockup
            </h3>
            <Btn
              onClick={() => exportPng("reddit-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable Reddit Post Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl border p-4 shadow-xl transition-all"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily: 'IBMPlexSans, Arial, sans-serif',
            }}
          >
            {/* Header: Subreddit, User, Time, Flair */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Avatar src={iconUrl} name={subreddit} size={28} />
                <span className="font-bold text-white" style={{ color: themeStyles.text }}>
                  {subreddit.startsWith("r/") ? subreddit : `r/${subreddit}`}
                </span>
                <span style={{ color: themeStyles.subtext }}>•</span>
                <span style={{ color: themeStyles.subtext }}>Posted by {author.startsWith("u/") ? author : `u/${author}`}</span>
                <span style={{ color: themeStyles.subtext }}>{timeAgo}</span>

                {flairText && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: flairColor }}
                  >
                    {flairText}
                  </span>
                )}
              </div>
              <DotsIcon size={18} color={themeStyles.subtext} />
            </div>

            {/* Title */}
            <h3 className="mt-2.5 text-base font-bold leading-snug">
              {title}
            </h3>

            {/* Body text */}
            {bodyText && (
              <p className="mt-2 text-xs leading-relaxed whitespace-pre-wrap opacity-90">
                {bodyText}
              </p>
            )}

            {/* Media Image */}
            {mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: themeStyles.border }}>
                <img src={mediaUrl} alt="Reddit Post Attachment" className="w-full max-h-96 object-cover"  loading="lazy" decoding="async" />
              </div>
            )}

            {/* Footer Bar: Upvote Pill, Comment Pill, Share Pill */}
            <div className="mt-4 flex items-center gap-2 text-xs font-bold" style={{ color: themeStyles.subtext }}>
              {/* Upvote/Downvote Pill */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.hover }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span style={{ color: themeStyles.text }}>{formatStat(upvotes)}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>

              {/* Comments Pill */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.hover }}>
                <CommentIcon size={15} />
                <span>{formatStat(comments)} Comments</span>
              </div>

              {/* Share Pill */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.hover }}>
                <ShareIcon size={15} />
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Reddit Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Subreddit (r/...)">
            <TextInput value={subreddit} onChange={setSubreddit} />
          </Field>
          <Field label="Author (u/...)">
            <TextInput value={author} onChange={setAuthor} />
          </Field>
        </div>

        <Field label="Subreddit Icon">
          <FileDrop accept="image/*" onFiles={handleIconUpload} label="Upload Subreddit Icon" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Post Flair Text">
            <TextInput value={flairText} onChange={setFlairText} placeholder="e.g. Discussion" />
          </Field>
          <Field label="Flair Color">
            <Select
              value={flairColor}
              onChange={setFlairColor}
              options={[
                { value: "#0079D3", label: "Blue" },
                { value: "#46D160", label: "Green" },
                { value: "#FF4500", label: "Orange / Red" },
                { value: "#7193FF", label: "Purple" },
              ]}
            />
          </Field>
        </div>

        <Field label="Post Title">
          <TextInput value={title} onChange={setTitle} />
        </Field>

        <Field label="Post Body Text">
          <TextArea value={bodyText} onChange={setBodyText} rows={4} />
        </Field>

        <Field label="Post Media (Optional)">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Attached Image" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Upvotes">
            <TextInput value={upvotes} onChange={setUpvotes} />
          </Field>
          <Field label="Comments">
            <TextInput value={comments} onChange={setComments} />
          </Field>
          <Field label="Theme">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "light" | "dark")}
              options={[
                { value: "dark", label: "Dark Mode" },
                { value: "light", label: "Light Mode" },
              ]}
            />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
