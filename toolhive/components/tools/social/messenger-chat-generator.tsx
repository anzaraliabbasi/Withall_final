"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, Select, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function MessengerChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("David Miller");
  const [status, setStatus] = useState("Active 5m ago");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState("#0084FF");

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Hey! Did you check out the new Messenger theme?", time: "3:15 PM" },
    { id: "2", side: "out", text: "Yes! Looks super slick with the gradients 🔥", time: "3:16 PM" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("3:17 PM");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "3:17 PM",
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Messenger Preview</h3>
            <Btn onClick={() => exportPng("messenger-chat.png")}>Download PNG</Btn>
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
              headerBg={darkMode ? "#242526" : "#ffffff"}
              headerTextColor={darkMode ? "#ffffff" : "#0f172a"}
              chatBg={darkMode ? "#18191a" : "#ffffff"}
              inBubbleBg={darkMode ? "#3a3b3c" : "#e4e6eb"}
              inBubbleText={darkMode ? "#e4e6eb" : "#050505"}
              outBubbleBg={themeColor}
              outBubbleText="#ffffff"
              borderRadius="18px"
              showStatusTicks={false}
              footerInputPlaceholder="Aa..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Messenger Chat Generator</h2>
          <p className="text-xs text-slate-500">Create Facebook Messenger chat mockups with custom themes.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Profile & Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="David Miller" />
            </Field>
            <Field label="Active Status">
              <TextInput value={status} onChange={setStatus} placeholder="Active 5m ago" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Theme Color">
              <Select
                value={themeColor}
                onChange={setThemeColor}
                options={[
                  { value: "#0084FF", label: "Classic Messenger Blue" },
                  { value: "#a033ff", label: "Purple / Pink Gradient" },
                  { value: "#00C6FF", label: "Cyan Ocean" },
                  { value: "#FF007F", label: "Cyberpunk Pink" },
                ]}
              />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            </div>
          </div>

          <Field label="Profile Photo">
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

            <Field label="Time">
              <TextInput value={newTime} onChange={setNewTime} placeholder="3:17 PM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
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
