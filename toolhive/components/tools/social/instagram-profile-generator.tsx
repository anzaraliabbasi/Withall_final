"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard, DEFAULT_AVATARS } from "./_feed";

export default function InstagramProfileGenerator() {
  const [username, setUsername] = useState("studio_design");
  const [name, setName] = useState("Studio Design & Co.");
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[1]);
  const [isVerified, setIsVerified] = useState(true);
  const [category, setCategory] = useState("Digital Creator");
  const [bio, setBio] = useState("Crafting digital experiences & UI assets 🎨\n✨ New components every week\n📍 San Francisco, CA");
  const [link, setLink] = useState("toolhive.dev/studio");

  const [postsCount, setPostsCount] = useState("184");
  const [followersCount, setFollowersCount] = useState("124K");
  const [followingCount, setFollowingCount] = useState("412");

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [highlights, setHighlights] = useState([
    { name: "Projects", icon: "🎨" },
    { name: "Setup", icon: "💻" },
    { name: "Q&A", icon: "💬" },
    { name: "Reviews", icon: "⭐" },
  ]);

  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0f1419";
  const mutedColor = isDark ? "#a8a8a8" : "#737373";
  const borderCol = isDark ? "#262626" : "#dbdbdb";

  const gridPhotos = [
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
        <MockupExportCard filename="instagram-profile.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 350,
              padding: "16px 0",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px 12px 16px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <span>{username}</span>
                {isVerified && <VerifiedBadge type="instagram" size={14} />}
              </div>
              <div style={{ display: "flex", gap: "16px", fontSize: "18px" }}>
                <span>+</span>
                <span>☰</span>
              </div>
            </div>

            {/* Header: Avatar + Stats */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    padding: "2px",
                    background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    borderRadius: "50%",
                  }}
                >
                  <Avatar src={avatarUrl} name={name} size={76} className="border-2 border-white dark:border-black" />
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: "flex", gap: "20px", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>{postsCount}</div>
                  <div style={{ fontSize: "12px", color: mutedColor }}>posts</div>
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>{followersCount}</div>
                  <div style={{ fontSize: "12px", color: mutedColor }}>followers</div>
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>{followingCount}</div>
                  <div style={{ fontSize: "12px", color: mutedColor }}>following</div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div style={{ padding: "12px 16px 0 16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>{name}</div>
              {category && <div style={{ fontSize: "12px", color: mutedColor }}>{category}</div>}
              <div style={{ fontSize: "13px", lineHeight: "1.35", whiteSpace: "pre-wrap", marginTop: "4px" }}>
                {bio}
              </div>
              {link && (
                <div style={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#38bdf8" : "#00376b", marginTop: "4px" }}>
                  🔗 {link}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", padding: "12px 16px" }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#262626" : "#efefef",
                  textAlign: "center",
                  padding: "7px 0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#262626" : "#efefef",
                  textAlign: "center",
                  padding: "7px 0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Share Profile
              </div>
            </div>

            {/* Highlights Bar */}
            <div style={{ display: "flex", gap: "16px", padding: "0 16px 12px 16px", overflowX: "auto" }}>
              {highlights.map((hl, idx) => (
                <div key={idx} style={{ textAlign: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      border: `1px solid ${borderCol}`,
                      backgroundColor: isDark ? "#171717" : "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      margin: "0 auto",
                    }}
                  >
                    {hl.icon}
                  </div>
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>{hl.name}</div>
                </div>
              ))}
            </div>

            {/* Grid Tabs */}
            <div
              style={{
                display: "flex",
                borderTop: `1px solid ${borderCol}`,
                borderBottom: `1px solid ${borderCol}`,
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              <div style={{ flex: 1, padding: "8px 0", borderBottom: `2px solid ${textColor}` }}>
                ▦
              </div>
              <div style={{ flex: 1, padding: "8px 0", color: mutedColor }}>
                🎬
              </div>
              <div style={{ flex: 1, padding: "8px 0", color: mutedColor }}>
                👤
              </div>
            </div>

            {/* 3x3 Photo Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2px",
                backgroundColor: borderCol,
              }}
            >
              {gridPhotos.map((imgUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: "1/1",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Instagram Profile Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Theme">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "light" | "dark")}
              options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
              ]}
            />
          </Field>
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Display Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Category">
            <TextInput value={category} onChange={setCategory} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Posts">
            <TextInput value={postsCount} onChange={setPostsCount} />
          </Field>
          <Field label="Followers">
            <TextInput value={followersCount} onChange={setFollowersCount} />
          </Field>
          <Field label="Following">
            <TextInput value={followingCount} onChange={setFollowingCount} />
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
