"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function AndroidTextMessageGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Marcus Vance");
  const [status, setStatus] = useState("RCS Chat");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Hey! Are you free for a call?", time: "5:10 PM" },
    { id: "2", side: "out", text: "Sure, calling you now!", time: "5:11 PM", status: "read" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("5:12 PM");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "5:12 PM",
      status: "read",
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Android SMS Preview</h3>
            <Btn onClick={() => exportPng("android-text-message.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex justify-center">
            <ChatPhone
              header={{
                name: contactName,
                status: status,
                avatar: avatar,
              }}
              messages={messages}
              darkMode={darkMode}
              headerBg={darkMode ? "#1f1f1f" : "#ffffff"}
              headerTextColor={darkMode ? "#ffffff" : "#0f172a"}
              chatBg={darkMode ? "#121212" : "#ffffff"}
              inBubbleBg={darkMode ? "#303134" : "#f1f3f4"}
              inBubbleText={darkMode ? "#e8eaed" : "#202124"}
              outBubbleBg="#0B93F6"
              outBubbleText="#ffffff"
              borderRadius="18px"
              showStatusTicks={false}
              footerInputPlaceholder="Text message (RCS)..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Android Text Message Generator</h2>
          <p className="text-xs text-slate-500">Create Material / Google Messages RCS & SMS mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="Marcus Vance" />
            </Field>
            <Field label="Subtitle / Network">
              <TextInput value={status} onChange={setStatus} placeholder="RCS Chat" />
            </Field>
          </div>

          <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />

          <Field label="Contact Photo">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
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
              <TextInput value={newTime} onChange={setNewTime} placeholder="5:12 PM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter SMS text..." />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Android Message
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
