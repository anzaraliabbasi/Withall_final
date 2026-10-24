"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolShell, Field, TextArea, TextInput, Select, Output, StatPill } from "@/components/ui/kit";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(base64);
  }
}

function base64UrlEncodeBytes(buffer: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    bin += String.fromCharCode(buffer[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeString(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return base64UrlEncodeBytes(bytes);
}

const DEFAULT_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtEncoderDecoder() {
  const [mode, setMode] = useState<"decode" | "encode">("decode");

  // Decode states
  const [jwtInput, setJwtInput] = useState(DEFAULT_JWT);
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [decodedSignature, setDecodedSignature] = useState("");
  const [decodeError, setDecodeError] = useState("");
  const [tokenStatus, setTokenStatus] = useState<string>("");

  // Encode states
  const [encodeHeader, setEncodeHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [encodePayload, setEncodePayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1516239022\n}');
  const [secretKey, setSecretKey] = useState("your-256-bit-secret");
  const [generatedToken, setGeneratedToken] = useState("");
  const [encodeError, setEncodeError] = useState("");

  // Decode handling
  useEffect(() => {
    if (mode !== "decode") return;
    setDecodeError("");
    setTokenStatus("");

    const parts = jwtInput.trim().split(".");
    if (parts.length !== 3) {
      setDecodeError("Invalid JWT format. Must contain 3 dot-separated parts (header.payload.signature).");
      setDecodedHeader("");
      setDecodedPayload("");
      setDecodedSignature("");
      return;
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const headerObj = JSON.parse(headerStr);
      setDecodedHeader(JSON.stringify(headerObj, null, 2));
    } catch {
      setDecodedHeader(parts[0]);
    }

    try {
      const payloadStr = base64UrlDecode(parts[1]);
      const payloadObj = JSON.parse(payloadStr);
      setDecodedPayload(JSON.stringify(payloadObj, null, 2));

      // Check claims
      if (typeof payloadObj === "object" && payloadObj !== null) {
        if ("exp" in payloadObj && typeof payloadObj.exp === "number") {
          const expDate = new Date(payloadObj.exp * 1000);
          const isExpired = Date.now() > expDate.getTime();
          setTokenStatus(
            isExpired
              ? `EXPIRED on ${expDate.toLocaleString()}`
              : `VALID (Expires: ${expDate.toLocaleString()})`
          );
        } else {
          setTokenStatus("No expiration claim (exp) set");
        }
      }
    } catch {
      setDecodedPayload(parts[1]);
    }

    setDecodedSignature(parts[2]);
  }, [jwtInput, mode]);

  // Encode handling
  const handleEncode = useCallback(async () => {
    if (mode !== "encode") return;
    setEncodeError("");

    try {
      // Validate JSON
      const parsedHeader = JSON.parse(encodeHeader);
      const parsedPayload = JSON.parse(encodePayload);

      const headerEnc = base64UrlEncodeString(JSON.stringify(parsedHeader));
      const payloadEnc = base64UrlEncodeString(JSON.stringify(parsedPayload));
      const dataToSign = `${headerEnc}.${payloadEnc}`;

      if (!secretKey) {
        setGeneratedToken(`${dataToSign}.`);
        return;
      }

      const enc = new TextEncoder();
      const keyData = enc.encode(secretKey);
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(dataToSign));
      const sigEnc = base64UrlEncodeBytes(new Uint8Array(signature));

      setGeneratedToken(`${dataToSign}.${sigEnc}`);
    } catch (err) {
      setEncodeError(err instanceof Error ? err.message : "Invalid JSON input");
      setGeneratedToken("");
    }
  }, [encodeHeader, encodePayload, secretKey, mode]);

  useEffect(() => {
    handleEncode();
  }, [handleEncode]);

  return (
    <ToolShell
      side={
        mode === "decode" ? (
          <div className="space-y-4">
            {tokenStatus && (
              <StatPill
                label="Token Status"
                value={tokenStatus.includes("EXPIRED") ? "Expired" : "Active / Decoded"}
              />
            )}
            {tokenStatus && (
              <p className="text-xs text-center font-medium text-slate-500 dark:text-slate-400">
                {tokenStatus}
              </p>
            )}

            {decodedHeader && (
              <Field label="Header">
                <pre className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-red-600 dark:border-slate-800 dark:bg-slate-950 dark:text-red-400">
                  {decodedHeader}
                </pre>
              </Field>
            )}

            {decodedPayload && (
              <Field label="Payload">
                <pre className="max-h-60 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-purple-600 dark:border-slate-800 dark:bg-slate-950 dark:text-purple-400">
                  {decodedPayload}
                </pre>
              </Field>
            )}

            {decodedSignature && (
              <Field label="Signature">
                <pre className="overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-cyan-600 dark:border-slate-800 dark:bg-slate-950 dark:text-cyan-400 break-all">
                  {decodedSignature}
                </pre>
              </Field>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {encodeError && (
              <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {encodeError}
              </div>
            )}
            <Output text={generatedToken} label="Encoded JWT" filename="token.jwt" />
          </div>
        )
      }
    >
      <div className="space-y-4">
        <Field label="Mode">
          <Select
            value={mode}
            onChange={(val) => setMode(val as "decode" | "encode")}
            options={[
              { value: "decode", label: "Decode JWT" },
              { value: "encode", label: "Encode / Sign JWT" },
            ]}
          />
        </Field>

        {mode === "decode" ? (
          <div className="space-y-4">
            <Field label="Encoded JWT Token" hint="Paste a JWT string header.payload.signature">
              <TextArea
                value={jwtInput}
                onChange={setJwtInput}
                placeholder="eyJhbGciOiJIUzI1Ni..."
                rows={6}
                mono
              />
            </Field>

            {decodeError && (
              <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {decodeError}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Header (JSON)">
              <TextArea
                value={encodeHeader}
                onChange={setEncodeHeader}
                rows={4}
                mono
              />
            </Field>

            <Field label="Payload (JSON)">
              <TextArea
                value={encodePayload}
                onChange={setEncodePayload}
                rows={7}
                mono
              />
            </Field>

            <Field label="Secret Key (HMAC-SHA256)" hint="Key used to sign token">
              <TextInput
                value={secretKey}
                onChange={setSecretKey}
                placeholder="Secret key"
                mono
              />
            </Field>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
