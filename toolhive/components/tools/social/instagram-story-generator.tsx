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
  Range,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, VerifiedBadge, readImageAsDataUrl, HeartIcon, ShareIcon } from "./_post";

export default function InstagramStoryGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [username, setUsername] = useState("alexa_designs");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [timeAgo, setTimeAgo] = useState("4h");

  const [bgImage, setBgImage] = useState("");
  const [bgPreset, setBgPreset] = useState("purple-pink");

  const [storyText, setStoryText] = useState("Big announcement coming tomorrow at 10 AM EST! Stay tuned 🚀");
  const [textStyle, setTextStyle] = useState<"modern" | "neon" | "typewriter" | "classic">("modern");

  const [stickerType, setStickerType] = useState<"poll" | "question" | "link" | "mention" | "none">("poll");
  const [pollQuestion, setPollQuestion] = useState("Are you ready?");
  const [pollOption1, setPollOption1] = useState("YES 🔥");
  const [pollOption2, setPollOption2] = useState("Not yet 😅");

  const [questionTitle, setQuestionTitle] = useState("Ask me anything about UI/UX!");
  const [linkUrl, setLinkUrl] = useState("toolhive.dev");
  const [mentionHandle, setMentionHandle] = useState("@nextjs");

  const [progressSegments, setProgressSegments] = useState(4);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(2);

  const gradients: Record<string, string> = {
    "purple-pink": "linear-gradient(180deg, #7e22ce 0%, #3b82f6 50%, #ec4899 100%)",
    "sunset": "linear-gradient(180deg, #f97316 0%, #e11d48 50%, #7e22ce 100%)",
    "dark-gradient": "linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)",
    "emerald": "linear-gradient(180deg, #047857 0%, #10b981 50%, #06b6d4 100%)",
  };

  const handleAvatarUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setAvatarUrl(url);
    }
  };

  const handleBgUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setBgImage(url);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Story Mockup Preview
            </h3>
            <Btn
              onClick={() => exportPng("instagram-story-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* 9:16 Vertical Export Frame */}
          <div
            ref={exportRef}
            className="relative mx-auto h-[600px] w-[337px] overflow-hidden rounded-[2.5rem] p-4 shadow-2xl transition-all flex flex-col justify-between"
            style={{
              background: bgImage ? `url(${bgImage}) center/cover no-repeat` : gradients[bgPreset],
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Top Bar: Progress Bars + Header */}
            <div className="space-y-3 z-10">
              {/* Progress Segments */}
              <div className="flex gap-1.5 w-full">
                {Array.from({ length: progressSegments }).map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all"
                      style={{
                        width: idx < activeSegmentIndex ? "100%" : idx === activeSegmentIndex ? "60%" : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={avatarUrl} name={username} size={34} />
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <span>{username}</span>
                    {isVerified && <VerifiedBadge type="blue" size={14} />}
                    <span className="font-normal opacity-80 ml-1">{timeAgo}</span>
                  </div>
                </div>
                <button type="button" className="text-white text-lg font-bold opacity-80 hover:opacity-100">
                  ✕
                </button>
              </div>
            </div>

            {/* Middle Area: Story Text & Interactive Stickers */}
            <div className="my-auto space-y-4 px-2 text-center z-10">
              {/* Overlay Text */}
              {storyText && (
                <div
                  className={`inline-block max-w-[280px] p-3 text-center transition-all ${
                    textStyle === "modern"
                      ? "rounded-xl bg-white text-slate-950 font-extrabold text-base shadow-lg"
                      : textStyle === "neon"
                      ? "font-extrabold text-xl text-pink-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]"
                      : textStyle === "typewriter"
                      ? "font-mono bg-black/80 text-emerald-400 p-3 rounded-lg text-sm"
                      : "font-semibold text-lg text-white drop-shadow-md"
                  }`}
                >
                  {storyText}
                </div>
              )}

              {/* Interactive Stickers */}
              {stickerType === "poll" && (
                <div className="mx-auto w-[240px] rounded-2xl bg-white/95 p-3 text-slate-900 shadow-xl backdrop-blur">
                  <div className="text-xs font-bold">{pollQuestion}</div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs font-extrabold">
                    <div className="rounded-xl bg-sky-500 py-2.5 text-white shadow">{pollOption1}</div>
                    <div className="rounded-xl bg-pink-500 py-2.5 text-white shadow">{pollOption2}</div>
                  </div>
                </div>
              )}

              {stickerType === "question" && (
                <div className="mx-auto w-[240px] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-xs font-bold text-white">
                    {questionTitle}
                  </div>
                  <div className="p-3 text-[11px] text-slate-400 font-medium">Type something...</div>
                </div>
              )}

              {stickerType === "link" && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-sky-600 shadow-lg">
                  <span>🔗 {linkUrl}</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </div>
              )}

              {stickerType === "mention" && (
                <div className="inline-block rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2 font-extrabold text-sm text-white shadow-lg tracking-wide">
                  {mentionHandle}
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center gap-3 z-10 pt-2">
              <div className="flex flex-1 items-center rounded-full border border-white/40 bg-black/30 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur">
                Send message...
              </div>
              <HeartIcon size={24} color="#ffffff" />
              <ShareIcon size={24} color="#ffffff" />
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Instagram Story Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} />
          </Field>
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Profile Picture" />
        </Field>

        <Field label="Background Image">
          <FileDrop accept="image/*" onFiles={handleBgUpload} label="Upload Custom Background" />
        </Field>

        {!bgImage && (
          <Field label="Background Gradient Preset">
            <Select
              value={bgPreset}
              onChange={setBgPreset}
              options={[
                { value: "purple-pink", label: "Purple Pink Sunset" },
                { value: "sunset", label: "Vibrant Orange Sunset" },
                { value: "dark-gradient", label: "Dark Midnight" },
                { value: "emerald", label: "Emerald Teal" },
              ]}
            />
          </Field>
        )}

        <Field label="Story Main Text">
          <TextArea value={storyText} onChange={setStoryText} rows={3} />
        </Field>

        <Field label="Text Style">
          <Select
            value={textStyle}
            onChange={(v) => setTextStyle(v as "modern" | "neon" | "typewriter" | "classic")}
            options={[
              { value: "modern", label: "Modern Sticker Box" },
              { value: "neon", label: "Glow Neon" },
              { value: "typewriter", label: "Typewriter Box" },
              { value: "classic", label: "Classic Clean Text" },
            ]}
          />
        </Field>

        <Field label="Interactive Sticker Type">
          <Select
            value={stickerType}
            onChange={(v) =>
              setStickerType(v as "poll" | "question" | "link" | "mention" | "none")
            }
            options={[
              { value: "poll", label: "Poll Sticker" },
              { value: "question", label: "Question Box" },
              { value: "link", label: "Link Sticker" },
              { value: "mention", label: "@Mention Sticker" },
              { value: "none", label: "None" },
            ]}
          />
        </Field>

        {stickerType === "poll" && (
          <div className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <Field label="Poll Question">
              <TextInput value={pollQuestion} onChange={setPollQuestion} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Option 1">
                <TextInput value={pollOption1} onChange={setPollOption1} />
              </Field>
              <Field label="Option 2">
                <TextInput value={pollOption2} onChange={setPollOption2} />
              </Field>
            </div>
          </div>
        )}

        {stickerType === "question" && (
          <Field label="Question Box Header">
            <TextInput value={questionTitle} onChange={setQuestionTitle} />
          </Field>
        )}

        {stickerType === "link" && (
          <Field label="Link URL Label">
            <TextInput value={linkUrl} onChange={setLinkUrl} />
          </Field>
        )}

        {stickerType === "mention" && (
          <Field label="Mention Handle">
            <TextInput value={mentionHandle} onChange={setMentionHandle} />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Progress Segments Count">
            <Range value={progressSegments} onChange={setProgressSegments} min={1} max={8} />
          </Field>
          <Field label="Active Segment Index">
            <Range value={activeSegmentIndex} onChange={setActiveSegmentIndex} min={0} max={progressSegments - 1} />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
