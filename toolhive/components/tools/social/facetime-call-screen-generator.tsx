"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, PhoneFrame, useMockupExport } from "@/components/ui/kit";
import { PhoneStatusBar } from "./_chat";

export default function FacetimeCallScreenGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("John Doe");
  const [callStatus, setStatusText] = useState("FaceTime Video...");
  const [duration, setDuration] = useState("03:42");
  const [isIncoming, setIsIncoming] = useState(false);
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">FaceTime Preview</h3>
            <Btn onClick={() => exportPng("facetime-call.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div className="flex flex-col h-[580px] bg-slate-950 text-white font-sans select-none relative overflow-hidden justify-between p-4">
                <PhoneStatusBar dark={true} bg="transparent" />

                {/* Main Caller Area */}
                <div className="flex flex-col items-center justify-center my-auto space-y-4">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-700/50 shadow-2xl overflow-hidden bg-slate-800 flex items-center justify-center text-3xl font-bold">
                    {avatar ? (
                      <img src={avatar} alt={contactName} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                    ) : (
                      contactName[0]?.toUpperCase() || "?"
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{contactName}</h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {isIncoming ? "FaceTime Video" : `${callStatus} • ${duration}`}
                    </p>
                  </div>
                </div>

                {/* Call Control Buttons */}
                <div className="pb-6">
                  {isIncoming ? (
                    <div className="flex items-center justify-around px-8">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-2xl shadow-lg">
                          ✕
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium">Decline</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl shadow-lg">
                          📞
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium">Accept</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-y-6 gap-x-4 max-w-[280px] mx-auto text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                          🎙️
                        </div>
                        <span className="text-[10px] text-slate-400">mute</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                          📹
                        </div>
                        <span className="text-[10px] text-slate-400">video</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                          🔊
                        </div>
                        <span className="text-[10px] text-slate-400">speaker</span>
                      </div>

                      <div className="col-span-3 flex justify-center pt-2">
                        <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-2xl shadow-xl">
                          📞
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">FaceTime Call Screen Generator</h2>
          <p className="text-xs text-slate-500">Create iOS FaceTime call screens for incoming or active calls.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Caller Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="John Doe" />
            </Field>
            <Field label="Call Status">
              <TextInput value={callStatus} onChange={setStatusText} placeholder="FaceTime Video..." />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Call Duration">
              <TextInput value={duration} onChange={setDuration} placeholder="03:42" />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={isIncoming} onChange={setIsIncoming} label="Incoming Call Screen" />
            </div>
          </div>

          <Field label="Caller Photo">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
