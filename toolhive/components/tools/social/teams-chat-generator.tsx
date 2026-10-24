"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function TeamsChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Product Team");
  const [status, setStatus] = useState("Available");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Good morning team! Standup meeting starts in 10 minutes.", time: "8:50 AM", sender: "Sarah Connor", senderColor: "#6264A7" },
    { id: "2", side: "out", text: "Got it! Joining the call now.", time: "8:52 AM" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("8:53 AM");
  const [newSender, setNewSender] = useState("Sarah Connor");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "8:53 AM",
      sender: newSide === "in" ? newSender : undefined,
      senderColor: "#6264A7",
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">MS Teams Preview</h3>
            <Btn onClick={() => exportPng("teams-chat.png")}>Download PNG</Btn>
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
              headerBg="#6264A7"
              headerTextColor="#FFFFFF"
              chatBg={darkMode ? "#1f1f1f" : "#f5f5f5"}
              inBubbleBg={darkMode ? "#292929" : "#ffffff"}
              inBubbleText={darkMode ? "#ffffff" : "#242424"}
              outBubbleBg="#6264A7"
              outBubbleText="#ffffff"
              borderRadius="10px"
              isGroup={true}
              showStatusTicks={false}
              footerInputPlaceholder="Type a new message..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Microsoft Teams Chat Generator</h2>
          <p className="text-xs text-slate-500">Create Microsoft Teams work chat mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chat Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact / Channel">
              <TextInput value={contactName} onChange={setContactName} placeholder="Product Team" />
            </Field>
            <Field label="Status">
              <TextInput value={status} onChange={setStatus} placeholder="Available" />
            </Field>
          </div>

          <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />

          <Field label="Avatar Image">
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
              <TextInput value={newTime} onChange={setNewTime} placeholder="8:53 AM" />
            </Field>
          </div>

          {newSide === "in" && (
            <Field label="Sender Name">
              <TextInput value={newSender} onChange={setNewSender} placeholder="Sarah Connor" />
            </Field>
          )}

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Teams Message
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
