"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  TextArea,
  Select,
  Range,
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
} from "./_post";

export default function TweetToImageConverter() {
  const { exportRef, exportPng } = useMockupExport();

  const [inputUrl, setInputUrl] = useState("");
  const [name, setName] = useState("Sarah Chen");
  const [handle, setHandle] = useState("sarahdev");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tweetText, setTweetText] = useState(
    "Simple consistency > temporary intensity.\n\nCode for 1 hour every single day for 6 months and watch your life transform completely. 📈"
  );
  const [likes, setLikes] = useState("18.4K");
  const [reposts, setReposts] = useState("2.1K");
  const [replies, setReplies] = useState("340");
  const [dateStr, setDateStr] = useState("9:15 AM · Oct 21, 2026");

  const [bgStyle, setBgStyle] = useState("sunset");
  const [padding, setBgPadding] = useState(32);
  const [cardTheme, setCardTheme] = useState<"light" | "dim" | "dark">("dark");

  const gradients: Record<string, string> = {
    sunset: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
    cyberpunk: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #d946ef 100%)",
    emerald: "linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)",
    midnight: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)",
    minimal: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
    amber: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  };

  const cardStyles = {
    light: { bg: "#ffffff", text: "#0f1419", subtext: "#536471", border: "#eff3f4" },
    dim: { bg: "#15202b", text: "#f7f9f9", subtext: "#8b98a5", border: "#38444d" },
    dark: { bg: "#000000", text: "#e7e9ea", subtext: "#71767b", border: "#2f3336" },
  }[cardTheme];

  const handleUrlPaste = (val: string) => {
    setInputUrl(val);
    if (val.includes("status/")) {
      const parts = val.split("/");
      const statusIdx = parts.indexOf("status");
      if (statusIdx > 0) {
        const extractedHandle = parts[statusIdx - 1];
        if (extractedHandle && extractedHandle !== "x.com" && extractedHandle !== "twitter.com") {
          setHandle(extractedHandle);
          setName(extractedHandle.charAt(0).toUpperCase() + extractedHandle.slice(1));
        }
      }
    }
  };

  const handlePreset = (type: string) => {
    if (type === "quote") {
      setName("Naval");
      setHandle("naval");
      setTweetText("If you can't see yourself working with someone for life, don't work with them for a day.");
      setLikes("45.2K");
      setReposts("8.9K");
      setBgStyle("midnight");
    } else if (type === "tech") {
      setName("Guillermo Rauch");
      setHandle("raim");
      setTweetText("Web development is entering its golden era. Speed, edge compute, and AI synthesis are converging.");
      setLikes("12.8K");
      setReposts("1.5K");
      setBgStyle("cyberpunk");
    } else if (type === "news") {
      setName("Tech Breaking");
      setHandle("techbreak");
      setTweetText("BREAKING: Open-source AI model reaches new milestone in code generation capabilities.");
      setLikes("28.1K");
      setReposts("6.4K");
      setBgStyle("sunset");
    }
  };

  const handleAvatarUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setAvatarUrl(url);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Shareable Card Image
            </h3>
            <Btn
              onClick={() => exportPng("tweet-share-card.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Export Wrapper with Canvas Gradient */}
          <div
            ref={exportRef}
            className="mx-auto w-full transition-all"
            style={{
              background: gradients[bgStyle] || gradients.sunset,
              padding: `${padding}px`,
              borderRadius: "24px",
            }}
          >
            {/* Inner Tweet Card */}
            <div
              className="mx-auto w-full max-w-md rounded-2xl p-5 shadow-2xl"
              style={{
                backgroundColor: cardStyles.bg,
                color: cardStyles.text,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={avatarUrl} name={name} size={44} />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-[15px]">
                      <span>{name}</span>
                      <VerifiedBadge type="blue" size={16} />
                    </div>
                    <div className="text-[13px]" style={{ color: cardStyles.subtext }}>
                      @{handle}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold" style={{ color: cardStyles.subtext }}>
                  𝕏
                </div>
              </div>

              {/* Text */}
              <div className="mt-4 text-[16px] leading-relaxed font-normal whitespace-pre-wrap">
                {tweetText}
              </div>

              {/* Date */}
              <div
                className="mt-3 text-[13px] pb-3 border-b"
                style={{ color: cardStyles.subtext, borderColor: cardStyles.border }}
              >
                {dateStr}
              </div>

              {/* Footer Bar */}
              <div className="mt-3 flex items-center justify-between text-[13px]" style={{ color: cardStyles.subtext }}>
                <div className="flex items-center gap-1.5">
                  <HeartIcon size={16} color="#ef4444" filled />
                  <span className="font-semibold" style={{ color: cardStyles.text }}>
                    {formatStat(likes)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RepostIcon size={16} />
                  <span className="font-semibold" style={{ color: cardStyles.text }}>
                    {formatStat(reposts)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CommentIcon size={16} />
                  <span className="font-semibold" style={{ color: cardStyles.text }}>
                    {formatStat(replies)}
                  </span>
                </div>
                <BookmarkIcon size={16} />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Tweet to Image Converter
        </h2>

        <Field label="Tweet URL or Paste Link">
          <TextInput
            value={inputUrl}
            onChange={handleUrlPaste}
            placeholder="https://x.com/username/status/123456789"
          />
        </Field>

        <div className="flex gap-2">
          <Btn variant="outline" className="!text-xs" onClick={() => handlePreset("tech")}>
            Tech Preset
          </Btn>
          <Btn variant="outline" className="!text-xs" onClick={() => handlePreset("quote")}>
            Quote Preset
          </Btn>
          <Btn variant="outline" className="!text-xs" onClick={() => handlePreset("news")}>
            News Preset
          </Btn>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Author Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Handle (@)">
            <TextInput value={handle} onChange={setHandle} />
          </Field>
        </div>

        <Field label="Tweet Text">
          <TextArea value={tweetText} onChange={setTweetText} rows={4} />
        </Field>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Custom Avatar" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
          <Field label="Reposts">
            <TextInput value={reposts} onChange={setReposts} />
          </Field>
          <Field label="Replies">
            <TextInput value={replies} onChange={setReplies} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Background Canvas Gradient">
            <Select
              value={bgStyle}
              onChange={setBgStyle}
              options={[
                { value: "sunset", label: "Sunset (Orange/Pink)" },
                { value: "cyberpunk", label: "Cyberpunk (Cyan/Purple)" },
                { value: "emerald", label: "Emerald Green" },
                { value: "midnight", label: "Midnight Blue" },
                { value: "amber", label: "Amber Gold" },
                { value: "minimal", label: "Minimal Gray" },
              ]}
            />
          </Field>

          <Field label="Card Theme">
            <Select
              value={cardTheme}
              onChange={(v) => setCardTheme(v as "light" | "dim" | "dark")}
              options={[
                { value: "dark", label: "Dark (Black)" },
                { value: "dim", label: "Dim (Navy)" },
                { value: "light", label: "Light (White)" },
              ]}
            />
          </Field>
        </div>

        <Field label="Canvas Outer Padding">
          <Range value={padding} onChange={setBgPadding} min={12} max={64} suffix="px" />
        </Field>

        <Field label="Date String">
          <TextInput value={dateStr} onChange={setDateStr} />
        </Field>
      </div>
    </ToolShell>
  );
}
