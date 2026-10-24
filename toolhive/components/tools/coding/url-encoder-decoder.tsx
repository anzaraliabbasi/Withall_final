"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Select, Toggle, Output, StatPill, Btn, TextInput } from "@/components/ui/kit";

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

export default function UrlEncoderDecoder() {
  const [activeTab, setActiveTab] = useState<"string" | "params">("string");

  // String mode state
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [engine, setEngine] = useState<"component" | "full">("component");
  const [encodeSpacesAsPlus, setEncodeSpacesAsPlus] = useState(false);
  const [inputText, setInputText] = useState(
    "https://example.com/search?q=React & TypeScript&category=web dev#results"
  );

  // Query Param mode state
  const [rawUrl, setRawUrl] = useState("https://api.example.com/v1/users?search=John Doe&status=active&sort=desc");
  const [baseUrlPath, setBaseUrlPath] = useState("https://api.example.com/v1/users");
  const [params, setParams] = useState<QueryParam[]>([
    { id: "1", key: "search", value: "John Doe" },
    { id: "2", key: "status", value: "active" },
    { id: "3", key: "sort", value: "desc" },
  ]);

  // Output string computation
  const stringOutput = useMemo(() => {
    if (!inputText) return "";
    try {
      if (mode === "encode") {
        let res = engine === "component" ? encodeURIComponent(inputText) : encodeURI(inputText);
        if (encodeSpacesAsPlus) {
          res = res.replace(/%20/g, "+");
        }
        return res;
      } else {
        let inputToDecode = inputText;
        if (encodeSpacesAsPlus) {
          inputToDecode = inputToDecode.replace(/\+/g, " ");
        }
        return engine === "component"
          ? decodeURIComponent(inputToDecode)
          : decodeURI(inputToDecode);
      }
    } catch (err) {
      return `URL Decoding Error: ${(err as Error).message}`;
    }
  }, [inputText, mode, engine, encodeSpacesAsPlus]);

  // Parse raw URL into params
  const handleParseUrl = () => {
    try {
      const qIndex = rawUrl.indexOf("?");
      if (qIndex === -1) {
        setBaseUrlPath(rawUrl);
        setParams([]);
        return;
      }
      const path = rawUrl.substring(0, qIndex);
      const queryString = rawUrl.substring(qIndex + 1);
      setBaseUrlPath(path);

      const parsedParams: QueryParam[] = [];
      const searchParams = new URLSearchParams(queryString);
      let idx = 1;
      searchParams.forEach((v, k) => {
        parsedParams.push({ id: String(idx++), key: k, value: v });
      });
      setParams(parsedParams);
    } catch {
      // Fallback
    }
  };

  // Re-build query URL
  const generatedQueryUrl = useMemo(() => {
    if (!baseUrlPath) return "";
    if (params.length === 0) return baseUrlPath;
    const searchParams = new URLSearchParams();
    params.forEach((p) => {
      if (p.key) {
        searchParams.append(p.key, p.value);
      }
    });
    const qStr = searchParams.toString();
    return qStr ? `${baseUrlPath}?${qStr}` : baseUrlPath;
  }, [baseUrlPath, params]);

  const handleAddParam = () => {
    setParams((prev) => [...prev, { id: String(Date.now()), key: "", value: "" }]);
  };

  const handleUpdateParam = (id: string, key: string, value: string) => {
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, key, value } : p)));
  };

  const handleDeleteParam = (id: string) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ToolShell
      side={
        activeTab === "string" ? (
          <div className="space-y-4">
            <Output
              text={stringOutput}
              label={mode === "encode" ? "Encoded URL Output" : "Decoded URL Output"}
              filename={mode === "encode" ? "encoded_url.txt" : "decoded_url.txt"}
              mono
            />
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Input Chars" value={inputText.length} />
              <StatPill label="Output Chars" value={stringOutput.length} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Output
              text={generatedQueryUrl}
              label="Reconstructed Encoded URL"
              filename="query_url.txt"
              mono
            />
            <div className="grid grid-cols-2 gap-3">
              <StatPill label="Total Parameters" value={params.length} />
              <StatPill label="URL Length" value={generatedQueryUrl.length} />
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* Tab switcher */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              activeTab === "string"
                ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
            onClick={() => setActiveTab("string")}
          >
            URL String Mode
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
              activeTab === "params"
                ? "bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
            onClick={() => setActiveTab("params")}
          >
            Query Parameters Mode
          </button>
        </div>

        {activeTab === "string" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Operation">
                <Select
                  value={mode}
                  onChange={(v) => setMode(v as "encode" | "decode")}
                  options={[
                    { value: "encode", label: "Encode URL" },
                    { value: "decode", label: "Decode URL" },
                  ]}
                />
              </Field>

              <Field label="Encoding Engine">
                <Select
                  value={engine}
                  onChange={(v) => setEngine(v as "component" | "full")}
                  options={[
                    { value: "component", label: "encodeURIComponent (All Special Chars)" },
                    { value: "full", label: "encodeURI (Preserve URL Structure)" },
                  ]}
                />
              </Field>
            </div>

            <Toggle
              checked={encodeSpacesAsPlus}
              onChange={setEncodeSpacesAsPlus}
              label="Encode spaces as '+' instead of '%20'"
            />

            <Field label={mode === "encode" ? "Raw Input URL or String" : "Encoded Input String"}>
              <TextArea
                value={inputText}
                onChange={setInputText}
                placeholder="Type or paste URL string..."
                rows={8}
                mono
              />
            </Field>
          </>
        ) : (
          <div className="space-y-4">
            <Field label="Paste Full URL to Parse" hint="Click Parse to extract path and query params">
              <div className="flex gap-2">
                <TextInput
                  value={rawUrl}
                  onChange={setRawUrl}
                  placeholder="https://example.com/path?key=value..."
                  mono
                />
                <Btn onClick={handleParseUrl}>Parse</Btn>
              </div>
            </Field>

            <Field label="Base Path / Endpoint">
              <TextInput value={baseUrlPath} onChange={setBaseUrlPath} mono />
            </Field>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Query Parameters
                </span>
                <Btn variant="outline" className="!px-3 !py-1 !text-xs" onClick={handleAddParam}>
                  + Add Parameter
                </Btn>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {params.map((param) => (
                  <div key={param.id} className="flex items-center gap-2">
                    <TextInput
                      value={param.key}
                      onChange={(k) => handleUpdateParam(param.id, k, param.value)}
                      placeholder="Param Key"
                      mono
                    />
                    <TextInput
                      value={param.value}
                      onChange={(v) => handleUpdateParam(param.id, param.key, v)}
                      placeholder="Param Value"
                      mono
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteParam(param.id)}
                      className="rounded p-2 text-rose-500 hover:bg-rose-500/10"
                      title="Remove Parameter"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {params.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-2">No query parameters added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
