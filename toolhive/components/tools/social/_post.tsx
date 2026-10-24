"use client";

import React, { ReactNode } from "react";

/**
 * Format large numbers into social media style (e.g., 14.5K, 2.1M)
 */
export function formatStat(value: number | string): string {
  if (typeof value === "string") {
    if (value.trim() === "") return "0";
    const parsed = parseFloat(value.replace(/,/g, ""));
    if (isNaN(parsed)) return value;
    value = parsed;
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toLocaleString("en-US");
}

/**
 * Convert File to Data URL string for client-side preview
 */
export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Avatar helper with initials fallback
 */
export function Avatar({
  src,
  name,
  size = 40,
  shape = "circle",
  className = "",
}: {
  src?: string;
  name: string;
  size?: number;
  shape?: "circle" | "square";
  className?: string;
}) {
  const getInitials = (str: string) => {
    if (!str) return "U";
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getBgColor = (str: string) => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#f97316",
      "#10b981",
      "#06b6d4",
      "#6366f1",
      "#e11d48",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const rounded = shape === "circle" ? "rounded-full" : "rounded-xl";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`object-cover ${rounded} ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
       loading="lazy" decoding="async" />
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-bold text-white shadow-sm ${rounded} ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: getBgColor(name),
        fontSize: Math.max(12, Math.floor(size * 0.4)),
      }}
    >
      {getInitials(name)}
    </div>
  );
}

/**
 * Verified badge SVGs for platforms
 */
export function VerifiedBadge({
  type = "blue",
  size = 18,
  className = "",
}: {
  type?: "blue" | "gold" | "grey" | "linkedin" | "green";
  size?: number;
  className?: string;
}) {
  if (type === "gold") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`inline-block ${className}`}
      >
        <path
          d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
          fill="#EAB308"
        />
        <path
          d="M10.2 16.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (type === "grey") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`inline-block ${className}`}
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="#64748B"
        />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`inline-block ${className}`}
      >
        <path
          d="M12 2L15.09 5.26L19.54 5.76L20.04 10.21L23.3 13.3L21.36 17.38L21.86 21.83L17.41 22.33L14.33 25.59L10.25 23.65L5.8 24.15L5.3 19.7L2.04 16.61L3.98 12.53L3.48 8.08L7.93 7.58L11 4.32L12 2Z"
          fill="#0A66C2"
        />
        <path
          d="M9.5 16.5L5.5 12.5L6.91 11.09L9.5 13.67L16.59 6.58L18 8L9.5 16.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Default Blue check
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block ${className}`}
    >
      <path
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
        fill="#1D9BF0"
      />
      <path
        d="M10.2 16.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Common Social Action Icons
 */
export function HeartIcon({
  filled = false,
  size = 20,
  color = "currentColor",
}: {
  filled?: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function CommentIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function RepostIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function ShareIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function BookmarkIcon({
  filled = false,
  size = 20,
  color = "currentColor",
}: {
  filled?: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function EyeIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function DotsIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function ThumbsUpIcon({
  filled = false,
  size = 20,
  color = "currentColor",
}: {
  filled?: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={filled ? "0" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/**
 * Exportable Card Wrapper to ensure explicit inline styles for html-to-image
 */
export function ExportableCard({
  children,
  bgColor = "#ffffff",
  textColor = "#0f172a",
  className = "",
  innerRef,
}: {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className={`rounded-2xl p-6 shadow-xl transition-all ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
