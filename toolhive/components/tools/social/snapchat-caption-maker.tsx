"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, Range, Select, FileDrop, Toggle } from "@/components/ui/kit";
import { MockupExportCard, DEFAULT_POST_BG } from "./_feed";

export default function SnapchatCaptionMaker() {
  const [caption, setCaption] = useState("San Francisco evenings hits different ✨");
  const [positionY, setPositionY] = useState(55); // percentage
  const [fontSize, setFontSize] = useState(16);
  const [barStyle, setBarStyle] = useState<"translucent" | "black" | "white">("translucent");
  const [bgImage, setBgImage] = useState(DEFAULT_POST_BG);
  const [showSticker, setShowSticker] = useState(true);
  const [stickerType, setStickerType] = useState<"time" | "location" | "temperature">("time");
  const [stickerText, setStickerText] = useState("10:42 PM");

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setBgImage(URL.createObjectURL(files[0]));
    }
  };

  const getBarBg = () => {
    if (barStyle === "black") return "rgba(0, 0, 0, 0.9)";
    if (barStyle === "white") return "rgba(255, 255, 255, 0.9)";
    return "rgba(0, 0, 0, 0.55)";
  };

  const getTextColor = () => {
    if (barStyle === "white") return "#000000";
    return "#ffffff";
  };

  return (
    <ToolShell
      side={
        <MockupExportCard filename="snapchat-post.png">
          <div
            style={{
              position: "relative",
              width: 320,
              height: 568,
              backgroundColor: "#000000",
              borderRadius: "24px",
              overflow: "hidden",
              fontFamily:
                "Helvetica Neue, Avenir Next, -apple-system, BlinkMacSystemFont, sans-serif",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Photo background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Top Snapchat Header */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ✕
              </div>

              {/* Snapchat Sticker overlay in center or top */}
              {showSticker && (
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {stickerText}
                </div>
              )}

              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ⋯
              </div>
            </div>

            {/* Classic Snapchat Horizontal Caption Bar */}
            <div
              style={{
                position: "absolute",
                top: `${positionY}%`,
                left: 0,
                right: 0,
                transform: "translateY(-50%)",
                backgroundColor: getBarBg(),
                color: getTextColor(),
                padding: "10px 16px",
                textAlign: "center",
                fontSize: `${fontSize}px`,
                fontWeight: 600,
                lineHeight: "1.3",
                wordBreak: "break-word",
                zIndex: 10,
              }}
            >
              {caption}
            </div>

            {/* Bottom Snapchat Controls */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Chat
              </div>

              <div
                style={{
                  backgroundColor: "#fffc00",
                  color: "#000000",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                ➔
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Snapchat Caption Maker
        </h2>

        <Field label="Caption Text">
          <TextInput value={caption} onChange={setCaption} placeholder="Enter your snap caption..." />
        </Field>

        <Field label={`Vertical Position (${positionY}%)`}>
          <Range value={positionY} onChange={setPositionY} min={10} max={90} suffix="%" />
        </Field>

        <Field label={`Font Size (${fontSize}px)`}>
          <Range value={fontSize} onChange={setFontSize} min={12} max={28} suffix="px" />
        </Field>

        <Field label="Caption Bar Style">
          <Select
            value={barStyle}
            onChange={(v) => setBarStyle(v as "translucent" | "black" | "white")}
            options={[
              { value: "translucent", label: "Classic Translucent Black" },
              { value: "black", label: "Solid Black" },
              { value: "white", label: "Solid White" },
            ]}
          />
        </Field>

        <Field label="Background Image">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Upload photo" />
        </Field>

        <Toggle checked={showSticker} onChange={setShowSticker} label="Show Top Sticker Badge" />

        {showSticker && (
          <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
            <Field label="Sticker Type">
              <Select
                value={stickerType}
                onChange={(v) => {
                  setStickerType(v as "time" | "location" | "temperature");
                  if (v === "time") setStickerText("10:42 PM");
                  if (v === "location") setStickerText("SAN FRANCISCO");
                  if (v === "temperature") setStickerText("72°F ☀️");
                }}
                options={[
                  { value: "time", label: "Time" },
                  { value: "location", label: "Location" },
                  { value: "temperature", label: "Temperature" },
                ]}
              />
            </Field>
            <Field label="Sticker Text">
              <TextInput value={stickerText} onChange={setStickerText} />
            </Field>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
