"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, Toggle, FileDrop, ColorInput, Range, useMockupExport } from "@/components/ui/kit";
import { ChatPhone, ChatMsg } from "./_chat";

export default function FakeChatGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [platformName, setPlatformName] = useState("Custom Messenger");
  const [contactName, setContactName] = useState("Jane Doe");
  const [status, setStatus] = useState("Online");
  const [avatar, setAvatar] = useState("");

  // Styling custom controls
  const [headerBg, setHeaderBg] = useState("#4f46e5");
  const [headerText, setHeaderText] = useState("#ffffff");
  const [chatBg, setChatBg] = useState("#f1f5f9");
  const [inBg, setInBg] = useState("#ffffff");
  const [inText, setInText] = useState("#0f172a");
  const [outBg, setOutBg] = useState("#6366f1");
  const [outText, setOutText] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "1", side: "in", text: "This is a completely custom chat interface!", time: "1:00 PM" },
    { id: "2", side: "out", text: "You can tweak all colors, border radius, and texts 🎨", time: "1:01 PM" },
  ]);

  const [newText, setNewText] = useState("");
  const [newSide, setNewSide] = useState<"in" | "out">("out");
  const [newTime, setNewTime] = useState("1:02 PM");

  const handleAddMessage = () => {
    if (!newText) return;
    const msg: ChatMsg = {
      id: Date.now().toString(),
      side: newSide,
      text: newText,
      time: newTime || "1:02 PM",
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Custom Chat Preview</h3>
            <Btn onClick={() => exportPng("fake-chat.png")}>Download PNG</Btn>
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
              headerBg={headerBg}
              headerTextColor={headerText}
              chatBg={chatBg}
              inBubbleBg={inBg}
              inBubbleText={inText}
              outBubbleBg={outBg}
              outBubbleText={outText}
              borderRadius={`${borderRadius}px`}
              platformName={platformName}
              footerInputPlaceholder="Write something custom..."
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Fake Chat Generator</h2>
          <p className="text-xs text-slate-500">Fully customizable chat generator — create your own messaging app mockup.</p>
        </div>

        {/* Brand & Contact Info */}
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Basic Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform Name">
              <TextInput value={platformName} onChange={setPlatformName} placeholder="Custom Messenger" />
            </Field>
            <Field label="Contact Name">
              <TextInput value={contactName} onChange={setContactName} placeholder="Jane Doe" />
            </Field>
          </div>
          <Field label="Status Text">
            <TextInput value={status} onChange={setStatus} placeholder="Online" />
          </Field>
          <Field label="Avatar Image">
            <FileDrop onFiles={handleAvatarUpload} accept="image/*" label="Upload profile photo" />
          </Field>
        </div>

        {/* Styling Customization */}
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Colors & Styles</h3>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Header Background">
              <ColorInput value={headerBg} onChange={setHeaderBg} />
            </Field>
            <Field label="Header Text Color">
              <ColorInput value={headerText} onChange={setHeaderText} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Chat Background">
              <ColorInput value={chatBg} onChange={setChatBg} />
            </Field>
            <Field label="Bubble Border Radius">
              <Range value={borderRadius} onChange={setBorderRadius} min={0} max={28} suffix="px" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Incoming Bubble Bg">
              <ColorInput value={inBg} onChange={setInBg} />
            </Field>
            <Field label="Incoming Text Color">
              <ColorInput value={inText} onChange={setInText} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Outgoing Bubble Bg">
              <ColorInput value={outBg} onChange={setOutBg} />
            </Field>
            <Field label="Outgoing Text Color">
              <ColorInput value={outText} onChange={setOutText} />
            </Field>
          </div>

          <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode Elements" />
        </div>

        {/* Add Message */}
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
              <TextInput value={newTime} onChange={setNewTime} placeholder="1:02 PM" />
            </Field>
          </div>

          <Field label="Message Text">
            <TextInput value={newText} onChange={setNewText} placeholder="Enter message text..." />
          </Field>

          <Btn onClick={handleAddMessage} className="w-full">
            Add Message
          </Btn>
        </div>

        {/* Existing Messages list */}
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
