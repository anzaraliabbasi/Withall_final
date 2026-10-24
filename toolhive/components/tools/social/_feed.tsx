"use client";

import React, { ReactNode } from "react";
import { useMockupExport, Btn } from "@/components/ui/kit";

export function formatCount(count: number | string): string {
  if (typeof count === "string") {
    if (count.trim() === "") return "0";
    if (isNaN(Number(count))) return count;
    count = Number(count);
  }
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
}

export function Avatar({
  src,
  name = "User",
  size = 40,
  className = "",
  bgColor = "#e2e8f0",
}: {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
  bgColor?: string;
}) {
  if (src && src.trim().length > 0) {
    return (
      <img
        src={src}
        alt={name}
        className={`object-cover rounded-full flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
       loading="lazy" decoding="async" />
    );
  }

  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-slate-700 select-none flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
}

export function VerifiedBadge({
  type = "instagram",
  size = 16,
}: {
  type?: "instagram" | "facebook" | "tiktok" | "youtube";
  size?: number;
}) {
  if (type === "youtube") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#606060] inline-block align-middle ml-1 flex-shrink-0"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    );
  }

  if (type === "tiktok") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#20d5ec"
        className="inline-block align-middle ml-1 flex-shrink-0"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    );
  }

  // Instagram & Facebook blue checkmark badge
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="inline-block align-middle ml-1 flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        d="M9 12l2 2 4-4"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function MockupExportCard({
  title = "Mockup Preview",
  filename = "social-mockup.png",
  children,
}: {
  title?: string;
  filename?: string;
  children: ReactNode;
}) {
  const { exportRef, exportPng } = useMockupExport();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        <Btn onClick={() => exportPng(filename)} variant="primary" className="!text-xs !py-1.5 !px-3">
          Download PNG
        </Btn>
      </div>

      <div className="flex justify-center items-center overflow-x-auto p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div ref={exportRef} className="inline-block">
          {children}
        </div>
      </div>
    </div>
  );
}

// Sample placeholder data URLs / SVGs for mockups
export const DEFAULT_AVATARS = [
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EA%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%230ea5e9%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EB%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect width=%22150%22 height=%22150%22 fill=%22%23a855f7%22/%3E%3Ctext x=%2250%%22 y=%2254%%22 font-family=%22Arial%22 font-size=%2275%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EC%3C/text%3E%3C/svg%3E",
];

export const DEFAULT_POST_BG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3C/svg%3E";
