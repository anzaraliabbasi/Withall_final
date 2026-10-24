"use client";

import React from "react";
import { PhoneFrame } from "@/components/ui/kit";

export interface ChatMsg {
  id: string;
  side: "in" | "out";
  sender?: string;
  senderColor?: string;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  image?: string;
  voice?: number; // duration in seconds
  reaction?: string;
  isSms?: boolean; // for iMessage green vs blue
}

export interface ChatHeaderInfo {
  name: string;
  status?: string;
  avatar?: string;
  avatarBg?: string;
  verified?: boolean;
  subtitle?: string;
}

export interface ChatPhoneProps {
  header: ChatHeaderInfo;
  messages: ChatMsg[];
  darkMode?: boolean;
  headerBg?: string;
  headerTextColor?: string;
  chatBg?: string;
  inBubbleBg?: string;
  inBubbleText?: string;
  outBubbleBg?: string;
  outBubbleText?: string;
  platformName?: string;
  platformIcon?: React.ReactNode;
  showStatusTicks?: boolean;
  isGroup?: boolean;
  borderRadius?: string;
  width?: number;
  dateDivider?: string;
  customHeaderButtons?: React.ReactNode;
  footerInputPlaceholder?: string;
  renderCustomBubble?: (msg: ChatMsg, index: number) => React.ReactNode;
  children?: React.ReactNode;
}

