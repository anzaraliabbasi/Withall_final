"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, FileDrop, PhoneFrame, useMockupExport } from "@/components/ui/kit";

interface DiscordMsg {
  id: string;
  username: string;
  roleColor: string;
  avatar?: string;
  time: string;
  text: string;
  bot?: boolean;
  image?: string;
}

export default function DiscordMessageGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [channelName, setChannelName] = useState("general");
  const [serverName, setServerName] = useState("Developer Hub");

  const [messages, setMessages] = useState<DiscordMsg[]>([
    {
      id: "1",
      username: "DevAdmin",
      roleColor: "#f1c40f",
      time: "Today at 2:15 PM",
      text: "Hey everyone! Welcome to the new server.",
    },
    {
      id: "2",
      username: "BotAssistant",
      roleColor: "#5865f2",
      time: "Today at 2:16 PM",
      text: "System initialized successfully. All systems operational.",
      bot: true,
    },
  ]);

  const [newUsername, setNewUsername] = useState("AlexCode");
  const [newRoleColor, setNewRoleColor] = useState("#eb459e");
  const [newTime, setNewTime] = useState("Today at 2:18 PM");
  const [newText, setNewText] = useState("");
  const [newIsBot, setNewIsBot] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: DiscordMsg = {
      id: Date.now().toString(),
      username: newUsername,
      roleColor: newRoleColor,
      time: newTime || "Today at 2:18 PM",
      text: newText,
      bot: newIsBot,
      avatar: newAvatar || undefined,
    };
    setMessages([...messages, msg]);
    setNewText("");
  };

  const handleAvatarUpload = (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setNewAvatar(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Discord Preview</h3>
            <Btn onClick={() => exportPng("discord-message.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div className="flex flex-col h-[580px] bg-[#313338] text-slate-100 font-sans select-none">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2b2d31] border-b border-[#1f2023] shrink-0">
                  <span className="text-[#80848e] text-lg font-bold">#</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">{channelName}</span>
                    <span className="text-[10px] text-[#949ba4]">{serverName}</span>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="flex items-start gap-3 hover:bg-[#2e3035] p-1.5 rounded transition">
                      <div className="w-9 h-9 rounded-full bg-[#5865f2] flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
                        {m.avatar ? (
                          <img src={m.avatar} alt={m.username} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                        ) : (
                          m.username[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs" style={{ color: m.roleColor }}>
                            {m.username}
                          </span>
                          {m.bot && (
                            <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1 rounded uppercase">
                              BOT
                            </span>
                          )}
                          <span className="text-[10px] text-[#949ba4]">{m.time}</span>
                        </div>
                        <div className="text-xs text-[#dbdee1] mt-0.5 whitespace-pre-wrap break-words leading-relaxed">
                          {m.text}
                        </div>
                        {m.image && (
                          <img src={m.image} alt="Attachment" className="mt-2 rounded-lg max-w-full h-auto max-h-48 border border-[#1f2023]"  loading="lazy" decoding="async" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#313338] shrink-0">
                  <div className="bg-[#383a40] px-3 py-2 rounded-lg text-xs text-[#949ba4]">
                    Message #{channelName}
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Discord Message Generator</h2>
          <p className="text-xs text-slate-500">Create Discord channel messages with role colors and bot badges.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Channel Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Channel Name">
              <TextInput value={channelName} onChange={setChannelName} placeholder="general" />
            </Field>
            <Field label="Server Name">
              <TextInput value={serverName} onChange={setServerName} placeholder="Developer Hub" />
            </Field>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Message</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username">
              <TextInput value={newUsername} onChange={setNewUsername} placeholder="AlexCode" />
            </Field>
            <Field label="Role Color (Hex)">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <TextInput value={newRoleColor} onChange={setNewRoleColor} placeholder="#eb459e" />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Timestamp">
              <TextInput value={newTime} onChange={setNewTime} placeholder="Today at 2:18 PM" />
            </Field>
            <div className="flex items-end pb-2">
              <button
                type="button"
                onClick={() => setNewIsBot(!newIsBot)}
                className={`text-xs px-3 py-1.5 rounded font-semibold border ${newIsBot ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"}`}
              >
                {newIsBot ? "BOT Badge ON" : "BOT Badge OFF"}
              </button>
            </div>
          </div>

          <Field label="Message Content">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
          </Field>

          <Field label="User Avatar">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Discord Message
          </Btn>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Messages ({messages.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border text-xs">
                <span><strong style={{ color: m.roleColor }}>{m.username}:</strong> {m.text}</span>
                <button type="button" onClick={() => setMessages(messages.filter((x) => x.id !== m.id))} className="text-rose-500 font-bold">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
