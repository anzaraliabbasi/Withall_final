"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, PhoneFrame, useMockupExport } from "@/components/ui/kit";
import { PhoneStatusBar } from "./_chat";

export default function WhatsappCallScreenGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Alex Rivers");
  const [callStatus, setCallStatus] = useState("05:12");
  const [isVoiceCall, setIsVoiceCall] = useState(true);
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">WhatsApp Call Preview</h3>
            <Btn onClick={() => exportPng("whatsapp-call.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div
                className="flex flex-col h-[580px] text-white font-sans select-none relative overflow-hidden justify-between p-4"
                style={{ background: "linear-gradient(180deg, #075E54 0%, #0b141a 100%)" }}
              >
                <PhoneStatusBar dark={true} bg="transparent" />

                {/* Encryption Header */}
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-300/80 pt-2 font-medium">
                  <span>🔒 End-to-end encrypted</span>
                </div>

                {/* Main Caller Area */}
                <div className="flex flex-col items-center justify-center my-auto space-y-4">
                  <div className="w-28 h-28 rounded-full border-4 border-emerald-500/30 shadow-2xl overflow-hidden bg-emerald-800 flex items-center justify-center text-3xl font-bold">
                    {avatar ? (
                      <img src={avatar} alt={contactName} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                    ) : (
                      contactName[0]?.toUpperCase() || "?"
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{contactName}</h2>
                    <p className="text-xs text-emerald-200/90 font-medium">
                      {isVoiceCall ? "WhatsApp Voice Call" : "WhatsApp Video Call"} • {callStatus}
                    </p>
                  </div>
                </div>

                {/* Call Control Buttons Bar */}
                <div className="pb-8 bg-black/20 backdrop-blur-md rounded-3xl p-4 border border-white/10">
                  <div className="flex items-center justify-around">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                      🔊
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                      📹
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">WhatsApp Call Screen Generator</h2>
          <p className="text-xs text-slate-500">Create WhatsApp voice or video call screen mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Call Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="Alex Rivers" />
            </Field>
            <Field label="Call Status / Timer">
              <TextInput value={callStatus} onChange={setCallStatus} placeholder="05:12" />
            </Field>
          </div>

          <Toggle checked={isVoiceCall} onChange={setIsVoiceCall} label="Voice Call (vs Video Call)" />

          <Field label="Contact Avatar">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
