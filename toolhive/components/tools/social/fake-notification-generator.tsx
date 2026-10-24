"use client";

import React, { useState } from "react";
import { ToolShell, Field, Btn, TextInput, TextArea, Toggle, Select, FileDrop, PhoneFrame, useMockupExport } from "@/components/ui/kit";

interface NotificationItem {
  id: string;
  appName: string;
  appIcon: string;
  title: string;
  body: string;
  time: string;
}

export default function FakeNotificationGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [style, setStyle] = useState<"ios" | "android">("ios");
  const [wallpaperBg, setWallpaperBg] = useState("linear-gradient(135deg, #2b5876 0%, #4e4376 100%)");
  const [lockTime, setLockTime] = useState("9:41");
  const [lockDate, setLockDate] = useState("Thursday, October 22");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      appName: "WhatsApp",
      appIcon: "💬",
      title: "Alex Rivers",
      body: "Hey! Did you check out the new design mockup?",
      time: "now",
    },
    {
      id: "2",
      appName: "Instagram",
      appIcon: "📸",
      title: "emily_creator liked your photo",
      body: "See all reactions and comments on your recent story.",
      time: "5m ago",
    },
  ]);

  const [newAppName, setNewAppName] = useState("Messages");
  const [newAppIcon, setNewAppIcon] = useState("💬");
  const [newTitle, setNewTitle] = useState("Sarah Jenkins");
  const [newBody, setNewBody] = useState("Are we still meeting for coffee today?");
  const [newTime, setNewTime] = useState("2m ago");

  const handleAddNotif = () => {
    if (!newTitle) return;
    setNotifications([
      ...notifications,
      {
        id: Date.now().toString(),
        appName: newAppName,
        appIcon: newAppIcon,
        title: newTitle,
        body: newBody,
        time: newTime || "now",
      },
    ]);
    setNewTitle("");
    setNewBody("");
  };

  return (
    <ToolShell
      side={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Notification Preview</h3>
            <Btn onClick={() => exportPng("fake-notification.png")}>Download PNG</Btn>
          </div>

          <div ref={exportRef} className="p-4 bg-slate-900 rounded-2xl flex justify-center">
            <PhoneFrame width={380}>
              <div
                className="flex flex-col h-[580px] font-sans select-none text-white relative overflow-hidden p-4 justify-between"
                style={{ background: wallpaperBg }}
              >
                {/* Lockscreen Clock */}
                <div className="text-center pt-8 space-y-1">
                  <div className="text-[11px] font-medium tracking-wide uppercase opacity-90">{lockDate}</div>
                  <div className="text-5xl font-extrabold tracking-tight">{lockTime}</div>
                </div>

                {/* Notifications Stack */}
                <div className="space-y-3 my-auto z-10 max-h-[380px] overflow-y-auto pr-1">
                  {notifications.map((n) =>
                    style === "ios" ? (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold opacity-90">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{n.appIcon}</span>
                            <span className="uppercase tracking-wider font-bold">{n.appName}</span>
                          </div>
                          <span className="opacity-75">{n.time}</span>
                        </div>
                        <div className="font-bold text-xs pt-0.5">{n.title}</div>
                        <div className="text-xs opacity-90 leading-snug">{n.body}</div>
                      </div>
                    ) : (
                      <div
                        key={n.id}
                        className="p-4 rounded-xl bg-slate-800/90 text-slate-100 border border-slate-700 shadow-lg space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{n.appIcon}</span>
                            <span>{n.appName}</span>
                          </div>
                          <span className="text-slate-400">{n.time}</span>
                        </div>
                        <div className="font-bold text-xs pt-1">{n.title}</div>
                        <div className="text-xs text-slate-300">{n.body}</div>
                      </div>
                    )
                  )}
                </div>

                {/* Bottom lock screen helper */}
                <div className="flex justify-between items-center text-xs opacity-80 pt-4 px-2">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">🔦</div>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">📷</div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Fake Push Notification Generator</h2>
          <p className="text-xs text-slate-500">Create lockscreen notifications for iOS & Android.</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lockscreen Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Notification Style">
              <div className="flex gap-2">
                <Btn variant={style === "ios" ? "primary" : "outline"} onClick={() => setStyle("ios")} className="flex-1 !py-1.5 !text-xs">
                  iOS Glass
                </Btn>
                <Btn variant={style === "android" ? "primary" : "outline"} onClick={() => setStyle("android")} className="flex-1 !py-1.5 !text-xs">
                  Android
                </Btn>
              </div>
            </Field>

            <Field label="Wallpaper Style">
              <Select
                value={wallpaperBg}
                onChange={setWallpaperBg}
                options={[
                  { value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", label: "Midnight Blue" },
                  { value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Sunset Pink" },
                  { value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Emerald Gradient" },
                  { value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Warm Gold" },
                ]}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Clock Time">
              <TextInput value={lockTime} onChange={setLockTime} placeholder="9:41" />
            </Field>
            <Field label="Date String">
              <TextInput value={lockDate} onChange={setLockDate} placeholder="Thursday, October 22" />
            </Field>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Notification</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field label="App Name">
              <TextInput value={newAppName} onChange={setNewAppName} placeholder="WhatsApp" />
            </Field>
            <Field label="Icon Emoji">
              <TextInput value={newAppIcon} onChange={setNewAppIcon} placeholder="💬" />
            </Field>
            <Field label="Time Ago">
              <TextInput value={newTime} onChange={setNewTime} placeholder="now" />
            </Field>
          </div>

          <Field label="Notification Title">
            <TextInput value={newTitle} onChange={setNewTitle} placeholder="Alex Rivers" />
          </Field>

          <Field label="Notification Body">
            <TextArea value={newBody} onChange={setNewBody} placeholder="Notification body content..." rows={2} />
          </Field>

          <Btn onClick={handleAddNotif} className="w-full">
            Add Notification
          </Btn>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notifications ({notifications.length})</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border text-xs">
                <span><strong>[{n.appName}]</strong> {n.title}: {n.body}</span>
                <button type="button" onClick={() => setNotifications(notifications.filter((x) => x.id !== n.id))} className="text-rose-500 font-bold">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
