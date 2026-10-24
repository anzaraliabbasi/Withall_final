"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select, FileDrop } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard, DEFAULT_AVATARS } from "./_feed";

export default function YoutubeChannelGenerator() {
  const [channelName, setChannelName] = useState("Code & Create");
  const [handle, setHandle] = useState("@codeandcreate");
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[2]);
  const [bannerUrl, setBannerUrl] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState("1.42M subscribers");
  const [videoCount, setVideosCount] = useState("320 videos");
  const [description, setDescription] = useState("Building software, fullstack web apps, and design engineering tools from scratch. New videos every Tuesday!");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f0f0f" : "#ffffff";
  const textColor = isDark ? "#f1f1f1" : "#0f0f0f";
  const mutedColor = isDark ? "#aaa" : "#606060";
  const borderCol = isDark ? "#272727" : "#e5e5e5";

  const videos = [
    { title: "Next.js 15 Full Course - Build 10 Real Apps", views: "480K views", time: "2 weeks ago", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E" },
    { title: "Tailwind CSS v4 Complete Guide & Features", views: "210K views", time: "1 month ago", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E" },
    { title: "Building a Modern Design System with React 19", views: "145K views", time: "2 months ago", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E" },
    { title: "TypeScript Advanced Patterns You Should Know", views: "320K views", time: "3 months ago", thumb: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E" },
  ];

  const handleBannerUpload = (files: File[]) => {
    if (files.length > 0) {
      setBannerUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <ToolShell
      side={
        <MockupExportCard filename="youtube-channel.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 440,
              fontFamily: "Roboto, Arial, sans-serif",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Banner Strip */}
            <div
              style={{
                width: "100%",
                height: "100px",
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Channel Info Section */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Avatar src={avatarUrl} name={channelName} size={72} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, display: "flex", alignItems: "center" }}>
                    <span>{channelName}</span>
                    {isVerified && <VerifiedBadge type="youtube" size={16} />}
                  </div>

                  <div style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>
                    <span>{handle}</span> • <span>{subscribers}</span> • <span>{videoCount}</span>
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: mutedColor,
                      marginTop: "4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {description}
                  </div>

                  {/* Subscribe Button */}
                  <div style={{ marginTop: "10px" }}>
                    <span
                      style={{
                        backgroundColor: isSubscribed ? (isDark ? "#272727" : "#f2f2f2") : (isDark ? "#f1f1f1" : "#0f0f0f"),
                        color: isSubscribed ? textColor : (isDark ? "#0f0f0f" : "#ffffff"),
                        padding: "8px 16px",
                        borderRadius: "18px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                padding: "0 20px",
                borderBottom: `1px solid ${borderCol}`,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span style={{ borderBottom: `2px solid ${textColor}`, paddingBottom: "8px" }}>Home</span>
              <span style={{ color: mutedColor, paddingBottom: "8px" }}>Videos</span>
              <span style={{ color: mutedColor, paddingBottom: "8px" }}>Shorts</span>
              <span style={{ color: mutedColor, paddingBottom: "8px" }}>Playlists</span>
              <span style={{ color: mutedColor, paddingBottom: "8px" }}>Community</span>
            </div>

            {/* Video Grid */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
                Latest Videos
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {videos.map((vid, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        backgroundImage: `url(${vid.thumb})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        lineHeight: "1.3",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {vid.title}
                    </div>
                    <div style={{ fontSize: "10px", color: mutedColor }}>
                      {vid.views} • {vid.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          YouTube Channel Generator
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
          <Field label="Channel Name">
            <TextInput value={channelName} onChange={setChannelName} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Handle (@)">
            <TextInput value={handle} onChange={setHandle} />
          </Field>

          <Field label="Subscribers">
            <TextInput value={subscribers} onChange={setSubscribers} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Banner Image">
          <FileDrop onFiles={handleBannerUpload} accept="image/*" label="Upload banner image" />
        </Field>

        <Field label="Description">
          <TextArea value={description} onChange={setDescription} rows={2} />
        </Field>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />
          <Toggle checked={isSubscribed} onChange={setIsSubscribed} label="Subscribed State" />
        </div>
      </div>
    </ToolShell>
  );
}
