"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function SnapchatChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("jake_snap");
  const [snapStreak, setSnapStreak] = useState("🔥 142");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Did you keep our streak going today?", time: "2m ago" },
    { id: "2", side: "out", text: "Yup! Just sent you a snap 📸", time: "1m ago" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("Just now");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "Just now",
    };
    setMessages([...messages, msg]);
    setNewText("");
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Snapchat Preview</h3>
            <Btn onClick={() => exportPng("snapchat-chat.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex justify-center">
            <ChatPhone
              header={{
                name: `${contactName} ${snapStreak}`,
                status: "Snapchat Chat",
                avatar: avatar,
              }}
              messages={messages}
              darkMode={darkMode}
              headerBg={darkMode ? "#121212" : "#FFFC00"}
              headerTextColor={darkMode ? "#FFFC00" : "#000000"}
              chatBg={darkMode ? "#000000" : "#ffffff"}
              inBubbleBg={darkMode ? "#1c1c1e" : "#f1f5f9"}
              inBubbleText={darkMode ? "#ffffff" : "#0f172a"}
              outBubbleBg="#00b2ff"
              outBubbleText="#ffffff"
              borderRadius="16px"
              showStatusTicks={false}
              footerInputPlaceholder="Send a Snap..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Snapchat Chat Generator</h2>
          <p className="text-xs text-slate-500">Create Snapchat chat mockups with streak icons and Bitmojis.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Friend Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Snap Username">
              <TextInput value={contactName} onChange={setContactName} placeholder="jake_snap" />
            </Field>
            <Field label="Streak / Subtitle">
              <TextInput value={snapStreak} onChange={setSnapStreak} placeholder="🔥 142" />
            </Field>
          </div>

          <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />

          <Field label="Bitmoji / Avatar">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload Bitmoji photo" />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Message</h3>
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

            <Field label="Time Tag">
              <TextInput value={newTime} onChange={setNewTime} placeholder="Just now" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message..." />
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
