"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  TextInput,
  TextArea,
  Toggle,
  Select,
  Range,
  FileDrop,
  Btn,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, formatStat, readImageAsDataUrl } from "./_post";

export default function YoutubeVideoPageGenerator() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [title, setTitle] = useState<string>(
    "Building a Full-Stack AI App with Next.js 15, React 19 & Tailwind CSS"
  );
  const [views, setViews] = useState<string>("124500");
  const [uploadDate, setUploadDate] = useState<string>("2 days ago");
  const [likes, setLikes] = useState<string>("8400");
  const [videoThumbUrl, setVideoThumbUrl] = useState<string>(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E"
  );
  const [videoDuration, setVideoDuration] = useState<string>("18:24");
  const [progressPercent, setProgressPercent] = useState<number>(35);

  const [channelName, setChannelName] = useState<string>("Tech Vision");
  const [subscribers, setSubscribers] = useState<string>("1.2M subscribers");
  const [channelAvatarUrl, setChannelAvatarUrl] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const [showComment, setShowComment] = useState<boolean>(true);
  const [commentAuthor, setCommentAuthor] = useState<string>("Sarah Jenkins");
  const [commentText, setCommentText] = useState<string>(
    "This step-by-step breakdown was incredible! Loved how clearly you explained state management."
  );
  const [commentTime, setCommentTime] = useState<string>("4 hours ago");
  const [commentLikes, setCommentLikes] = useState<string>("342");
  const [commentAvatarUrl, setCommentAvatarUrl] = useState<string>("");

  const { exportRef, exportPng } = useMockupExport();

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f0f0f" : "#ffffff";
  const textColor = isDark ? "#f1f1f1" : "#0f0f0f";
  const secondaryText = isDark ? "#aaaaaa" : "#606060";
  const cardBg = isDark ? "#272727" : "#f2f2f2";
  const borderCol = isDark ? "#3f3f3f" : "#e5e5e5";

  const handleThumbUpload = async (files: File[]) => {
    if (files.length > 0) {
      const dataUrl = await readImageAsDataUrl(files[0]);
      setVideoThumbUrl(dataUrl);
    }
  };

  const handleChannelAvatarUpload = async (files: File[]) => {
    if (files.length > 0) {
      const dataUrl = await readImageAsDataUrl(files[0]);
      setChannelAvatarUrl(dataUrl);
    }
  };

  const handleCommentAvatarUpload = async (files: File[]) => {
    if (files.length > 0) {
      const dataUrl = await readImageAsDataUrl(files[0]);
      setCommentAvatarUrl(dataUrl);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              YouTube Mockup Preview
            </span>
            <Btn
              onClick={() => exportPng("youtube-video-page.png")}
              variant="primary"
              className="!text-xs !py-1.5 !px-3"
            >
              Download PNG
            </Btn>
          </div>

          <div className="flex justify-center items-center overflow-x-auto p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div
              ref={exportRef}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                width: "480px",
                fontFamily: "Roboto, Arial, sans-serif",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                overflow: "hidden",
              }}
            >
              {/* Video Player Box */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  backgroundColor: "#000",
                  backgroundImage: `url(${videoThumbUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Center Play Button Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.25)",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Video Controls Bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "8px 12px 6px 12px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {/* Scrubber / Progress Bar */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "3px",
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${progressPercent}%`,
                        backgroundColor: "#ff0000",
                        borderRadius: "2px",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: `${progressPercent}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#ff0000",
                      }}
                    />
                  </div>

                  {/* Player Controls Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "between",
                      fontSize: "11px",
                      color: "#ffffff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Play Icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      {/* Speaker Icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" stroke="#ffffff" strokeWidth="2" fill="none" />
                      </svg>
                      <span style={{ fontWeight: 500, fontSize: "11px" }}>
                        04:12 / {videoDuration}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto" }}>
                      {/* CC Icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M7 10h2M7 14h2M13 10h4M13 14h3" />
                      </svg>
                      {/* Gear Settings Icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      {/* Fullscreen Icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Title & Metadata */}
              <div style={{ padding: "12px 16px 8px 16px" }}>
                <h1
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: "1.35",
                    margin: 0,
                  }}
                >
                  {title}
                </h1>

                {/* Channel & Subscribe Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                    gap: "12px",
                  }}
                >
                  {/* Channel Left */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <Avatar name={channelName} src={channelAvatarUrl} size={38} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span>{channelName}</span>
                        {isVerified && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={secondaryText}
                            style={{ marginLeft: "4px", flexShrink: 0 }}
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: secondaryText }}>
                        {subscribers}
                      </div>
                    </div>
                  </div>

                  {/* Red Subscribe Button */}
                  <div>
                    <button
                      type="button"
                      style={{
                        backgroundColor: isSubscribed ? cardBg : "#cc0000",
                        color: isSubscribed ? textColor : "#ffffff",
                        padding: "7px 14px",
                        borderRadius: "18px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {isSubscribed ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22a2.98 2.98 0 002.818-2H9.182A2.98 2.98 0 0012 22zm7-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.63 5.36 7 7.92 7 11v5l-2 2v1h14l-2-2z" />
                          </svg>
                          <span>Subscribed</span>
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Row (Like / Share / Download) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px",
                    overflowX: "auto",
                  }}
                >
                  {/* Like / Dislike Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: cardBg,
                      borderRadius: "18px",
                      padding: "5px 12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                      </svg>
                      <span>{formatStat(likes)}</span>
                    </div>
                    <div style={{ width: "1px", height: "12px", backgroundColor: borderCol }} />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                    </svg>
                  </div>

                  {/* Share Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: cardBg,
                      borderRadius: "18px",
                      padding: "5px 12px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <span>Share</span>
                  </div>

                  {/* Save / Clip Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: cardBg,
                      borderRadius: "18px",
                      padding: "5px 12px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <span>Save</span>
                  </div>
                </div>

                {/* Description Box */}
                <div
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: "12px",
                    padding: "10px 12px",
                    marginTop: "12px",
                    fontSize: "11px",
                    lineHeight: "1.4",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {formatStat(views)} views • {uploadDate}
                  </span>
                  <div style={{ marginTop: "4px", color: secondaryText }}>
                    In this tutorial, learn how to construct responsive web applications with Next.js App Router and dynamic state handling.
                  </div>
                </div>

                {/* Top Comment Section */}
                {showComment && (
                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${borderCol}` }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Top Comment</span>
                      <span style={{ fontSize: "11px", color: secondaryText, fontWeight: 400 }}>
                        • Sorted by top
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <Avatar name={commentAuthor} src={commentAvatarUrl} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                          <span style={{ fontWeight: 700 }}>{commentAuthor}</span>
                          <span style={{ color: secondaryText, fontSize: "10px" }}>{commentTime}</span>
                        </div>
                        <div style={{ fontSize: "12px", marginTop: "3px", lineHeight: "1.35" }}>
                          {commentText}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginTop: "6px",
                            fontSize: "10px",
                            color: secondaryText,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                            </svg>
                            <span>{formatStat(commentLikes)}</span>
                          </div>
                          <span style={{ fontWeight: 600, cursor: "pointer" }}>Reply</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          YouTube Video Page Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize video details, channel metadata, subscribe bar, and top comments to generate YouTube video watch page mockups.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Theme Mode">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "dark" | "light")}
              options={[
                { value: "dark", label: "Dark Theme" },
                { value: "light", label: "Light Theme" },
              ]}
            />
          </Field>

          <Field label="Video Title">
            <TextInput value={title} onChange={setTitle} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Views Count">
            <TextInput value={views} onChange={setViews} />
          </Field>

          <Field label="Upload Date">
            <TextInput value={uploadDate} onChange={setUploadDate} />
          </Field>

          <Field label="Likes Count">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Video Duration">
            <TextInput value={videoDuration} onChange={setVideoDuration} placeholder="18:24" />
          </Field>

          <Field label="Playback Progress (%)">
            <Range
              value={progressPercent}
              onChange={setProgressPercent}
              min={0}
              max={100}
              suffix="%"
            />
          </Field>
        </div>

        <Field label="Video Thumbnail">
          <div className="space-y-2">
            <TextInput
              value={videoThumbUrl}
              onChange={setVideoThumbUrl}
              placeholder="https://..."
            />
            <FileDrop
              onFiles={handleThumbUpload}
              accept="image/*"
              label="Or upload custom thumbnail image"
            />
          </div>
        </Field>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Channel Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Channel Name">
              <TextInput value={channelName} onChange={setChannelName} />
            </Field>

            <Field label="Subscribers String">
              <TextInput value={subscribers} onChange={setSubscribers} />
            </Field>
          </div>

          <Field label="Channel Avatar">
            <FileDrop
              onFiles={handleChannelAvatarUpload}
              accept="image/*"
              label="Upload channel avatar"
            />
          </Field>

          <div className="flex flex-wrap gap-4 pt-1">
            <Toggle
              checked={isVerified}
              onChange={setIsVerified}
              label="Verified Badge"
            />
            <Toggle
              checked={isSubscribed}
              onChange={setIsSubscribed}
              label="Subscribed State"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Toggle
            checked={showComment}
            onChange={setShowComment}
            label="Include Top Comment Section"
          />

          {showComment && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Field label="Comment Author">
                  <TextInput value={commentAuthor} onChange={setCommentAuthor} />
                </Field>

                <Field label="Comment Time">
                  <TextInput value={commentTime} onChange={setCommentTime} />
                </Field>

                <Field label="Comment Likes">
                  <TextInput value={commentLikes} onChange={setCommentLikes} />
                </Field>
              </div>

              <Field label="Comment Text">
                <TextArea
                  value={commentText}
                  onChange={setCommentText}
                  rows={2}
                />
              </Field>

              <Field label="Commenter Avatar">
                <FileDrop
                  onFiles={handleCommentAvatarUpload}
                  accept="image/*"
                  label="Upload commenter avatar"
                />
              </Field>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
