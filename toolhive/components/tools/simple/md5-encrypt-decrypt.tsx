"use client";

import { useState, useEffect } from "react";
import { ToolShell, Field, TextArea, TextInput, Toggle, Output, FileDrop, StatPill } from "@/components/ui/kit";

/* ---- In-file MD5 implementation (RFC 1321). Web Crypto does not offer MD5,
   so this is implemented directly. Based on the classic public-domain JS md5
   algorithm structure, adapted to strict TypeScript. ---- */

function md5cycle(x: Int32Array, k: Int32Array) {
  let [a, b, c, d] = [x[0], x[1], x[2], x[3]];

  const ff = (a2: number, b2: number, c2: number, d2: number, x2: number, s: number, ac: number) => {
    a2 = cmn((b2 & c2) | (~b2 & d2), a2, b2, x2, s, ac);
    return a2;
  };
  const gg = (a2: number, b2: number, c2: number, d2: number, x2: number, s: number, ac: number) => {
    a2 = cmn((b2 & d2) | (c2 & ~d2), a2, b2, x2, s, ac);
    return a2;
  };
  const hh = (a2: number, b2: number, c2: number, d2: number, x2: number, s: number, ac: number) => {
    a2 = cmn(b2 ^ c2 ^ d2, a2, b2, x2, s, ac);
    return a2;
  };
  const ii = (a2: number, b2: number, c2: number, d2: number, x2: number, s: number, ac: number) => {
    a2 = cmn(c2 ^ (b2 | ~d2), a2, b2, x2, s, ac);
    return a2;
  };

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function add32(a: number, b: number) {
  return (a + b) | 0;
}

function md5blk(bytes: Uint8Array, start: number): Int32Array {
  const md5blks = new Int32Array(16);
  for (let i = 0; i < 16; i++) {
    const j = start + i * 4;
    md5blks[i] = bytes[j] + (bytes[j + 1] << 8) + (bytes[j + 2] << 16) + (bytes[j + 3] << 24);
  }
  return md5blks;
}

function md51(bytes: Uint8Array): string {
  const n = bytes.length;
  const state = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
  let i: number;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(bytes, i - 64));
  }
  // tail: 0x80 + zero padding + 8-byte little-endian bit length
  const tail = new Uint8Array(64);
  const tailLen = n - (i - 64);
  tail.set(bytes.subarray(n - tailLen));
  tail[tailLen] = 0x80;
  const bitLen = n * 8;
  if (tailLen > 55) {
    const blk = md5blk(tail, 0);
    md5cycle(state, blk);
    tail.fill(0);
  }
  // write bit length little-endian into tail at 56..63
  tail[56] = bitLen & 0xff;
  tail[57] = (bitLen >>> 8) & 0xff;
  tail[58] = (bitLen >>> 16) & 0xff;
  tail[59] = (bitLen >>> 24) & 0xff;
  tail[60] = 0;
  tail[61] = 0;
  tail[62] = 0;
  tail[63] = 0;
  md5cycle(state, md5blk(tail, 0));

  const hexChars = "0123456789abcdef";
  let out = "";
  for (let s = 0; s < 4; s++) {
    const word = state[s];
    for (let j = 0; j < 4; j++) {
      const byte = (word >>> (j * 8)) & 0xff;
      out += hexChars.charAt((byte >>> 4) & 0x0f) + hexChars.charAt(byte & 0x0f);
    }
  }
  return out;
}

export default function Md5EncryptDecrypt() {
  const [text, setText] = useState("Hello World");
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [compareHash, setCompareHash] = useState("");

  const textHash = md51(new TextEncoder().encode(text));

  useEffect(() => {
    let cancelled = false;
    if (file) {
      file.arrayBuffer().then((buf) => {
        if (!cancelled) setFileHash(md51(new Uint8Array(buf)));
      });
    } else {
      setFileHash("");
    }
    return () => {
      cancelled = true;
    };
  }, [file]);

  const hash = file ? fileHash : textHash;
  const display = uppercase ? hash.toUpperCase() : hash;
  const isMatch = compareHash.trim()
    ? compareHash.trim().toLowerCase() === hash.toLowerCase()
    : null;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Hash Length" value={`${display.length} chars (128 bits)`} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            MD5 is not collision-resistant and should never be used to secure passwords. Use it for
            checksums, legacy data verification and file-integrity comparisons.
          </p>

          <Output text={display} label={`MD5 Hash${file ? ` of ${file.name}` : ""}`} filename="md5-hash.txt" />

          <Field label="Compare with Expected Hash" hint="Paste a hash to verify if it matches">
            <TextInput
              value={compareHash}
              onChange={setCompareHash}
              placeholder="e.g. b10a8db164e0754105b7a99be72e3fe5"
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
            placeholder="Enter text to generate MD5 hash..."
            rows={5}
            mono
          />
        </Field>

        <Field label="Or Upload File for Hashing" hint="Text input is ignored while a file is loaded">
          <FileDrop
            onFiles={(files) => {
              if (files.length > 0) setFile(files[0]);
              else setFile(null);
            }}
            label="Drop a file here to calculate its MD5 checksum"
          />
        </Field>

        {file && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        <Toggle checked={uppercase} onChange={setUppercase} label="Uppercase Output Hex" />
      </div>
    </ToolShell>
  );
}
