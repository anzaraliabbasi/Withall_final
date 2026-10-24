"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, TextArea, Toggle, Select, PhoneFrame, useMockupExport } from "@/components/ui/kit";

interface GptTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatGptConversationGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [model, setModel] = useState("ChatGPT 4o");
  const [darkMode, setDarkMode] = useState(true);

  const [turns, setTurns] = useState<GptTurn[]>([
    {
      id: "1",
      role: "user",
      content: "Can you explain how Next.js 15 App Router handles server components?",
    },
    {
      id: "2",
      role: "assistant",
      content:
        "In Next.js 15, React Server Components (RSC) are enabled by default. Server components render strictly on the server and send lightweight HTML to the client without adding client JavaScript bundle size.\n\nUse **`use client`** at the top of a file only when you need interactivity or React hooks!",
    },
  ]);

  const [newRole, setNewRole] = useState<"user" | "assistant">("user");
  const [newContent, setNewContent] = useState("");

  const handleAddTurn = () => {
    if (!newContent) return;
    setTurns([...turns, { id: Date.now().toString(), role: newRole, content: newContent }]);
    setNewContent("");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">ChatGPT Preview</h3>
            <Btn onClick={() => exportPng("chatgpt-conversation.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div
                className="flex flex-col h-[580px] font-sans select-none"
                style={{
                  backgroundColor: darkMode ? "#212121" : "#ffffff",
                  color: darkMode ? "#ececec" : "#0d0d0d",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b shrink-0 font-semibold text-xs"
                  style={{
                    backgroundColor: darkMode ? "#171717" : "#f9f9f9",
                    borderColor: darkMode ? "#2f2f2f" : "#e5e5e5",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{model}</span>
                    <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                  <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">
                    ⚙️
                  </div>
                </div>

                {/* Conversation Turns */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
                  {turns.map((t) =>
                    t.role === "user" ? (
                      <div key={t.id} className="flex justify-end">
                        <div
                          className="px-3.5 py-2.5 rounded-2xl max-w-[85%] font-normal whitespace-pre-wrap"
                          style={{
                            backgroundColor: darkMode ? "#303030" : "#f4f4f4",
                            color: darkMode ? "#ffffff" : "#0f172a",
                          }}
                        >
                          {t.content}
                        </div>
                      </div>
                    ) : (
                      <div key={t.id} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] shrink-0 font-bold">
                          ✨
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="font-semibold text-[11px] opacity-70">ChatGPT</div>
                          <div className="whitespace-pre-wrap break-words">{t.content}</div>
                          <div className="flex items-center gap-3 pt-1 text-[10px] opacity-40">
                            <span>📋 Copy</span>
                            <span>👍</span>
                            <span>👎</span>
                            <span>🔄</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Input Prompt Box */}
                <div className="p-3 shrink-0">
                  <div
                    className="px-3 py-2 rounded-2xl border text-xs flex items-center justify-between"
                    style={{
                      backgroundColor: darkMode ? "#2f2f2f" : "#f4f4f4",
                      borderColor: darkMode ? "#383838" : "#e5e5e5",
                      color: darkMode ? "#8e8e8e" : "#8e8e8e",
                    }}
                  >
                    <span>Message ChatGPT...</span>
                    <div className="w-6 h-6 rounded-full bg-slate-500/30 flex items-center justify-center text-xs">
                      ↑
                    </div>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">ChatGPT Conversation Generator</h2>
          <p className="text-xs text-slate-500">Create clean OpenAI ChatGPT conversation mockups.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Model Selector">
              <Select
                value={model}
                onChange={setModel}
                options={[
                  { value: "ChatGPT 4o", label: "ChatGPT 4o" },
                  { value: "ChatGPT 4o-mini", label: "ChatGPT 4o-mini" },
                  { value: "o1-preview", label: "o1-preview" },
                  { value: "ChatGPT 3.5", label: "ChatGPT 3.5" },
                ]}
              />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Turn</h3>
          <Field label="Role">
            <div className="flex gap-2">
              <Btn variant={newRole === "user" ? "primary" : "outline"} onClick={() => setNewRole("user")} className="flex-1 !py-1.5 !text-xs">
                User
              </Btn>
              <Btn variant={newRole === "assistant" ? "primary" : "outline"} onClick={() => setNewRole("assistant")} className="flex-1 !py-1.5 !text-xs">
                Assistant (ChatGPT)
              </Btn>
            </div>
          </Field>

          <Field label="Content">
            <TextArea value={newContent} onChange={setNewContent} placeholder="Enter message text..." rows={3} />
          </Field>

          <Btn onClick={handleAddTurn} className="w-full">
            Add Turn
          </Btn>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Turns ({turns.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {turns.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border text-xs">
                <span><strong>{t.role.toUpperCase()}:</strong> {t.content.slice(0, 40)}...</span>
                <button type="button" onClick={() => setTurns(turns.filter((x) => x.id !== t.id))} className="text-rose-500 font-bold">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
