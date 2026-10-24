"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolShell, Field, TextArea, TextInput, Toggle, Output, FileDrop, StatPill } from "@/components/ui/kit";

export default function Sha1EncryptDecrypt() {
  const [text, setText] = useState("Hello World");
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [compareHash, setCompareHash] = useState("");
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const computeHash = useCallback(async () => {
    try {
      let buffer: ArrayBuffer;
      if (file) {
        buffer = await file.arrayBuffer();
      } else {
        const encoded = new TextEncoder().encode(text);
        buffer = encoded.buffer as ArrayBuffer;
      }
      const digest = await crypto.subtle.digest("SHA-1", buffer);
      const hashArray = Array.from(new Uint8Array(digest));
      let hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      if (uppercase) hex = hex.toUpperCase();
      setHash(hex);
    } catch {
      setHash("Error generating hash");
    }
  }, [text, file, uppercase]);

  useEffect(() => {
    computeHash();
  }, [computeHash]);

  useEffect(() => {
    if (!compareHash.trim()) {
      setIsMatch(null);
    } else {
      setIsMatch(compareHash.trim().toLowerCase() === hash.toLowerCase());
    }
  }, [compareHash, hash]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Hash Length" value={`${hash.length} chars (160 bits)`} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SHA-1 is cryptographically broken for collision resistance. Use SHA-256 or stronger for anything
            security-relevant; this tool is for verification and legacy checks.
          </p>

          <Output text={hash} label="SHA-1 Hash" filename="sha1-hash.txt" />

          <Field label="Compare with Expected Hash" hint="Paste a hash to verify if it matches">
            <TextInput
              value={compareHash}
              onChange={setCompareHash}
              placeholder="e.g. 0a4d55a8d778e5022fab701977c5d..."
              mono
            />
          </Field>

          {isMatch !== null && (
            <div
              className={`rounded-xl p-3 text-center text-xs font-semibold ${
                isMatch
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              }`}
            >
              {isMatch ? "MATCH: Hashes are identical!" : "MISMATCH: Hashes do not match"}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Text">
          <TextArea
            value={text}
            onChange={setText}
            placeholder="Enter text to generate SHA-1 hash..."
            rows={5}
            mono
          />
        </Field>

        <Field label="Or Upload File for Hashing">
          <FileDrop
            onFiles={(files) => {
              if (files.length > 0) setFile(files[0]);
            }}
            label="Drop a file here to calculate its SHA-1 hash"
          />
        </Field>

        <Toggle checked={uppercase} onChange={setUppercase} label="Uppercase Output Hex" />
      </div>
    </ToolShell>
  );
}
