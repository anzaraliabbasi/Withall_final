"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard, DEFAULT_AVATARS } from "./_feed";

export default function TikTokProfileGenerator() {
  const [name, setName] = useState("Alex Rivers");
  const [username, setUsername] = useState("alexrivers");
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[0]);
  const [isVerified, setIsVerified] = useState(true);
  const [following, setFollowing] = useState("184");
  const [followers, setFollowers] = useState("2.4M");
  const [likes, setLikes] = useState("38.9M");
  const [bio, setBio] = useState("Creating UI & tech tools daily 🚀\n👇 Check out my latest project");
  const [link, setLink] = useState("toolhive.dev/alex");
  const [buttonText, setButtonText] = useState("Follow");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [gridViews, setGridViews] = useState([
    "1.2M", "450K", "89.4K",
    "3.1M", "12.5K", "230K",
    "5.4M", "98.1K", "610K"
  ]);

  const isDark = theme === "dark";
  const bgColor = isDark ? "#121212" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#121212";
  const mutedColor = isDark ? "#8a8b8c" : "#8a8b8c";
  const borderCol = isDark ? "#2f2f2f" : "#e1e1e2";

  const sampleGridBgs = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
  ];

  return (
    <ToolShell
      side={
        <MockupExportCard filename="tiktok-profile.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 340,
              padding: "16px 0",
              fontFamily: "Proxima Nova, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Top Navigation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px 12px 16px",
                borderBottom: `1px solid ${borderCol}`,
              }}
            >
              <span style={{ fontSize: "18px" }}>‹</span>
              <span style={{ fontSize: "15px", fontWeight: 700 }}>
                {name} {isVerified && <VerifiedBadge type="tiktok" size={14} />}
              </span>
              <span style={{ fontSize: "18px" }}>⋯</span>
            </div>

            {/* Profile Header */}
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Avatar src={avatarUrl} name={name} size={84} />
              </div>

              <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: 600, color: mutedColor }}>
                @{username}
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "24px",
                  marginTop: "14px",
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{following}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>Following</div>
                </div>
                <div style={{ borderLeft: `1px solid ${borderCol}`, borderRight: `1px solid ${borderCol}`, padding: "0 20px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{followers}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>Followers</div>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{likes}</div>
                  <div style={{ fontSize: "11px", color: mutedColor }}>Likes</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fe2c55",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "14px",
                    padding: "8px 36px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {buttonText}
                </div>
                <div
                  style={{
                    backgroundColor: isDark ? "#2f2f2f" : "#f1f1f2",
                    color: textColor,
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  📷
                </div>
              </div>

              {/* Bio & Link */}
              <div
                style={{
                  marginTop: "14px",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  whiteSpace: "pre-wrap",
                }}
              >
                {bio}
              </div>

              {link && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isDark ? "#60a5fa" : "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <span>🔗</span>
                  <span>{link}</span>
                </div>
              )}
            </div>

            {/* Profile Tab Navigation */}
            <div
              style={{
                display: "flex",
                borderTop: `1px solid ${borderCol}`,
                borderBottom: `1px solid ${borderCol}`,
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ flex: 1, padding: "10px 0", borderBottom: "2px solid currentColor", fontWeight: 700 }}>
                ☰ Grid
              </div>
              <div style={{ flex: 1, padding: "10px 0", color: mutedColor }}>
                🔒 Private
              </div>
              <div style={{ flex: 1, padding: "10px 0", color: mutedColor }}>
                ❤️ Liked
              </div>
            </div>

            {/* 3x3 Video Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2px",
                backgroundColor: borderCol,
              }}
            >
              {sampleGridBgs.map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    <span>▶</span>
                    <span>{gridViews[idx] || "10K"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          TikTok Profile Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Theme">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "dark" | "light")}
              options={[
                { value: "dark", label: "Dark Mode" },
                { value: "light", label: "Light Mode" },
              ]}
            />
          </Field>
          <Field label="Display Name">
            <TextInput value={name} onChange={setName} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Username (@)">
            <TextInput value={username} onChange={setUsername} />
          </Field>
          <Field label="Button Text">
            <TextInput value={buttonText} onChange={setButtonText} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Following">
            <TextInput value={following} onChange={setFollowing} />
          </Field>
          <Field label="Followers">
            <TextInput value={followers} onChange={setFollowers} />
          </Field>
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
        </div>

        <Field label="Bio Text">
          <TextArea value={bio} onChange={setBio} rows={3} />
        </Field>

        <Field label="Bio Link URL">
          <TextInput value={link} onChange={setLink} />
        </Field>

        <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />
      </div>
    </ToolShell>
  );
}