export function PhoneStatusBar({ dark = false, bg = "transparent" }: { dark?: boolean; bg?: string }) {
  const color = dark ? "#FFFFFF" : "#0f172a";
  return (
    <div
      className="flex items-center justify-between px-5 pt-2 pb-1 text-xs font-semibold select-none"
      style={{ backgroundColor: bg, color }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.3c-.41.41-.41 1.08 0 1.49.41.41 1.08.41 1.49 0l1.69-1.69C9.07 20.26 11.02 21 13.14 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
        {/* Wifi */}
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 4.5c3.21 0 6.13 1.25 8.31 3.28L12 19.33 3.69 11.78C5.87 9.75 8.79 8.5 12 8.5z" />
        </svg>
        {/* Battery */}
        <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
          <div className="h-full w-full bg-current rounded-xs" />
        </div>
      </div>
    </div>
  );
}

export function Avatar({
  name,
  src,
  bg = "#3b82f6",
  size = 36,
  online,
  storyRing,
}: {
  name: string;
  src?: string;
  bg?: string;
  size?: number;
  online?: boolean;
  storyRing?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const content = src ? (
    <img src={src} alt={name} className="w-full h-full object-cover rounded-full"  loading="lazy" decoding="async" />
  ) : (
    <div
      className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs select-none"
      style={{ backgroundColor: bg }}
    >
      {initials || "?"}
    </div>
  );

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {storyRing ? (
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 w-full h-full">
          <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">{content}</div>
        </div>
      ) : (
        <div className="w-full h-full rounded-full overflow-hidden">{content}</div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}

export function StatusTicks({ status = "read", color }: { status?: "sent" | "delivered" | "read"; color?: string }) {
  const tickColor = color || (status === "read" ? "#34b7f1" : "#8696a0");
  if (status === "sent") {
    return (
      <svg className="w-3.5 h-3.5 inline ml-1" fill={tickColor} viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 inline ml-1" fill={tickColor} viewBox="0 0 24 24">
      <path d="M0.41 13.41L6 19l1.41-1.41L1.83 12m4.58 4.59L18 5l-1.41-1.41L5 15.17m11.59-1.41L22 8l-1.41-1.41L15.17 12" />
    </svg>
  );
}

export function ChatBubble({
  msg,
  isGroup,
  inBubbleBg = "#ffffff",
  inBubbleText = "#0f172a",
  outBubbleBg = "#dcf8c6",
  outBubbleText = "#0f172a",
  borderRadius = "14px",
  showStatusTicks = true,
}: {
  msg: ChatMsg;
  isGroup?: boolean;
  inBubbleBg?: string;
  inBubbleText?: string;
  outBubbleBg?: string;
  outBubbleText?: string;
  borderRadius?: string;
  showStatusTicks?: boolean;
}) {
  const isOut = msg.side === "out";
  const bg = isOut ? outBubbleBg : inBubbleBg;
  const textColor = isOut ? outBubbleText : inBubbleText;

  return (
    <div className={`flex flex-col my-1 ${isOut ? "items-end" : "items-start"}`}>
      <div
        className="relative max-w-[80%] px-3 py-2 shadow-xs"
        style={{
          backgroundColor: bg,
          color: textColor,
          borderRadius: borderRadius,
          borderTopLeftRadius: !isOut ? "4px" : borderRadius,
          borderTopRightRadius: isOut ? "4px" : borderRadius,
        }}
      >
        {!isOut && isGroup && msg.sender && (
          <div className="text-[11px] font-bold mb-0.5" style={{ color: msg.senderColor || "#075e54" }}>
            {msg.sender}
          </div>
        )}

        {msg.image && (
          <img src={msg.image} alt="uploaded content" className="rounded-lg max-w-full h-auto mb-1.5 object-cover"  loading="lazy" decoding="async" />
        )}

        {msg.voice !== undefined && msg.voice > 0 && (
          <div className="flex items-center gap-2 my-1">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-0.5">
                {[40, 70, 30, 90, 60, 100, 40, 80, 50, 90, 30, 60, 80, 40, 20].map((h, i) => (
                  <div key={i} className="w-1 bg-current opacity-60 rounded-full" style={{ height: `${h}%`, minHeight: "4px" }} />
                ))}
              </div>
              <span className="text-[10px] opacity-75 font-mono">
                0:{msg.voice < 10 ? `0${msg.voice}` : msg.voice}
              </span>
            </div>
          </div>
        )}

        {msg.text && <div className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</div>}

        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] opacity-70 float-right ml-3 -mb-1 select-none">
          <span>{msg.time}</span>
          {isOut && showStatusTicks && <StatusTicks status={msg.status || "read"} />}
        </div>

        {msg.reaction && (
          <div className="absolute -bottom-2 right-2 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 text-xs shadow-md border border-slate-200 dark:border-slate-700">
            {msg.reaction}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatPhone({
  header,
  messages,
  darkMode = false,
  headerBg = "#075E54",
  headerTextColor = "#FFFFFF",
  chatBg = "#ECE5DD",
  inBubbleBg = "#FFFFFF",
  inBubbleText = "#0f172a",
  outBubbleBg = "#DCF8C6",
  outBubbleText = "#0f172a",
  showStatusTicks = true,
  isGroup = false,
  borderRadius = "14px",
  width = 380,
  dateDivider = "Today",
  customHeaderButtons,
  footerInputPlaceholder = "Message",
  renderCustomBubble,
  children,
}: ChatPhoneProps) {
  return (
    <PhoneFrame width={width}>
      <div
        className="flex flex-col h-[580px] select-none text-slate-900"
        style={{ backgroundColor: chatBg, color: darkMode ? "#ffffff" : "#0f172a" }}
      >
        {/* Top Status Bar */}
        <PhoneStatusBar dark={darkMode || headerBg === "#000000"} bg={headerBg} />

        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-3 py-2 shadow-xs shrink-0"
          style={{ backgroundColor: headerBg, color: headerTextColor }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <Avatar name={header.name} src={header.avatar} bg={header.avatarBg || "#3b82f6"} size={34} />
            <div className="min-w-0 flex flex-col">
              <div className="font-semibold text-xs truncate flex items-center gap-1">
                <span>{header.name}</span>
                {header.verified && (
                  <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              {header.status && <span className="text-[10px] opacity-80 truncate">{header.status}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {customHeaderButtons || (
              <>
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </>
            )}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {dateDivider && (
            <div className="flex justify-center my-1">
              <span
                className="text-[10px] px-2.5 py-0.5 rounded-full shadow-2xs font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                  color: darkMode ? "#94a3b8" : "#64748b",
                }}
              >
                {dateDivider}
              </span>
            </div>
          )}

          {children ||
            messages.map((msg, idx) =>
              renderCustomBubble ? (
                renderCustomBubble(msg, idx)
              ) : (
                <ChatBubble
                  key={msg.id || idx}
                  msg={msg}
                  isGroup={isGroup}
                  inBubbleBg={inBubbleBg}
                  inBubbleText={inBubbleText}
                  outBubbleBg={outBubbleBg}
                  outBubbleText={outBubbleText}
                  borderRadius={borderRadius}
                  showStatusTicks={showStatusTicks}
                />
              )
            )}
        </div>

        {/* Footer Input Mockup */}
        <div
          className="p-2 border-t flex items-center gap-2 shrink-0"
          style={{
            backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
            borderColor: darkMode ? "#1e293b" : "#e2e8f0",
          }}
        >
          <div className="p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div
            className="flex-1 px-3 py-1.5 rounded-full text-xs"
            style={{
              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
              color: darkMode ? "#94a3b8" : "#94a3b8",
            }}
          >
            {footerInputPlaceholder}
          </div>
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
