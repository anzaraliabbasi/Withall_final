"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, FileDrop } from "@/components/ui/kit";
import { Avatar, MockupExportCard, DEFAULT_POST_BG } from "./_feed";

export default function TikTokLiveGenerator() {
  const [hostUsername, setHostUsername] = useState("gamer_pro");
  const [hostAvatarUrl, setHostAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [viewerCount, setViewerCount] = useState("18.4K");
  const [goalText, setGoalText] = useState("Goal: 1,840 / 2,000 Roses 🌹");
  const [bgImage, setBgImage] = useState(DEFAULT_POST_BG);
  const [giftText, setGiftText] = useState("Alex sent Rose x99 🌹");
  const [commentsText, setCommentsText] = useState(
    "dev_guy: Is this running live on Next.js?\ncode_fan: WOW incredible quality stream! 🔥\nsarah_j: Greetings from California! 🌴\nmark_99: 🌹🌹🌹 Sent roses!\nelena: Let's reach the goal guys!"
  );

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setBgImage(URL.createObjectURL(files[0]));
    }
  };

  const commentsList = commentsText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <ToolShell
      side={
        <MockupExportCard filename="tiktok-live.png">
          <div
            style={{
              position: "relative",
              width: 320,
              height: 568,
              backgroundColor: "#000000",
              borderRadius: "24px",
              overflow: "hidden",
              fontFamily: "Proxima Nova, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Live Stream Background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Overlay Gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            {/* Top LIVE Bar */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 10,
              }}
            >
              {/* Host Pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 8px 4px 4px",
                  borderRadius: "20px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar src={hostAvatarUrl} name={hostUsername} size={28} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      backgroundColor: "#fe2c55",
                      color: "#ffffff",
                      fontSize: "8px",
                      fontWeight: 800,
                      padding: "1px 3px",
                      borderRadius: "4px",
                    }}
                  >
                    LIVE
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, lineHeight: 1.1 }}>{hostUsername}</span>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)" }}>{viewerCount}</span>
                </div>
              </div>

              {/* Viewers & Close */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    padding: "4px 8px",
                    borderRadius: "14px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  👁️ {viewerCount}
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </div>
              </div>
            </div>

            {/* Goal Pill (Top Right sub-bar) */}
            {goalText && (
              <div
                style={{
                  position: "absolute",
                  top: 56,
                  right: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#facc15",
                  border: "1px solid rgba(250,204,21,0.3)",
                }}
              >
                {goalText}
              </div>
            )}

            {/* Floating Gift Banner */}
            {giftText && (
              <div
                style={{
                  position: "absolute",
                  bottom: 170,
                  left: 12,
                  backgroundColor: "rgba(254, 44, 85, 0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(254, 44, 85, 0.4)",
                }}
              >
                <span>🎁</span>
                <span>{giftText}</span>
              </div>
            )}

            {/* Floating Comments Log */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 12,
                right: 70,
                maxHeight: 110,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                justifyContent: "flex-end",
              }}
            >
              {commentsList.map((item, idx) => {
                const parts = item.split(":");
                const user = parts[0];
                const msg = parts.slice(1).join(":");
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.45)",
                      backdropFilter: "blur(4px)",
                      padding: "3px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      lineHeight: "1.3",
                    }}
                  >
                    <span style={{ color: "#a5f3fc", fontWeight: 700, marginRight: "4px" }}>
                      {user}:
                    </span>
                    <span>{msg || user}</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Live Action Controls */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "20px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Add comment...
              </div>

              <div
                style={{
                  backgroundColor: "rgba(254, 44, 85, 0.9)",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                🎁
              </div>

              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                ❤️
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          TikTok LIVE Generator
        </h2>

        <Field label="Host Username">
          <TextInput value={hostUsername} onChange={setHostUsername} />
        </Field>

        <Field label="Host Avatar URL">
          <TextInput value={hostAvatarUrl} onChange={setHostAvatarUrl} />
        </Field>

        <Field label="Background Image / Stream Frame">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Upload stream background" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Live Viewer Count">
            <TextInput value={viewerCount} onChange={setViewerCount} />
          </Field>
          <Field label="Gift Popup Banner">
            <TextInput value={giftText} onChange={setGiftText} />
          </Field>
        </div>

        <Field label="Goal Progress Text">
          <TextInput value={goalText} onChange={setGoalText} />
        </Field>

        <Field label="Live Comments Feed (One per line, User: Message)">
          <TextArea value={commentsText} onChange={setCommentsText} rows={5} />
        </Field>
      </div>
    </ToolShell>
  );
}
