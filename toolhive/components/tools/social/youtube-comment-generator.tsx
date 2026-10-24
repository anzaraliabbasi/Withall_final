"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard } from "./_feed";

export default function YoutubeCommentGenerator() {
  const [authorName, setAuthorName] = useState("Tech Enthusiast");
  const [handle, setHandle] = useState("@tech_guru");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [commentText, setCommentText] = useState("This explanation is clearer than any documentation I've read! Subscribed immediately 🚀");
  const [timeAgo, setTimeAgo] = useState("4 hours ago");
  const [likesCount, setLikesCount] = useState("1.8K");
  const [isLiked, setIsLiked] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [channelName, setCreatorName] = useState("ToolHive Channel");
  const [isHeartedByCreator, setIsHeartedByCreator] = useState(true);
  const [creatorAvatarUrl, setCreatorAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [hasReply, setHasReply] = useState(true);
  const [replyName, setReplyName] = useState("ToolHive Channel");
  const [replyHandle, setReplyHandle] = useState("@toolhive");
  const [replyAvatarUrl, setReplyAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [replyText, setReplyText] = useState("Welcome to the community! Glad it helped you out 🙌");
  const [replyTimeAgo, setReplyTimeAgo] = useState("2 hours ago");
  const [replyLikesCount, setReplyLikesCount] = useState("342");

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f0f0f" : "#ffffff";
  const textColor = isDark ? "#f1f1f1" : "#0f0f0f";
  const mutedColor = isDark ? "#aaa" : "#606060";

  return (
    <ToolShell
      side={
        <MockupExportCard filename="youtube-comment.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 380,
              padding: "16px",
              fontFamily: "Roboto, Arial, sans-serif",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Pinned notice */}
            {isPinned && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: mutedColor,
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                <span>Pinned by {channelName}</span>
              </div>
            )}

            {/* Comment Row */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Avatar src={avatarUrl} name={authorName} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header: handle + time */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>{handle}</span>
                  {isVerified && <VerifiedBadge type="youtube" size={12} />}
                  <span style={{ fontSize: "12px", color: mutedColor }}>{timeAgo}</span>
                </div>

                {/* Comment Text */}
                <div style={{ fontSize: "13.5px", lineHeight: "1.4", marginTop: "4px", wordBreak: "break-word" }}>
                  {commentText}
                </div>

                {/* Action Row: Thumbs Up, Count, Thumbs Down, Heart, Reply */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginTop: "8px",
                    fontSize: "12px",
                    color: textColor,
                  }}
                >
                  {/* Thumbs Up */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                    <span style={{ fontSize: "12px", color: mutedColor }}>{likesCount}</span>
                  </div>

                  {/* Thumbs Down */}
                  <div style={{ cursor: "pointer" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                    </svg>
                  </div>

                  {/* Creator Heart badge */}
                  {isHeartedByCreator && (
                    <div style={{ position: "relative", cursor: "pointer" }}>
                      <Avatar src={creatorAvatarUrl} name={channelName} size={18} />
                      <div
                        style={{
                          position: "absolute",
                          bottom: -3,
                          right: -3,
                          backgroundColor: "#ff0000",
                          borderRadius: "50%",
                          width: "10px",
                          height: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="6" height="6" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <span style={{ fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                    Reply
                  </span>
                </div>
              </div>
            </div>

            {/* Nested Reply */}
            {hasReply && (
              <div style={{ marginTop: "14px", paddingLeft: "48px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Avatar src={replyAvatarUrl} name={replyName} size={28} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: isDark ? "#272727" : "#f2f2f2",
                          padding: "2px 6px",
                          borderRadius: "10px",
                        }}
                      >
                        {replyHandle}
                      </span>
                      <span style={{ fontSize: "11px", color: mutedColor }}>{replyTimeAgo}</span>
                    </div>

                    <div style={{ fontSize: "13px", marginTop: "4px", wordBreak: "break-word" }}>
                      {replyText}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                        <span style={{ fontSize: "11px", color: mutedColor }}>{replyLikesCount}</span>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 500 }}>Reply</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          YouTube Comment Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Theme">
            <Select
              value={theme}
              onChange={(v) => setTheme(v as "light" | "dark")}
              options={[
                { value: "dark", label: "Dark Mode" },
                { value: "light", label: "Light Mode" },
              ]}
            />
          </Field>
          <Field label="Author Name">
            <TextInput value={authorName} onChange={setAuthorName} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Handle (@)">
            <TextInput value={handle} onChange={setHandle} />
          </Field>
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Comment Text">
          <TextArea value={commentText} onChange={setCommentText} rows={3} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Likes Count">
            <TextInput value={likesCount} onChange={setLikesCount} />
          </Field>
          <Field label="Channel Name">
            <TextInput value={channelName} onChange={setCreatorName} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle checked={isVerified} onChange={setIsVerified} label="Verified" />
          <Toggle checked={isLiked} onChange={setIsLiked} label="Liked" />
          <Toggle checked={isPinned} onChange={setIsPinned} label="Pinned" />
          <Toggle checked={isHeartedByCreator} onChange={setIsHeartedByCreator} label="Creator Heart" />
        </div>

        <hr className="border-slate-200 dark:border-slate-800 my-4" />

        <Toggle checked={hasReply} onChange={setHasReply} label="Include Reply" />

        {hasReply && (
          <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
            <Field label="Reply Name">
              <TextInput value={replyName} onChange={setReplyName} />
            </Field>
            <Field label="Reply Handle">
              <TextInput value={replyHandle} onChange={setReplyHandle} />
            </Field>
            <Field label="Reply Avatar">
              <TextInput value={replyAvatarUrl} onChange={setReplyAvatarUrl} />
            </Field>
            <Field label="Reply Text">
              <TextArea value={replyText} onChange={setReplyText} rows={2} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reply Time">
                <TextInput value={replyTimeAgo} onChange={setReplyTimeAgo} />
              </Field>
              <Field label="Reply Likes">
                <TextInput value={replyLikesCount} onChange={setReplyLikesCount} />
              </Field>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
