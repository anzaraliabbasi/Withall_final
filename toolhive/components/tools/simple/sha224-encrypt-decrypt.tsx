"use client";

import { useState, useEffect } from "react";
import { ToolShell, Field, TextArea, TextInput, Toggle, Output, StatPill } from "@/components/ui/kit";

/* ---- In-file SHA-224 implementation (FIPS 180-4). SHA-224 = SHA-256 core with a
   different initial state, truncated to 28 bytes. Web Crypto does not expose it,
   so it is implemented directly. ---- */

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

function sha224Bytes(bytes: Uint8Array): string {
  const ml = bytes.length;
  // SHA-224 initial state
  let h0 = 0xc1059ed8, h1 = 0x367cd507, h2 = 0x3070dd17, h3 = 0xf70e5939;
  let h4 = 0xffc00b31, h5 = 0x68581511, h6 = 0x64f98fa7, h7 = 0xbefa4fa4;

  // padded message length: ml + 1 + zeros + 8, multiple of 64
  const withLen = ml + 9;
  const total = Math.ceil(withLen / 64) * 64;
  const msg = new Uint8Array(total);
  msg.set(bytes);
  msg[ml] = 0x80;
  const bitLenHi = Math.floor((ml * 8) / 0x100000000);
  const bitLenLo = (ml * 8) >>> 0;
  // big-endian 64-bit length in last 8 bytes
  msg[total - 4] = (bitLenLo >>> 24) & 0xff;
  msg[total - 3] = (bitLenLo >>> 16) & 0xff;
  msg[total - 2] = (bitLenLo >>> 8) & 0xff;
  msg[total - 1] = bitLenLo & 0xff;
  msg[total - 8] = (bitLenHi >>> 24) & 0xff;
  msg[total - 7] = (bitLenHi >>> 16) & 0xff;
  msg[total - 6] = (bitLenHi >>> 8) & 0xff;
  msg[total - 5] = bitLenHi & 0xff;

  const w = new Int32Array(64);
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      w[i] = (msg[j] << 24) | (msg[j + 1] << 16) | (msg[j + 2] << 8) | msg[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g; g = f; f = e;
      e = (d + t1) | 0;
      d = c; c = b; b = a;
      a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }

  const words = [h0, h1, h2, h3, h4, h5, h6]; // SHA-224: first 7 words
  const hexChars = "0123456789abcdef";
  let out = "";
  for (const word of words) {
    for (let j = 28; j >= 0; j -= 4) {
      const nib = (word >>> j) & 0xf;
      out += hexChars[nib];
    }
  }
  return out;
}

export default function Sha224EncryptDecrypt() {
  const [text, setText] = useState("Hello World");
  const [uppercase, setUppercase] = useState(false);
  const [compareHash, setCompareHash] = useState("");

  const hash = sha224Bytes(new TextEncoder().encode(text));
  const display = uppercase ? hash.toUpperCase() : hash;
  const isMatch = compareHash.trim() ? compareHash.trim().toLowerCase() === hash.toLowerCase() : null;

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Hash Length" value={`${display.length} chars (224 bits)`} />

          <Output text={display} label="SHA-224 Hash" filename="sha224-hash.txt" />

          <Field label="Compare with Expected Hash" hint="Paste a hash to verify if it matches">
            <TextInput
              value={compareHash}
              onChange={setCompareHash}
              placeholder="e.g. 2f21d2f9e77a2f8ba2b9f..."
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
        <Field label="Input Text" hint="Hashing runs live as you type">
          <TextArea
            value={text}
            onChange={setText}
            placeholder="Enter text to generate SHA-224 hash..."
            rows={6}
            mono
          />
        </Field>
        <Toggle checked={uppercase} onChange={setUppercase} label="Uppercase Output Hex" />
      </div>
    </ToolShell>
  );
}
