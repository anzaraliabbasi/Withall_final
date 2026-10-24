"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard } from "./_feed";

export default function InstagramCommentGenerator() {
  const [username, setUsername] = useState("alex_design");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [commentText, setCommentText] = useState("This UI design looks absolutely incredible! 🔥 Amazing work on the layout details.");
  const [timeAgo, setTimeAgo] = useState("2h");
  const [likesCount, setLikesCount] = useState("1,420");
  const [isLiked, setIsLiked] = useState(true);
  const [isLikedByCreator, setIsLikedByCreator] = useState(true);
  const [creatorAvatarUrl, setCreatorAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [creatorName, setCreatorName] = useState("toolhive");
  const [isPinned, setIsPinned] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [hasReply, setHasReply] = useState(true);
  const [replyUsername, setReplyUsername] = useState("toolhive");
  const [replyAvatarUrl, setReplyAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [replyText, setReplyText] = useState("Thank you so much! Really appreciate the feedback 🙌");
  const [replyTimeAgo, setReplyTimeAgo] = useState("1h");
  const [replyLikesCount, setReplyLikesCount] = useState("89");

  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#ffffff";
  const textColor = isDark ? "#f5f5f5" : "#0f1419";
  const mutedColor = isDark ? "#a8a8a8" : "#737373";

  return (
    <ToolShell
      side={
        <MockupExportCard filename="instagram-comment.png">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: 380,
              padding: "16px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Pinned banner if active */}
            {isPinned && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: mutedColor,
                  marginBottom: "10px",
                  fontWeight: 600,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                Pinned comment
              </div>
            )}

            {/* Main comment container */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Avatar src={avatarUrl} name={username} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header line: username + verified + comment */}
                <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                  <span style={{ fontWeight: 600, marginRight: "4px" }}>
                    {username}
                  </span>
                  {isVerified && <VerifiedBadge type="instagram" size={14} />}
                  <span style={{ marginLeft: isVerified ? "4px" : "0px", wordBreak: "break-word" }}>
                    {" "}{commentText}
                  </span>
                </div>

                {/* Sub-line: time, likes, reply button */}
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
                  {likesCount && <span>{likesCount} likes</span>}
                  <span style={{ cursor: "pointer" }}>Reply</span>
                  <span style={{ cursor: "pointer" }}>See translation</span>
                </div>

                {/* Creator liked badge */}
                {isLikedByCreator && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "6px",
                      fontSize: "12px",
                      color: mutedColor,
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <Avatar src={creatorAvatarUrl} name={creatorName} size={16} />
                      <div
                        style={{
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          backgroundColor: "#ed4956",
                          borderRadius: "50%",
                          padding: "1px",
                          display: "flex",
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    </div>
                    <span>Liked by author</span>
                  </div>
                )}
              </div>

              {/* Like Heart Button */}
              <div style={{ paddingLeft: "4px", paddingTop: "4px" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#ed4956" : "none"}
                  stroke={isLiked ? "#ed4956" : mutedColor}
                  strokeWidth="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>

            {/* Reply thread */}
            {hasReply && (
              <div style={{ marginTop: "16px", paddingLeft: "48px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Avatar src={replyAvatarUrl} name={replyUsername} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                      <span style={{ fontWeight: 600, marginRight: "4px" }}>
                        {replyUsername}
                      </span>
                      <VerifiedBadge type="instagram" size={13} />
                      <span style={{ marginLeft: "4px", wordBreak: "break-word" }}>
                        {replyText}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "11px",
                        color: mutedColor,
                        marginTop: "4px",
                        fontWeight: 500,
                      }}
                    >
                      <span>{replyTimeAgo}</span>
                      {replyLikesCount && <span>{replyLikesCount} likes</span>}
                      <span style={{ cursor: "pointer" }}>Reply</span>
                    </div>
                  </div>
                  <div style={{ paddingLeft: "4px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={mutedColor} strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
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
          Instagram Comment Generator
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
            <TextInput value={username} onChange={setUsername} placeholder="username" />
          </Field>
        </div>

        <Field label="Avatar Image URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..." />
        </Field>

        <Field label="Comment Text">
          <TextArea value={commentText} onChange={setCommentText} rows={3} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} placeholder="2h" />
          </Field>
          <Field label="Likes Count">
            <TextInput value={likesCount} onChange={setLikesCount} placeholder="1,420" />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />
          <Toggle checked={isLiked} onChange={setIsLiked} label="Liked Heart" />
          <Toggle checked={isPinned} onChange={setIsPinned} label="Pinned Comment" />
          <Toggle checked={isLikedByCreator} onChange={setIsLikedByCreator} label="Liked by Author" />
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
