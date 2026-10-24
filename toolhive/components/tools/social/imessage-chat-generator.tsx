"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function IMessageChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Sarah Jenkins");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [useSmsGreen, setUseSmsGreen] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Are we still on for lunch today?", time: "12:30 PM" },
    { id: "2", side: "out", text: "Yes! Let's meet at 1:00 PM.", time: "12:31 PM", isSms: false },
    { id: "3", side: "out", text: "Sounds good, see you there!", time: "12:32 PM", isSms: false },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("12:33 PM");
  const [newIsSms, setNewIsSms] = useState(false);

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "12:33 PM",
      isSms: newIsSms || useSmsGreen,
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">iMessage Preview</h3>
            <Btn onClick={() => exportPng("imessage-chat.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex justify-center">
            <ChatPhone
              header={{
                name: contactName,
                status: "iMessage",
                avatar: avatar,
              }}
              messages={messages}
              darkMode={darkMode}
              headerBg={darkMode ? "#1c1c1e" : "#f6f6f6"}
              headerTextColor={darkMode ? "#ffffff" : "#000000"}
              chatBg={darkMode ? "#000000" : "#ffffff"}
              inBubbleBg={darkMode ? "#26262a" : "#E9E9EB"}
              inBubbleText={darkMode ? "#ffffff" : "#000000"}
              outBubbleBg={useSmsGreen ? "#34C759" : "#007AFF"}
              outBubbleText="#ffffff"
              borderRadius="18px"
              showStatusTicks={false}
              footerInputPlaceholder={useSmsGreen ? "Text Message (SMS)" : "iMessage"}
              renderCustomBubble={(msg) => {
                const isOut = msg.side === "out";
                const isGreen = msg.isSms || useSmsGreen;
                const bubbleBg = isOut ? (isGreen ? "#34C759" : "#007AFF") : darkMode ? "#26262a" : "#E9E9EB";
                const textColor = isOut ? "#ffffff" : darkMode ? "#ffffff" : "#000000";

                return (
                  <div key={msg.id} className={`flex flex-col my-1 ${isOut ? "items-end" : "items-start"}`}>
                    <div
                      className="px-4 py-2 text-xs rounded-2xl max-w-[78%] leading-relaxed"
                      style={{ backgroundColor: bubbleBg, color: textColor }}
                    >
                      {msg.text}
                    </div>
                    {isOut && (
                      <span className="text-[9px] text-slate-400 mt-0.5 mr-1 font-sans">
                        {isGreen ? "Sent as Text Message" : "Delivered"}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">iMessage Chat Generator</h2>
          <p className="text-xs text-slate-500">Create iOS style iMessage (blue) or SMS (green) conversations.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settings</h3>
          <Field label="Contact Name">
            <TextInput value={contactName} onChange={setContactName} placeholder="Sarah Jenkins" />
          </Field>

          <div className="flex items-center gap-6">
            <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            <Toggle checked={useSmsGreen} onChange={setUseSmsGreen} label="Green SMS Mode" />
          </div>

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
              <TextInput value={newTime} onChange={setNewTime} placeholder="12:33 PM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
          </Field>

          {newSide === "out" && (
            <Toggle checked={newIsSms} onChange={setNewIsSms} label="Send as Green SMS" />
          )}

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
