"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select, FileDrop } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard, DEFAULT_POST_BG } from "./_feed";

export default function TikTokPostGenerator() {
  const [username, setUsername] = useState("creative_mind");
  const [displayName, setDisplayName] = useState("Creative Mind");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [bgImage, setBgImage] = useState(DEFAULT_POST_BG);
  const [caption, setCaption] = useState("Building a full social tool suite in 10 minutes! What generator should I make next? 🔥 #coding #dev #ui #tech");
  const [likes, setLikes] = useState("1.4M");
  const [comments, setComments] = useState("8,320");
  const [bookmarks, setBookmarks] = useState("94.2K");
  const [shares, setShares] = useState("12.5K");
  const [musicTitle, setMusicTitle] = useState("Original Sound - @creative_mind");

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setBgImage(url);
    }
  };

  return (
    <ToolShell
      side={
        <MockupExportCard filename="tiktok-post.png">
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
            {/* Background Image / Frame */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Bottom Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Top Navigation Tabs */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                fontSize: "15px",
                fontWeight: 600,
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ opacity: 0.6 }}>Following</span>
              <span style={{ borderBottom: "2px solid #ffffff", paddingBottom: "2px" }}>For You</span>
            </div>

            {/* Right Action Rail */}
            <div
              style={{
                position: "absolute",
                right: 12,
                bottom: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
                zIndex: 10,
              }}
            >
              {/* Profile Avatar + Plus */}
              <div style={{ position: "relative" }}>
                <Avatar src={avatarUrl} name={username} size={42} className="border-2 border-white" />
                <div
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fe2c55",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  +
                </div>
              </div>

              {/* Like Icon */}
              <div style={{ textAlign: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fe2c55">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{likes}</div>
              </div>

              {/* Comment Icon */}
              <div style={{ textAlign: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                </svg>
                <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{comments}</div>
              </div>

              {/* Bookmark Icon */}
              <div style={{ textAlign: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#facc15">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{bookmarks}</div>
              </div>

              {/* Share Icon */}
              <div style={{ textAlign: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M10 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                </svg>
                <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "2px" }}>{shares}</div>
              </div>

              {/* Spinning Disc Cover */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#222",
                  border: "3px solid #333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Avatar src={avatarUrl} name={username} size={24} />
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 12,
                right: 70,
                zIndex: 10,
              }}
            >
              {/* @Handle */}
              <div style={{ fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <span>@{username}</span>
                {isVerified && <VerifiedBadge type="tiktok" size={14} />}
              </div>

              {/* Caption Text */}
              <div style={{ fontSize: "13px", lineHeight: "1.35", marginTop: "4px", wordBreak: "break-word" }}>
                {caption}
              </div>

              {/* Music Marquee */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "12px", opacity: 0.9 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {musicTitle}
                </span>
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          TikTok Post Generator
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Username (@)">
            <TextInput value={username} onChange={setUsername} />
          </Field>
          <Field label="Display Name">
            <TextInput value={displayName} onChange={setDisplayName} />
          </Field>
        </div>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Background Image">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Upload background photo" />
        </Field>

        <Field label="Caption & Hashtags">
          <TextArea value={caption} onChange={setCaption} rows={3} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Likes">
            <TextInput value={likes} onChange={setLikes} />
          </Field>
          <Field label="Comments">
            <TextInput value={comments} onChange={setComments} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Bookmarks">
            <TextInput value={bookmarks} onChange={setBookmarks} />
          </Field>
          <Field label="Shares">
            <TextInput value={shares} onChange={setShares} />
          </Field>
        </div>

        <Field label="Music Track Title">
          <TextInput value={musicTitle} onChange={setMusicTitle} />
        </Field>

        <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />
      </div>
    </ToolShell>
  );
}
