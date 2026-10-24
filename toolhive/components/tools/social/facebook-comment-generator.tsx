"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard } from "./_feed";

export default function FacebookCommentGenerator() {
  const [authorName, setAuthorName] = useState("Sarah Jenkins");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [commentText, setCommentText] = useState("This is genuinely one of the best tips I've seen all week! Thanks for sharing this breakdown 🙌");
  const [timeAgo, setTimeAgo] = useState("3h");
  const [reactionCount, setReactionCount] = useState("42");
  const [topReaction, setTopReaction] = useState<"like" | "love" | "haha">("like");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [hasReply, setHasReply] = useState(true);
  const [replyName, setReplyName] = useState("Mark Spencer");
  const [replyAvatarUrl, setReplyAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E");
  const [replyText, setReplyText] = useState("Totally agree! Saved this post right away.");
  const [replyTimeAgo, setReplyTimeAgo] = useState("1h");

  const isDark = theme === "dark";
  const cardBg = isDark ? "#242526" : "#ffffff";
  const bubbleBg = isDark ? "#3a3b3c" : "#f0f2f5";
  const textColor = isDark ? "#e4e6eb" : "#050505";
  const mutedColor = isDark ? "#b0b3b8" : "#65676b";

  const getReactionIcon = (type: string) => {
    if (type === "love") return "❤️";
    if (type === "haha") return "😆";
    return "👍";
  };

  return (
    <ToolShell
      side={
        <MockupExportCard filename="facebook-comment.png">
          <div
            style={{
              backgroundColor: cardBg,
              color: textColor,
              width: 380,
              padding: "16px",
              fontFamily:
                "Segoe UI, Helvetica, Arial, sans-serif",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Top Comment */}
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <Avatar src={avatarUrl} name={authorName} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Gray Bubble */}
                <div
                  style={{
                    backgroundColor: bubbleBg,
                    borderRadius: "18px",
                    padding: "10px 14px",
                    position: "relative",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "2px" }}>
                    <span>{authorName}</span>
                    {isVerified && <VerifiedBadge type="facebook" size={13} />}
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.35", marginTop: "2px", wordBreak: "break-word" }}>
                    {commentText}
                  </div>

                  {/* Reaction Pill on bottom right */}
                  {reactionCount && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-8px",
                        right: "8px",
                        backgroundColor: isDark ? "#242526" : "#ffffff",
                        border: `1px solid ${isDark ? "#3e4042" : "#e4e6eb"}`,
                        borderRadius: "12px",
                        padding: "2px 6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "11px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>{getReactionIcon(topReaction)}</span>
                      <span style={{ fontWeight: 600, color: mutedColor }}>{reactionCount}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action links */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: mutedColor,
                    marginTop: "6px",
                    marginLeft: "12px",
                  }}
                >
                  <span style={{ cursor: "pointer" }}>Like</span>
                  <span style={{ cursor: "pointer" }}>Reply</span>
                  <span style={{ cursor: "pointer" }}>Share</span>
                  <span style={{ fontWeight: 400, fontSize: "11px" }}>{timeAgo}</span>
                </div>

                {/* Reply section */}
                {hasReply && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <Avatar src={replyAvatarUrl} name={replyName} size={28} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          backgroundColor: bubbleBg,
                          borderRadius: "16px",
                          padding: "8px 12px",
                          display: "inline-block",
                          maxWidth: "100%",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "12px" }}>{replyName}</div>
                        <div style={{ fontSize: "13px", marginTop: "2px", wordBreak: "break-word" }}>
                          {replyText}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: mutedColor,
                          marginTop: "4px",
                          marginLeft: "10px",
                        }}
                      >
                        <span style={{ cursor: "pointer" }}>Like</span>
                        <span style={{ cursor: "pointer" }}>Reply</span>
                        <span style={{ fontWeight: 400 }}>{replyTimeAgo}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Facebook Comment Generator
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
          <Field label="Author Name">
            <TextInput value={authorName} onChange={setAuthorName} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Comment Text">
          <TextArea value={commentText} onChange={setCommentText} rows={3} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Time Ago">
            <TextInput value={timeAgo} onChange={setTimeAgo} />
          </Field>
          <Field label="Reactions Count">
            <TextInput value={reactionCount} onChange={setReactionCount} />
          </Field>
          <Field label="Top Reaction">
            <Select
              value={topReaction}
              onChange={(v) => setTopReaction(v as "like" | "love" | "haha")}
              options={[
                { value: "like", label: "Like 👍" },
                { value: "love", label: "Love ❤️" },
                { value: "haha", label: "Haha 😆" },
              ]}
            />
          </Field>
        </div>

        <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />

        <hr className="border-slate-200 dark:border-slate-800 my-4" />

        <Toggle checked={hasReply} onChange={setHasReply} label="Include Nested Reply" />

        {hasReply && (
          <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
            <Field label="Reply Author">
              <TextInput value={replyName} onChange={setReplyName} />
            </Field>
            <Field label="Reply Avatar URL">
              <TextInput value={replyAvatarUrl} onChange={setReplyAvatarUrl} />
            </Field>
            <Field label="Reply Text">
              <TextArea value={replyText} onChange={setReplyText} rows={2} />
            </Field>
            <Field label="Reply Time">
              <TextInput value={replyTimeAgo} onChange={setReplyTimeAgo} />
            </Field>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
