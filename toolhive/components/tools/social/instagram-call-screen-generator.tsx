"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, PhoneFrame, useMockupExport } from "@/components/ui/kit";
import { PhoneStatusBar } from "./_chat";

export default function InstagramCallScreenGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Emily Creator");
  const [username, setUsername] = useState("emily_creator");
  const [callStatus, setCallStatus] = useState("Connected 01:23");
  const [isVideoCall, setIsVideoCall] = useState(true);
  const [avatar, setAvatar] = useState("");

  const handleAvatarUpload = (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Instagram Call Preview</h3>
            <Btn onClick={() => exportPng("instagram-call.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div className="flex flex-col h-[580px] bg-[#121212] text-white font-sans select-none relative overflow-hidden justify-between p-4">
                <PhoneStatusBar dark={true} bg="transparent" />

                {/* Top header bar */}
                <div className="flex items-center justify-between pt-2 px-2 text-xs font-semibold">
                  <span>‹ Back</span>
                  <span className="opacity-80">Instagram Call</span>
                  <span>➕ Add</span>
                </div>

                {/* Main Caller Area */}
                <div className="flex flex-col items-center justify-center my-auto space-y-4">
                  <div className="relative">
                    <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                      <div className="w-28 h-28 rounded-full border-4 border-black overflow-hidden bg-slate-800 flex items-center justify-center text-3xl font-bold">
                        {avatar ? (
                          <img src={avatar} alt={contactName} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                        ) : (
                          contactName[0]?.toUpperCase() || "?"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">{contactName}</h2>
                    <p className="text-xs text-slate-400 font-medium">@{username}</p>
                    <p className="text-[11px] text-pink-400 font-semibold">{callStatus}</p>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pb-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                      🔄
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                      {isVideoCall ? "📹" : "📷"}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                      🎙️
                    </div>
                    <div className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center text-2xl shadow-xl">
                      📞
                    </div>
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Instagram Call Screen Generator</h2>
          <p className="text-xs text-slate-500">Create Instagram video or audio call screen mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Call Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="Emily Creator" />
            </Field>
            <Field label="Instagram Handle">
              <TextInput value={username} onChange={setUsername} placeholder="emily_creator" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Call Status">
              <TextInput value={callStatus} onChange={setCallStatus} placeholder="Connected 01:23" />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={isVideoCall} onChange={setIsVideoCall} label="Video Call Mode" />
            </div>
          </div>

          <Field label="Avatar Photo">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
