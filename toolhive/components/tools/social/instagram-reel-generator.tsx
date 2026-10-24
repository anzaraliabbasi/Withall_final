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
  DotsIcon,
} from "./_post";

export default function InstagramReelGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [username, setUsername] = useState("travel_vibes");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);

  const [bgImage, setBgImage] = useState("");
  const [bgPreset, setBgPreset] = useState("sunset");

  const [caption, setCaption] = useState(
    "Watching the sunset over Mount Fuji hits different in person 🌅🗻 #japan #travel #reels #mountfuji"
  );
  const [audioTrack, setAudioTrack] = useState("Original Audio - @travel_vibes");

  const [likes, setLikes] = useState("142.5K");
  const [comments, setComments] = useState("1,840");
  const [shares, setShares] = useState("24.1K");

  const gradients: Record<string, string> = {
    sunset: "linear-gradient(180deg, #311b92 0%, #d81b60 50%, #f57c00 100%)",
    cyber: "linear-gradient(180deg, #0f172a 0%, #0284c7 50%, #ec4899 100%)",
    emerald: "linear-gradient(180deg, #022c22 0%, #059669 50%, #10b981 100%)",
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
              Reel Mockup Preview
            </h3>
            <Btn
              onClick={() => exportPng("instagram-reel-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* 9:16 Vertical Reel Frame */}
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
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10 font-bold text-lg">
              <span>Reels</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>

            {/* Bottom Content & Right Action Rail */}
            <div className="flex items-end justify-between z-10 w-full pb-2">
              {/* Left Overlay Info */}
              <div className="flex-1 pr-3 space-y-2.5 max-w-[230px]">
                {/* User Row */}
                <div className="flex items-center gap-2">
                  <Avatar src={avatarUrl} name={username} size={36} />
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <span>{username}</span>
                    {isVerified && <VerifiedBadge type="blue" size={15} />}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-white/60 bg-black/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Paid Partnership Label */}
                {isSponsored && (
                  <div className="text-[11px] font-semibold text-white/90 bg-black/30 px-2 py-0.5 rounded w-fit backdrop-blur">
                    Paid partnership
                  </div>
                )}

                {/* Caption */}
                <p className="text-xs leading-relaxed line-clamp-3 text-white/95 drop-shadow">
                  {caption}
                </p>

                {/* Audio Track marquee */}
                <div className="flex items-center gap-2 text-xs text-white/90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  <span className="truncate max-w-[180px] font-medium">{audioTrack}</span>
                </div>
              </div>

              {/* Right Action Rail */}
              <div className="flex flex-col items-center gap-4 text-center">
                <button type="button" className="group flex flex-col items-center">
                  <HeartIcon size={26} color="#ffffff" />
                  <span className="mt-1 text-[11px] font-semibold">{formatStat(likes)}</span>
                </button>

                <button type="button" className="group flex flex-col items-center">
                  <CommentIcon size={26} color="#ffffff" />
                  <span className="mt-1 text-[11px] font-semibold">{formatStat(comments)}</span>
                </button>

                <button type="button" className="group flex flex-col items-center">
                  <ShareIcon size={26} color="#ffffff" />
                  <span className="mt-1 text-[11px] font-semibold">{formatStat(shares)}</span>
                </button>

                <DotsIcon size={24} color="#ffffff" />

                {/* Audio Disk */}
                <div className="h-8 w-8 rounded-lg border-2 border-white/80 overflow-hidden bg-black/50 p-1 flex items-center justify-center animate-spin">
                  <Avatar src={avatarUrl} name={username} size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Instagram Reel Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} />
          </Field>
          <Field label="Audio Track Name">
            <TextInput value={audioTrack} onChange={setAudioTrack} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Verified">
            <Toggle checked={isVerified} onChange={setIsVerified} label="Blue Badge" />
          </Field>
          <Field label="Following">
            <Toggle checked={isFollowing} onChange={setIsFollowing} label="Following State" />
          </Field>
          <Field label="Sponsored">
            <Toggle checked={isSponsored} onChange={setIsSponsored} label="Paid Partner" />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Creator Avatar" />
        </Field>

        <Field label="Reel Media Background">
          <FileDrop accept="image/*" onFiles={handleBgUpload} label="Upload Video Frame / Image" />
        </Field>

        {!bgImage && (
          <Field label="Gradient Preset">
            <Select
              value={bgPreset}
              onChange={setBgPreset}
              options={[
                { value: "sunset", label: "Sunset Purple-Orange" },
                { value: "cyber", label: "Cyber Blue-Pink" },
                { value: "emerald", label: "Emerald Teal" },
              ]}
            />
          </Field>
        )}

        <Field label="Caption">
          <TextArea value={caption} onChange={setCaption} rows={3} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
          <Field label="Comments">
            <TextInput value={comments} onChange={setComments} />
          </Field>
          <Field label="Shares">
            <TextInput value={shares} onChange={setShares} />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
