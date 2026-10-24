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
import { Avatar, readImageAsDataUrl } from "./_post";

export default function FacebookStoryGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("David Miller");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [timeAgo, setTimeAgo] = useState("2h");

  const [bgImage, setBgImage] = useState("");
  const [bgPreset, setBgPreset] = useState("facebook-blue");

  const [caption, setCaption] = useState("Weekend trip to the mountains! 🏔️ Fresh air and crisp autumn colors.");
  const [textStyle, setTextStyle] = useState<"banner" | "bold" | "clean">("banner");

  const [hasMusicSticker, setHasMusicSticker] = useState(true);
  const [songTitle, setSongTitle] = useState("Midnight City");
  const [artistName, setArtistName] = useState("M83");

  const gradients: Record<string, string> = {
    "facebook-blue": "linear-gradient(180deg, #1877f2 0%, #0d47a1 50%, #002171 100%)",
    "sunset": "linear-gradient(180deg, #f57c00 0%, #d81b60 50%, #4a148c 100%)",
    "dark": "linear-gradient(180deg, #242526 0%, #18191a 100%)",
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
              Facebook Story Mockup
            </h3>
            <Btn
              onClick={() => exportPng("facebook-story-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* 9:16 Vertical FB Story Frame */}
          <div
            ref={exportRef}
            className="relative mx-auto h-[600px] w-[337px] overflow-hidden rounded-[2.5rem] p-4 shadow-2xl transition-all flex flex-col justify-between"
            style={{
              background: bgImage ? `url(${bgImage}) center/cover no-repeat` : gradients[bgPreset],
              color: "#ffffff",
              fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Top Bar: Progress Line + User Header */}
            <div className="space-y-3 z-10">
              <div className="h-1 w-full rounded-full bg-white/40 overflow-hidden">
                <div className="h-full w-2/3 bg-white" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-0.5 bg-blue-500">
                    <Avatar src={avatarUrl} name={name} size={34} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-xs">{name}</span>
                    <span className="text-[10px] opacity-80">{timeAgo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/90 font-bold text-base">
                  <span>•••</span>
                  <span>✕</span>
                </div>
              </div>
            </div>

            {/* Middle Content: Caption & Music Sticker */}
            <div className="my-auto space-y-4 px-2 text-center z-10">
              {caption && (
                <div
                  className={`inline-block max-w-[280px] p-3 text-center transition-all ${
                    textStyle === "banner"
                      ? "bg-black/75 text-white font-extrabold text-base rounded-xl backdrop-blur shadow-lg"
                      : textStyle === "bold"
                      ? "text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      : "text-base font-semibold text-white drop-shadow"
                  }`}
                >
                  {caption}
                </div>
              )}

              {/* FB Music Sticker */}
              {hasMusicSticker && (
                <div className="mx-auto flex w-[220px] items-center gap-2.5 rounded-2xl bg-white/90 p-2.5 text-slate-900 shadow-xl backdrop-blur">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold">
                    🎵
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold text-xs truncate max-w-[140px]">{songTitle}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{artistName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center gap-2 z-10 pt-2">
              <div className="flex flex-1 items-center rounded-full border border-white/40 bg-black/40 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                Reply to {name.split(" ")[0]}...
              </div>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow">
                👍
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white text-sm font-bold shadow">
                ❤️
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Facebook Story Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="User Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Avatar" />
        </Field>

        <Field label="Story Background Image">
          <FileDrop accept="image/*" onFiles={handleBgUpload} label="Upload Custom Background" />
        </Field>

        {!bgImage && (
          <Field label="Background Gradient Preset">
            <Select
              value={bgPreset}
              onChange={setBgPreset}
              options={[
                { value: "facebook-blue", label: "Facebook Blue" },
                { value: "sunset", label: "Sunset Glow" },
                { value: "dark", label: "Dark Gray" },
              ]}
            />
          </Field>
        )}

        <Field label="Story Caption">
          <TextArea value={caption} onChange={setCaption} rows={3} />
        </Field>

        <Field label="Text Box Style">
          <Select
            value={textStyle}
            onChange={(v) => setTextStyle(v as "banner" | "bold" | "clean")}
            options={[
              { value: "banner", label: "Dark Banner Box" },
              { value: "bold", label: "Bold Headline Text" },
              { value: "clean", label: "Clean Simple Text" },
            ]}
          />
        </Field>

        <div className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <Field label="Music Sticker Toggle">
            <Select
              value={hasMusicSticker ? "yes" : "no"}
              onChange={(v) => setHasMusicSticker(v === "yes")}
              options={[
                { value: "yes", label: "Show Music Sticker" },
                { value: "no", label: "Hide Music Sticker" },
              ]}
            />
          </Field>

          {hasMusicSticker && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Song Title">
                <TextInput value={songTitle} onChange={setSongTitle} />
              </Field>
              <Field label="Artist Name">
                <TextInput value={artistName} onChange={setArtistName} />
              </Field>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
