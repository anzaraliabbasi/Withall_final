"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard } from "./_feed";

export default function TikTokCommentGenerator() {
  const [username, setUsername] = useState("creative_coder");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [commentText, setCommentText] = useState("The transition at 0:15 was insane! How long did this take to edit? 🔥");
  const [timeAgo, setTimeAgo] = useState("3-15");
  const [likesCount, setLikesCount] = useState("24.5K");
  const [isLiked, setIsLiked] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isLikedByCreator, setIsLikedByCreator] = useState(true);
  const [creatorAvatarUrl, setCreatorAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [hasReply, setHasReply] = useState(true);
  const [replyUsername, setReplyUsername] = useState("creator_pro");
  const [replyAvatarUrl, setReplyAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [replyText, setReplyText] = useState("Took about 4 hours in After Effects! Glad you liked it 🙌");
  const [replyTimeAgo, setReplyTimeAgo] = useState("3-15");
  const [replyLikesCount, setReplyLikesCount] = useState("3,102");

  const isDark = theme === "dark";
  const bgColor = isDark ? "#121212" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#121212";
  const mutedColor = isDark ? "#8a8b8c" : "#8a8b8c";

  return (
    <ToolShell
      side={
        <MockupExportCard filename="tiktok-comment.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 380,
              padding: "16px",
              fontFamily:
                "Proxima Nova, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Pinned label if set */}
            {isPinned && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  color: mutedColor,
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    backgroundColor: isDark ? "#2f2f2f" : "#f1f1f2",
                    color: isDark ? "#ffffff" : "#161823",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "11px",
                  }}
                >
                  Pinned
                </span>
              </div>
            )}

            {/* Comment Row */}
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <Avatar src={avatarUrl} name={username} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Username + verified */}
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: mutedColor,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>{username}</span>
                  {isVerified && <VerifiedBadge type="tiktok" size={13} />}
                </div>

                {/* Comment body */}
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.35",
                    marginTop: "3px",
                    wordBreak: "break-word",
                  }}
                >
                  {commentText}
                </div>

                {/* Date & Reply button */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "12px",
                    color: mutedColor,
                    marginTop: "6px",
                    fontWeight: 500,
                  }}
                >
                  <span>{timeAgo}</span>
                  <span style={{ cursor: "pointer", fontWeight: 600 }}>Reply</span>
                </div>

                {/* Liked by creator pill */}
                {isLikedByCreator && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "6px",
                      backgroundColor: "#fe2c55",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    <Avatar src={creatorAvatarUrl} name="Creator" size={12} />
                    <span>Liked by creator</span>
                  </div>
                )}
              </div>

              {/* Heart icon + like count */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  paddingLeft: "4px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#fe2c55" : "none"}
                  stroke={isLiked ? "#fe2c55" : mutedColor}
                  strokeWidth="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span style={{ fontSize: "11px", color: mutedColor, fontWeight: 500 }}>
                  {likesCount}
                </span>
              </div>
            </div>

            {/* Nested Reply */}
            {hasReply && (
              <div style={{ marginTop: "14px", paddingLeft: "46px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <Avatar src={replyAvatarUrl} name={replyUsername} size={26} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: mutedColor,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{replyUsername}</span>
                      <span
                        style={{
                          backgroundColor: "#fe2c55",
                          color: "#ffffff",
                          fontSize: "9px",
                          padding: "1px 4px",
                          borderRadius: "3px",
                          fontWeight: 700,
                        }}
                      >
                        Creator
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", marginTop: "2px", wordBreak: "break-word" }}>
                      {replyText}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "11px",
                        color: mutedColor,
                        marginTop: "4px",
                      }}
                    >
                      <span>{replyTimeAgo}</span>
                      <span style={{ cursor: "pointer", fontWeight: 600 }}>Reply</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#fe2c55"
                      stroke="#fe2c55"
                      strokeWidth="2"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span style={{ fontSize: "10px", color: mutedColor }}>{replyLikesCount}</span>
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
          TikTok Comment Generator
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
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Comment Text">
          <TextArea value={commentText} onChange={setCommentText} rows={3} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
          <Field label="Likes Count">
            <TextInput value={likesCount} onChange={setLikesCount} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle checked={isVerified} onChange={setIsVerified} label="Verified" />
          <Toggle checked={isLiked} onChange={setIsLiked} label="Liked" />
          <Toggle checked={isPinned} onChange={setIsPinned} label="Pinned" />
          <Toggle checked={isLikedByCreator} onChange={setIsLikedByCreator} label="Liked by Creator" />
        </div>

        <hr className="border-slate-200 dark:border-slate-800 my-4" />

        <Toggle checked={hasReply} onChange={setHasReply} label="Include Reply" />

        {hasReply && (
          <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
            <Field label="Reply Username">
              <TextInput value={replyUsername} onChange={setReplyUsername} />
            </Field>
            <Field label="Reply Avatar URL">
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
