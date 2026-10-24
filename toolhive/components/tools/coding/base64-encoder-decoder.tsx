"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Toggle, Select, FileDrop, Output, StatPill, Btn } from "@/components/ui/kit";

function utf8ToBase64(str: string, urlSafe: boolean): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binString = "";
    bytes.forEach((b) => {
      binString += String.fromCharCode(b);
    });
    let base64 = btoa(binString);
    if (urlSafe) {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return base64;
  } catch {
    return "Error encoding UTF-8 text to Base64";
  }
}

function base64ToUtf8(base64: string, urlSafe: boolean): string {
  try {
    let normalized = base64.trim();
    if (urlSafe) {
      normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
      while (normalized.length % 4) {
        normalized += "=";
      }
    }
    const binString = atob(normalized);
    const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (err) {
    return `Invalid Base64 string: ${(err as Error).message}`;
  }
}

export default function Base64EncoderDecoder() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [inputText, setInputText] = useState("Hello ToolHive 🐝 Base64 Converter!");

  // File state
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
    dataUrl: string;
  } | null>(null);

  const textOutput = useMemo(() => {
    if (mode === "encode") {
      return utf8ToBase64(inputText, urlSafe);
    } else {
      return base64ToUtf8(inputText, urlSafe);
    }
  }, [inputText, mode, urlSafe]);

  const handleFiles = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Str = dataUrl.split(",")[1] || "";
      setFileData({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        base64: base64Str,
        dataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolShell
      side={
        activeTab === "text" ? (
          <div className="space-y-4">
            <Output
              text={textOutput}
              label={mode === "encode" ? "Base64 Output" : "Decoded Text"}
              filename={mode === "encode" ? "encoded.b64" : "decoded.txt"}
              mono
            />
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Input Chars" value={inputText.length} />
              <StatPill label="Output Chars" value={textOutput.length} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {fileData ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold text-slate-500">File Details</p>
                  <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 break-all">
                    {fileData.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(fileData.size / 1024).toFixed(2)} KB • {fileData.type}
                  </p>

                  {fileData.type.startsWith("image/") && (
                    <div className="mt-3 flex justify-center rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileData.dataUrl}
                        alt="Preview"
                        className="max-h-36 rounded object-contain"
                       loading="lazy" decoding="async" />
                    </div>
                  )}
                </div>

                <Output
                  text={fileData.dataUrl}
                  label="Data URL (data:...;base64,...)"
                  filename={`${fileData.name}.txt`}
                  mono
                />

                <Output
                  text={fileData.base64}
                  label="Raw Base64 String"
                  filename={`${fileData.name}.b64`}
                  mono
                />
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-400 dark:border-slate-700">
                <p className="text-sm">Upload a file on the left to inspect Base64 data.</p>
              </div>
            )}
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              activeTab === "text"
                ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Text Mode
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              activeTab === "file"
                ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
            onClick={() => setActiveTab("file")}
          >
            File to Base64 Mode
          </button>
        </div>

        {activeTab === "text" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Operation">
                <Select
                  value={mode}
                  onChange={(v) => setMode(v as "encode" | "decode")}
                  options={[
                    { value: "encode", label: "Encode (Text → Base64)" },
                    { value: "decode", label: "Decode (Base64 → Text)" },
                  ]}
                />
              </Field>

              <div className="flex items-end pb-2">
                <Toggle
                  checked={urlSafe}
                  onChange={setUrlSafe}
                  label="URL-Safe Base64 (- and _)"
                />
              </div>
            </div>

            <Field label={mode === "encode" ? "Source Text" : "Base64 Input"}>
              <TextArea
                value={inputText}
                onChange={setInputText}
                placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste base64 string..."}
                rows={8}
                mono
              />
            </Field>
          </>
        ) : (
          <div className="space-y-4">
            <Field label="Select File to Convert">
              <FileDrop onFiles={handleFiles} label="Drag & drop any file here to encode to Base64" />
            </Field>

            {fileData && (
              <Btn variant="outline" onClick={() => setFileData(null)}>
                Clear Selected File
              </Btn>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
