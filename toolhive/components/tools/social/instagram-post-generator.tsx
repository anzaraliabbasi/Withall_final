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
  ShareIcon,
  BookmarkIcon,
  DotsIcon,
} from "./_post";

export default function InstagramPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [username, setUsername] = useState("studiodesign");
  const [location, setLocation] = useState("Tokyo, Japan");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaGradient, setMediaGradient] = useState("gradient-1");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "16:9">("1:1");

  const [likesCount, setLikesCount] = useState("14,890");
  const [likedByUsername, setLikedByUsername] = useState("designmaster");
  const [caption, setCaption] = useState(
    "Minimalism is not about having less. It is about making room for what matters most. ⛩️✨ #tokyodesign #architecture #minimalism"
  );
  const [topCommenter, setTopCommenter] = useState("alex_arch");
  const [topComment, setTopComment] = useState("The light reflections in this frame are stunning! 🔥");
  const [timeAgo, setTimeAgo] = useState("3 HOURS AGO");

  const [cardTheme, setCardTheme] = useState<"light" | "dark">("dark");

  const themeStyles = {
    light: {
      bg: "#ffffff",
      text: "#000000",
      subtext: "#737373",
      border: "#efefef",
    },
    dark: {
      bg: "#000000",
      text: "#f5f5f5",
      subtext: "#a8a8a8",
      border: "#262626",
    },
  }[cardTheme];

  const gradients: Record<string, string> = {
    "gradient-1": "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
    "gradient-2": "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
    "gradient-3": "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    "gradient-4": "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)",
  };

  const aspectClasses = {
    "1:1": "aspect-square",
    "4:5": "aspect-[4/5]",
    "16:9": "aspect-[16/9]",
  }[aspectRatio];

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
              Instagram Post Preview
            </h3>
            <Btn
              onClick={() => exportPng("instagram-post-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable IG Post Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl transition-all"
            style={{
              backgroundColor: themeStyles.bg,
              color: themeStyles.text,
              borderColor: themeStyles.border,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-3.5 border-b" style={{ borderColor: themeStyles.border }}>
              <div className="flex items-center gap-3">
                {/* IG Story Ring surrounding Avatar */}
                <div className="rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                  <div className="rounded-full p-[1.5px]" style={{ backgroundColor: themeStyles.bg }}>
                    <Avatar src={avatarUrl} name={username} size={36} />
                  </div>
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <span>{username}</span>
                    {isVerified && <VerifiedBadge type="blue" size={15} />}
                  </div>
                  {location && (
                    <span className="text-[11px]" style={{ color: themeStyles.subtext }}>
                      {location}
                    </span>
                  )}
                </div>
              </div>
              <DotsIcon size={20} color={themeStyles.subtext} />
            </div>

            {/* Main Media Box */}
            <div
              className={`w-full overflow-hidden flex items-center justify-center ${aspectClasses}`}
              style={{
                background: mediaUrl ? "none" : gradients[mediaGradient],
              }}
            >
              {mediaUrl ? (
                <img src={mediaUrl} alt="Post Content" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
              ) : (
                <div className="p-8 text-center text-white font-extrabold text-2xl tracking-wide drop-shadow-md">
                  📷 {username}
                </div>
              )}
            </div>

            {/* Action Icon Bar */}
            <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
              <div className="flex items-center gap-4">
                <HeartIcon size={24} color={themeStyles.text} />
                <CommentIcon size={24} color={themeStyles.text} />
                <ShareIcon size={24} color={themeStyles.text} />
              </div>
              <BookmarkIcon size={24} color={themeStyles.text} />
            </div>

            {/* Likes Summary */}
            <div className="px-3.5 text-xs font-bold">
              {likedByUsername ? (
                <span>
                  Liked by <span className="font-extrabold">{likedByUsername}</span> and{" "}
                  <span className="font-extrabold">{likesCount} others</span>
                </span>
              ) : (
                <span>{likesCount} likes</span>
              )}
            </div>

            {/* Caption */}
            <div className="px-3.5 pt-2 text-xs leading-normal">
              <span className="font-bold mr-1.5">{username}</span>
              <span className="whitespace-pre-wrap">{caption}</span>
            </div>

            {/* Top Comment */}
            {topComment && (
              <div className="px-3.5 pt-2 text-xs">
                <span className="font-bold mr-1.5">{topCommenter}</span>
                <span style={{ color: themeStyles.text }}>{topComment}</span>
              </div>
            )}

            {/* Time Stamp */}
            <div
              className="px-3.5 py-3 text-[10px] font-medium uppercase tracking-wider"
              style={{ color: themeStyles.subtext }}
            >
              {timeAgo}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Instagram Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} />
          </Field>
          <Field label="Location Tag">
            <TextInput value={location} onChange={setLocation} placeholder="e.g. Paris, France" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Verified Badge">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Check" />
          </Field>
          <Field label="Aspect Ratio">
            <Select
              value={aspectRatio}
              onChange={(v) => setAspectRatio(v as "1:1" | "4:5" | "16:9")}
              options={[
                { value: "1:1", label: "Square (1:1)" },
                { value: "4:5", label: "Portrait (4:5)" },
                { value: "16:9", label: "Landscape (16:9)" },
              ]}
            />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Profile Picture" />
        </Field>

        <Field label="Post Media Image">
          <FileDrop accept="image/*" onFiles={handleMediaUpload} label="Upload Post Media" />
        </Field>

        {!mediaUrl && (
          <Field label="Preset Placeholder Background">
            <Select
              value={mediaGradient}
              onChange={setMediaGradient}
              options={[
                { value: "gradient-1", label: "Instagram Sunset" },
                { value: "gradient-2", label: "Ocean Blue" },
                { value: "gradient-3", label: "Emerald Nature" },
                { value: "gradient-4", label: "Rose Pink" },
              ]}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Likes Count">
            <TextInput value={likesCount} onChange={setLikesCount} />
          </Field>
          <Field label="Liked By Username (Optional)">
            <TextInput value={likedByUsername} onChange={setLikedByUsername} />
          </Field>
        </div>

        <Field label="Caption">
          <TextArea value={caption} onChange={setCaption} rows={3} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Top Commenter">
            <TextInput value={topCommenter} onChange={setTopCommenter} />
          </Field>
          <Field label="Top Comment Text">
            <TextInput value={topComment} onChange={setTopComment} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time Ago String">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
          <Field label="Theme">
            <Select
              value={cardTheme}
              onChange={(v) => setCardTheme(v as "light" | "dark")}
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
