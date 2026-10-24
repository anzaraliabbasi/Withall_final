"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function WhatsAppChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [contactName, setContactName] = useState("Alex Rivers");
  const [status, setStatus] = useState("online");
  const [avatar, setAvatar] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Message list state
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "Hey! Did you check out the new design system?", time: "10:14 AM", sender: "Alex" },
    { id: "2", side: "out", text: "Yes! Looks super clean. Love the amber accent color 🚀", time: "10:15 AM", status: "read" },
    { id: "3", side: "in", text: "Awesome! Let's get the chat generator built.", time: "10:16 AM", sender: "Alex", reaction: "👍" },
  ]);

  // New message form state
  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newSender, setNewSender] = useState("Sarah");
  const [newTime, setNewTime] = useState("10:17 AM");
  const [newStatus, setNewStatus] = useState<"sent" | "delivered" | "read">("read");
  const [newReaction, setNewReaction] = useState("");
  const [newVoiceSec, setNewVoiceSec] = useState("");

  const handleAddMessage = () => {
    if (!newText && !newVoiceSec) return;
    const voiceDuration = newVoiceSec ? parseInt(newVoiceSec, 10) : undefined;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "10:18 AM",
      sender: isGroup && newSide === "in" ? newSender : undefined,
      senderColor: "#00a884",
      status: newStatus,
      reaction: newReaction || undefined,
      voice: voiceDuration,
    };
    setMessages([...messages, msg]);
    setNewText("");
    setNewReaction("");
    setNewVoiceSec("");
  };

  const handleRemoveMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleAvatarUpload = (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleImageUploadForMsg = (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const msg: ChatMsg = {
          id: Date.now().toString(),
          side: newSide,
          text: newText || "Sent an image",
          time: newTime || "10:18 AM",
          image: dataUrl,
          status: newStatus,
        };
        setMessages([...messages, msg]);
        setNewText("");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">WhatsApp Preview</h3>
            <Btn onClick={() => exportPng("whatsapp-chat.png")}>Download PNG</Btn>
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
              headerBg={darkMode ? "#1f2c34" : "#075E54"}
              headerTextColor="#FFFFFF"
              chatBg={darkMode ? "#0b141a" : "#ECE5DD"}
              inBubbleBg={darkMode ? "#202c33" : "#FFFFFF"}
              inBubbleText={darkMode ? "#e9edef" : "#0f172a"}
              outBubbleBg={darkMode ? "#005c4b" : "#DCF8C6"}
              outBubbleText={darkMode ? "#e9edef" : "#0f172a"}
              isGroup={isGroup}
              footerInputPlaceholder="Message"
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">WhatsApp Chat Generator</h2>
          <p className="text-xs text-slate-500">Create realistic WhatsApp chat mockups with dark mode and group support.</p>
        </div>

        {/* Chat Settings */}
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chat Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact / Group Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="Alex Rivers" />
            </Field>
            <Field label="Subtitle / Status">
              <TextInput value={status} onChange={setStatus} placeholder="online" />
            </Field>
          </div>

          <div className="flex items-center gap-6">
            <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            <Toggle checked={isGroup} onChange={setIsGroup} label="Group Chat Mode" />
          </div>

          <Field label="Avatar Image">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>

        {/* Add Message */}
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Message</h3>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Message Side">
              <div className="flex gap-2">
                <Btn
                  variant={newSide === "in" ? "primary" : "outline"}
                  onClick={() => setNewSide("in")}
                  className="flex-1 !py-1.5 !text-xs"
                >
                  Incoming
                </Btn>
                <Btn
                  variant={newSide === "out" ? "primary" : "outline"}
                  onClick={() => setNewSide("out")}
                  className="flex-1 !py-1.5 !text-xs"
                >
                  Outgoing
                </Btn>
              </div>
            </Field>

            <Field label="Time">
              <TextInput value={newTime} onChange={setNewTime} placeholder="10:17 AM" />
            </Field>
          </div>

          {isGroup && newSide === "in" && (
            <Field label="Sender Name">
              <TextInput value={newSender} onChange={setNewSender} placeholder="Sarah" />
            </Field>
          )}

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Type a message..." />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Reaction Emoji">
              <TextInput value={newReaction} onChange={setNewReaction} placeholder="👍" />
            </Field>
            <Field label="Voice Note (sec)">
              <TextInput value={newVoiceSec} onChange={setNewVoiceSec} placeholder="15" type="number" />
            </Field>
            {newSide === "out" && (
              <Field label="Status Ticks">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "sent" | "delivered" | "read")}
                  className="input-base text-xs"
                >
                  <option value="sent">Sent (1 tick)</option>
                  <option value="delivered">Delivered (2 gray)</option>
                  <option value="read">Read (2 blue)</option>
                </select>
              </Field>
            )}
          </div>

          <div className="flex gap-3">
            <Btn onClick={handleAddMessage} className="flex-1">
              Add Message
            </Btn>
          </div>

          <Field label="Or Upload Image as Message">
            <FileDrop onFiles={handleImageUploadForMsg} accept="image/*" label="Drop image here to add as chat photo" />
          </Field>
        </div>

        {/* Existing Messages list */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Messages ({messages.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {messages.map((m, idx) => (
              <div key={m.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="truncate flex-1 pr-2">
                  <span className={`font-semibold mr-2 ${m.side === "out" ? "text-emerald-600" : "text-blue-600"}`}>
                    [{m.side.toUpperCase()}]
                  </span>
                  <span>{m.text || (m.image ? "[Image]" : m.voice ? `[Voice Note ${m.voice}s]` : "")}</span>
                  <span className="text-slate-400 text-[10px] ml-2">({m.time})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMessage(m.id)}
                  className="text-rose-500 hover:text-rose-700 font-bold text-sm px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
