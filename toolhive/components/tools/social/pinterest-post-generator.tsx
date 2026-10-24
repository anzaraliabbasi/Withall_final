"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  TextArea,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, formatStat, readImageAsDataUrl, ShareIcon, DotsIcon } from "./_post";

export default function PinterestPostGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [title, setTitle] = useState("10 Minimalist Workspace Setup Ideas for Tech Creators");
  const [description, setDescription] = useState(
    "Transform your home office into a productivity sanctuary with clean aesthetic desks, warm ambient lighting, and wire management tips."
  );
  const [destinationUrl, setDestinationUrl] = useState("workspaceinspiration.com");

  const [creatorName, setCreatorName] = useState("Aesthetic Spaces");
  const [followers, setFollowers] = useState("45.2K");
  const [boardName, setBoardName] = useState("Home Office Setup");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [pinImageUrl, setPinImageUrl] = useState("");

  const handleAvatarUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setAvatarUrl(url);
    }
  };

  const handlePinImageUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setPinImageUrl(url);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Pinterest Pin Mockup
            </h3>
            <Btn
              onClick={() => exportPng("pinterest-pin-mockup.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable Pinterest Pin Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-5 text-slate-900 shadow-2xl transition-all"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Media Area */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-inner">
              {pinImageUrl ? (
                <img src={pinImageUrl} alt="Pin Media" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white drop-shadow-md">
                  <span className="text-4xl">📌</span>
                  <span className="mt-2 text-lg font-black">{title}</span>
                </div>
              )}

              {/* Floating Top Bar on Image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                  {boardName} ▾
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#E60023] px-4 py-2 text-xs font-extrabold text-white shadow-lg transition-transform hover:scale-105"
                >
                  Save
                </button>
              </div>

              {/* Floating Bottom Bar on Image */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow backdrop-blur">
                  <ShareIcon size={16} />
                </button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow backdrop-blur">
                  <DotsIcon size={16} />
                </button>
              </div>
            </div>

            {/* Below Image Details */}
            <div className="mt-4 space-y-2">
              {/* Destination URL */}
              {destinationUrl && (
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <span>↗</span>
                  <span className="underline">{destinationUrl}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-base font-extrabold leading-tight text-slate-900">
                {title}
              </h2>

              {/* Description */}
              {description && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {description}
                </p>
              )}

              {/* Creator Bar */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Avatar src={avatarUrl} name={creatorName} size={36} />
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-xs text-slate-900">{creatorName}</span>
                    <span className="text-[11px] text-slate-500">{formatStat(followers)} followers</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
                >
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Pinterest Pin Generator
        </h2>

        <Field label="Pin Title">
          <TextInput value={title} onChange={setTitle} />
        </Field>

        <Field label="Pin Description">
          <TextArea value={description} onChange={setDescription} rows={3} />
        </Field>

        <Field label="Destination Website Domain">
          <TextInput value={destinationUrl} onChange={setDestinationUrl} placeholder="example.com" />
        </Field>

        <Field label="Pin Image (Tall Vertical format recommended)">
          <FileDrop accept="image/*" onFiles={handlePinImageUpload} label="Upload Pin Media Image" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Creator Name">
            <TextInput value={creatorName} onChange={setCreatorName} />
          </Field>
          <Field label="Board Name">
            <TextInput value={boardName} onChange={setBoardName} />
          </Field>
        </div>

        <Field label="Creator Avatar">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Creator Avatar" />
        </Field>

        <Field label="Followers Count">
          <TextInput value={followers} onChange={setFollowers} />
        </Field>
      </div>
    </ToolShell>
  );
}
