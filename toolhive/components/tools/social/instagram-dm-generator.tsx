"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function InstagramDmGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("emily_creator");
  const [status, setStatus] = useState("Active 1h ago");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [verified, setVerified] = useState(true);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Loved your latest reel! The edits were insane 🔥", time: "4:20 PM", reaction: "❤️" },
    { id: "2", side: "out", text: "Thank you so much! Really appreciate it 🙏", time: "4:22 PM" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("4:23 PM");
  const [newReaction, setNewReaction] = useState("");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "4:23 PM",
      reaction: newReaction || undefined,
    };
    setMessages([...messages, msg]);
    setNewText("");
    setNewReaction("");
  };

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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Instagram DM Preview</h3>
            <Btn onClick={() => exportPng("instagram-dm.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex justify-center">
            <ChatPhone
              header={{
                name: contactName,
                status: status,
                avatar: avatar,
                verified: verified,
              }}
              messages={messages}
              darkMode={darkMode}
              headerBg={darkMode ? "#000000" : "#ffffff"}
              headerTextColor={darkMode ? "#ffffff" : "#000000"}
              chatBg={darkMode ? "#000000" : "#ffffff"}
              inBubbleBg={darkMode ? "#262626" : "#efefef"}
              inBubbleText={darkMode ? "#ffffff" : "#000000"}
              outBubbleBg="#3797f0"
              outBubbleText="#ffffff"
              borderRadius="22px"
              showStatusTicks={false}
              footerInputPlaceholder="Message..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Instagram DM Generator</h2>
          <p className="text-xs text-slate-500">Create realistic Instagram Direct Message mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username">
              <TextInput value={contactName} onChange={setContactName} placeholder="emily_creator" />
            </Field>
            <Field label="Status">
              <TextInput value={status} onChange={setStatus} placeholder="Active 1h ago" />
            </Field>
          </div>

          <div className="flex items-center gap-6">
            <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            <Toggle checked={verified} onChange={setVerified} label="Verified Badge" />
          </div>

          <Field label="Profile Avatar">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add DM</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Side">
              <div className="flex gap-2">
                <Btn variant={newSide === "in" ? "primary" : "outline"} onClick={() => setNewSide("in")} className="flex-1 !py-1.5 !text-xs">
                  Incoming
                </Btn>
                <Btn variant={newSide === "out" ? "primary" : "outline"} onClick={() => setNewSide("out")} className="flex-1 !py-1.5 !text-xs">
                  Outgoing
                </Btn>
              </div>
            </Field>

            <Field label="Time">
              <TextInput value={newTime} onChange={setNewTime} placeholder="4:23 PM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message..." />
          </Field>

          <Field label="Reaction Emoji (e.g. ❤️)">
            <TextInput value={newReaction} onChange={setNewReaction} placeholder="❤️" />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Message
          </Btn>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Messages ({messages.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border text-xs">
                <span>{m.text}</span>
                <button type="button" onClick={() => setMessages(messages.filter((x) => x.id !== m.id))} className="text-rose-500 font-bold">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
