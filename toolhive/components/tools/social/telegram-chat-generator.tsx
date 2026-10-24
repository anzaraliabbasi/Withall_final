"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function TelegramChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Telegram Channel");
  const [status, setStatus] = useState("128,400 subscribers");
  const [avatar, setAvatar] = useState("");
  const [verified, setVerified] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Welcome to our official Telegram channel! 🎉", time: "11:00 AM" },
    { id: "2", side: "out", text: "Awesome updates coming soon!", time: "11:02 AM", status: "read", reaction: "🔥" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("in");
  const [newTime, setNewTime] = useState("11:05 AM");
  const [newReaction, setNewReaction] = useState("");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "11:05 AM",
      status: "read",
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Telegram Preview</h3>
            <Btn onClick={() => exportPng("telegram-chat.png")}>Download PNG</Btn>
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
              headerBg={darkMode ? "#17212b" : "#517da2"}
              headerTextColor="#FFFFFF"
              chatBg={darkMode ? "#0e1621" : "#7293b2"}
              inBubbleBg={darkMode ? "#18222d" : "#FFFFFF"}
              inBubbleText={darkMode ? "#f5f5f5" : "#0f172a"}
              outBubbleBg={darkMode ? "#2b5278" : "#EFFDDE"}
              outBubbleText={darkMode ? "#f5f5f5" : "#0f172a"}
              borderRadius="12px"
              footerInputPlaceholder="Broadcast message..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Telegram Chat Generator</h2>
          <p className="text-xs text-slate-500">Generate Telegram chats, channel broadcasts, and messages.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Channel / User Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name / Title">
              <TextInput value={contactName} onChange={setContactName} placeholder="Telegram Channel" />
            </Field>
            <Field label="Subscribers / Status">
              <TextInput value={status} onChange={setStatus} placeholder="128k subscribers" />
            </Field>
          </div>

          <div className="flex items-center gap-6">
            <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            <Toggle checked={verified} onChange={setVerified} label="Verified Badge" />
          </div>

          <Field label="Avatar Image">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload channel icon" />
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

            <Field label="Timestamp">
              <TextInput value={newTime} onChange={setNewTime} placeholder="11:05 AM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
          </Field>

          <Field label="Reaction Emoji">
            <TextInput value={newReaction} onChange={setNewReaction} placeholder="🔥" />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Telegram Message
          </Btn>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Messages ({messages.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {messages.map((m, idx) => (
              <div key={m.id || idx} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border text-xs">
                <span>{m.text} ({m.time})</span>
                <button type="button" onClick={() => setMessages(messages.filter((x) => x.id !== m.id))} className="text-rose-500 font-bold">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
