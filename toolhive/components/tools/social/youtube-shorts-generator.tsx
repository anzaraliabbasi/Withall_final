"use client";

import React, { useState } from "react";
import { ToolShell, Field, TextInput, TextArea, Toggle, Select, FileDrop } from "@/components/ui/kit";
import { Avatar, VerifiedBadge, MockupExportCard, DEFAULT_POST_BG } from "./_feed";

export default function YoutubeShortsGenerator() {
  const [channelName, setChannelName] = useState("Tech Lab");
  const [avatarUrl, setAvatarUrl] = useState("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E");
  const [isVerified, setIsVerified] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videoTitle, setVideoTitle] = useState("Top 5 CSS tricks you probably didn't know existed! 💻⚡");
  const [bgImage, setBgImage] = useState(DEFAULT_POST_BG);
  const [likes, setLikes] = useState("245K");
  const [dislikes, setDislikes] = useState("Dislike");
  const [comments, setComments] = useState("4.2K");
  const [shares, setShares] = useState("18.9K");
  const [remix, setRemix] = useState("3.1K");
  const [audioTrack, setAudioTrack] = useState("Tech Lab • Original audio");

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setBgImage(URL.createObjectURL(files[0]));
    }
  };

  return (
    <ToolShell
      side={
        <MockupExportCard filename="youtube-shorts.png">
          <div
            style={{
              position: "relative",
              width: 320,
              height: 568,
              backgroundColor: "#000000",
              borderRadius: "24px",
              overflow: "hidden",
              fontFamily: "Roboto, Arial, sans-serif",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Background Video Frame */}
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

            {/* Top Navigation */}
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
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Shorts</div>
              <div style={{ display: "flex", gap: "16px", fontSize: "18px" }}>
                <span>🔍</span>
                <span>📷</span>
                <span>⋮</span>
              </div>
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
              {/* Like */}
              <div style={{ textAlign: "center" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  👍
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{likes}</div>
              </div>

              {/* Dislike */}
              <div style={{ textAlign: "center" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  👎
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{dislikes}</div>
              </div>

              {/* Comments */}
              <div style={{ textAlign: "center" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  💬
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{comments}</div>
              </div>

              {/* Share */}
              <div style={{ textAlign: "center" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ↗️
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{shares}</div>
              </div>

              {/* Remix */}
              <div style={{ textAlign: "center" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ♻️
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{remix}</div>
              </div>

              {/* Audio Thumb */}
              <div style={{ width: 36, height: 36, borderRadius: "8px", overflow: "hidden", border: "2px solid #ffffff" }}>
                <Avatar src={avatarUrl} name={channelName} size={32} />
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 12,
                right: 70,
                zIndex: 10,
              }}
            >
              {/* Channel Header + Subscribe button */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Avatar src={avatarUrl} name={channelName} size={32} />
                <span style={{ fontSize: "13px", fontWeight: 700 }}>@{channelName}</span>
                {isVerified && <VerifiedBadge type="youtube" size={13} />}

                {/* Red / Gray Subscribe button */}
                <div
                  style={{
                    backgroundColor: isSubscribed ? "rgba(255,255,255,0.2)" : "#cc0000",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "14px",
                    marginLeft: "4px",
                  }}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </div>
              </div>

              {/* Title */}
              <div style={{ fontSize: "13px", lineHeight: "1.35", marginTop: "8px", wordBreak: "break-word" }}>
                {videoTitle}
              </div>

              {/* Audio track line */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "11px", opacity: 0.9 }}>
                <span>🎵</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {audioTrack}
                </span>
              </div>
            </div>
          </div>
        </MockupExportCard>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          YouTube Shorts Generator
        </h2>

        <Field label="Channel Name">
          <TextInput value={channelName} onChange={setChannelName} />
        </Field>

        <Field label="Avatar URL">
          <TextInput value={avatarUrl} onChange={setAvatarUrl} />
        </Field>

        <Field label="Background Video Frame">
          <FileDrop onFiles={handleFileUpload} accept="image/*" label="Upload background photo" />
        </Field>

        <Field label="Video Title">
          <TextArea value={videoTitle} onChange={setVideoTitle} rows={2} />
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
          <Field label="Shares">
            <TextInput value={shares} onChange={setShares} />
          </Field>
          <Field label="Audio Track">
            <TextInput value={audioTrack} onChange={setAudioTrack} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle checked={isVerified} onChange={setIsVerified} label="Verified Badge" />
          <Toggle checked={isSubscribed} onChange={setIsSubscribed} label="Subscribed State" />
        </div>
      </div>
    </ToolShell>
  );
}
