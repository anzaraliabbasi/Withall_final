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
  BookmarkIcon,
  ShareIcon,
} from "./_post";

export default function TweetGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("Alex Rivers");
  const [handle, setHandle] = useState("alexrivers");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isVerified, setIsVerified] = useState(true);
  const [verifiedType, setVerifiedType] = useState<"blue" | "gold" | "grey">("blue");

  const [tweetText, setTweetText] = useState(
    "Just launched our new developer tools platform! 🚀\n\nBuilt with Next.js 15, Tailwind CSS, and pure client-side precision. Check out the link below and let me know your thoughts! #webdev #buildinpublic"
  );
  const [mediaUrl, setMediaUrl] = useState<string>("");

  const [timeDate, setTimeDate] = useState("10:42 AM · Oct 22, 2026");
  const [source, setSource] = useState("Twitter for Web");

  const [replies, setReplies] = useState<string | number>("142");
  const [reposts, setReposts] = useState<string | number>("850");
  const [likes, setLikes] = useState<string | number>("4200");
  const [bookmarks, setBookmarks] = useState<string | number>("620");
  const [views, setViews] = useState<string | number>("125000");

  const [theme, setTheme] = useState<"light" | "dim" | "dark">("dark");

  const themeStyles = {
    light: {
      bg: "#ffffff",
      text: "#0f1419",
      subtext: "#536471",
      border: "#eff3f4",
      highlight: "#1d9bf0",
    },
    dim: {
      bg: "#15202b",
      text: "#f7f9f9",
      subtext: "#8b98a5",
      border: "#38444d",
      highlight: "#1d9bf0",
    },
    dark: {
      bg: "#000000",
      text: "#e7e9ea",
      subtext: "#71767b",
      border: "#2f3336",
      highlight: "#1d9bf0",
    },
  }[theme];

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

  // Helper to render tweet text with hashtags & mentions colored
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const words = line.split(" ");
      return (
        <React.Fragment key={lIdx}>
          {words.map((word, wIdx) => {
            if (word.startsWith("#") || word.startsWith("@")) {
              return (
                <span key={wIdx} style={{ color: themeStyles.highlight }}>
                  {word}{" "}
                </span>
              );
            }
            return word + " ";
          })}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Tweet Preview Card
            </h3>
            <Btn
              onClick={() => exportPng("tweet-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl p-5 shadow-2xl transition-all"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Header: Avatar, Name, Handle, Verified, Menu */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} name={name} size={48} />
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1 font-bold text-[15px]">
                    <span className="truncate max-w-[180px]">{name}</span>
                    {isVerified && <VerifiedBadge type={verifiedType} size={18} />}
                  </div>
                  <span className="text-[14px]" style={{ color: themeStyles.subtext }}>
                    @{handle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="p-1 text-slate-400 hover:text-slate-200"
                style={{ color: themeStyles.subtext }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>

            {/* Tweet Content */}
            <div className="mt-3 text-[16px] leading-normal font-normal whitespace-pre-wrap">
              {renderFormattedText(tweetText)}
            </div>

            {/* Media Attachment */}
            {mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl border" style={{ borderColor: themeStyles.border }}>
                <img src={mediaUrl} alt="Tweet Media" className="w-full max-h-96 object-cover"  loading="lazy" decoding="async" />
              </div>
            )}

            {/* Time & Source */}
            <div
              className="mt-3 flex items-center gap-2 text-[14px] pb-3 border-b"
              style={{ color: themeStyles.subtext, borderColor: themeStyles.border }}
            >
              <span>{timeDate}</span>
              <span>·</span>
              <span style={{ color: themeStyles.highlight }} className="font-medium">
                {source}
              </span>
            </div>

            {/* Stat Row */}
            <div
              className="flex items-center justify-around py-3 border-b text-[13px]"
              style={{ color: themeStyles.subtext, borderColor: themeStyles.border }}
            >
              <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: themeStyles.text }}>
                  {formatStat(reposts)}
                </span>
                <span>Reposts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: themeStyles.text }}>
                  {formatStat(likes)}
                </span>
                <span>Likes</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: themeStyles.text }}>
                  {formatStat(bookmarks)}
                </span>
                <span>Bookmarks</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: themeStyles.text }}>
                  {formatStat(views)}
                </span>
                <span>Views</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-around" style={{ color: themeStyles.subtext }}>
              <button type="button" className="hover:text-sky-500 transition-colors flex items-center gap-1.5">
                <CommentIcon size={18} />
                <span className="text-xs">{formatStat(replies)}</span>
              </button>
              <button type="button" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                <RepostIcon size={18} />
                <span className="text-xs">{formatStat(reposts)}</span>
              </button>
              <button type="button" className="hover:text-pink-500 transition-colors flex items-center gap-1.5">
                <HeartIcon size={18} />
                <span className="text-xs">{formatStat(likes)}</span>
              </button>
              <button type="button" className="hover:text-sky-500 transition-colors">
                <BookmarkIcon size={18} />
              </button>
              <button type="button" className="hover:text-sky-500 transition-colors">
                <ShareIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Tweet Generator Controls
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name">
            <TextInput value={name} onChange={setName} placeholder="Display Name" />
          </Field>
          <Field label="Handle (@)">
            <TextInput value={handle} onChange={setHandle} placeholder="username" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Verified Badge">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Verified" />
          </Field>
          <Field label="Badge Type">
            <Select
              value={verifiedType}
              onChange={(v) => setVerifiedType(v as "blue" | "gold" | "grey")}
              options={[
                { value: "blue", label: "Blue Check" },
                { value: "gold", label: "Gold Business" },
                { value: "grey", label: "Grey Gov" },
              ]}
            />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop
            accept="image/*"
            onFiles={handleAvatarUpload}
            label={avatarUrl ? "Avatar uploaded (Click to change)" : "Upload Avatar"}
          />
        </Field>

        <Field label="Tweet Text">
          <TextArea value={tweetText} onChange={setTweetText} rows={4} placeholder="What's happening?" />
        </Field>

        <Field label="Post Media (Optional)">
          <FileDrop
            accept="image/*"
            onFiles={handleMediaUpload}
            label={mediaUrl ? "Image uploaded (Click to change)" : "Upload Post Image"}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time & Date">
            <TextInput value={timeDate} onChange={setTimeDate} placeholder="10:42 AM · Oct 22, 2026" />
          </Field>
          <Field label="Source App">
            <TextInput value={source} onChange={setSource} placeholder="Twitter for iPhone" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Replies">
            <TextInput value={String(replies)} onChange={setReplies} />
          </Field>
          <Field label="Reposts">
            <TextInput value={String(reposts)} onChange={setReposts} />
          </Field>
          <Field label="Likes">
            <TextInput value={String(likes)} onChange={setLikes} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Bookmarks">
            <TextInput value={String(bookmarks)} onChange={setBookmarks} />
          </Field>
          <Field label="Views">
            <TextInput value={String(views)} onChange={setViews} />
          </Field>
          <Field label="Card Theme">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "light" | "dim" | "dark")}
              options={[
                { value: "dark", label: "Dark (Black)" },
                { value: "dim", label: "Dim (Navy)" },
                { value: "light", label: "Light (White)" },
              ]}
            />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
