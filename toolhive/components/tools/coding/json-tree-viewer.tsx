"use client";

import React, { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, TextInput, Btn, Output, StatPill } from "@/components/ui/kit";
import { copyToClipboard } from "@/lib/download";

// Recursive TreeNode Component
interface TreeNodeProps {
  data: unknown;
  name?: string;
  path: string;
  depth: number;
  expandedMap: Record<string, boolean>;
  toggleExpand: (path: string) => void;
  filterQuery: string;
  onCopyPath: (path: string) => void;
}

function TreeNode({
  data,
  name,
  path,
  depth,
  expandedMap,
  toggleExpand,
  filterQuery,
  onCopyPath,
}: TreeNodeProps) {
  const isExpanded = expandedMap[path] ?? (depth < 2);

  // Filter check
  const matchesFilter = (val: unknown, keyName?: string): boolean => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    if (keyName && keyName.toLowerCase().includes(q)) return true;
    if (val === null) return "null".includes(q);
    if (typeof val === "boolean" || typeof val === "number") return String(val).toLowerCase().includes(q);
    if (typeof val === "string") return val.toLowerCase().includes(q);
    if (typeof val === "object") {
      return Object.entries(val as Record<string, unknown>).some(([k, v]) => matchesFilter(v, k));
    }
    return false;
  };

  if (filterQuery && !matchesFilter(data, name)) {
    return null;
  }

  const renderValue = () => {
    if (data === null) {
      return <span className="font-mono text-xs text-rose-500 italic">null</span>;
    }
    if (typeof data === "boolean") {
      return <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">{String(data)}</span>;
    }
    if (typeof data === "number") {
      return <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">{data}</span>;
    }
    if (typeof data === "string") {
      return (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all">
          &quot;{data}&quot;
        </span>
      );
    }
    return null;
  };

  if (data === null || typeof data !== "object") {
    return (
      <div className="flex items-center gap-1.5 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded px-1.5 transition text-xs font-mono">
        {name !== undefined && (
          <button
            type="button"
            onClick={() => onCopyPath(path)}
            title={`Click to copy path: ${path}`}
            className="text-slate-600 dark:text-slate-300 font-semibold hover:text-hive-500 hover:underline cursor-pointer"
          >
            {name}:
          </button>
        )}
        {renderValue()}
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = Object.entries(data as Record<string, unknown>);
  const count = entries.length;

  return (
    <div className="py-0.5 font-mono text-xs">
      <div className="flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded px-1 py-0.5 transition">
        <button
          type="button"
          onClick={() => toggleExpand(path)}
          className="flex h-4 w-4 items-center justify-center rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
        >
          {isExpanded ? "▼" : "▶"}
        </button>

        {name !== undefined && (
          <button
            type="button"
            onClick={() => onCopyPath(path)}
            title={`Click to copy path: ${path}`}
            className="text-slate-700 dark:text-slate-200 font-bold hover:text-hive-500 hover:underline"
          >
            {name}:
          </button>
        )}

        <span className="text-slate-400 font-semibold">
          {isArray ? "[" : "{"}
        </span>

        {!isExpanded && (
          <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {isArray ? `${count} items` : `${count} keys`}
          </span>
        )}

        {!isExpanded && (
          <span className="text-slate-400 font-semibold">
            {isArray ? "]" : "}"}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="pl-4 border-l border-slate-200 dark:border-slate-800 my-0.5 ml-2 space-y-0.5">
          {entries.map(([key, value]) => {
            const childPath = isArray
              ? `${path}[${key}]`
              : path
              ? `${path}.${key}`
              : key;

            return (
              <TreeNode
                key={key}
                data={value}
                name={isArray ? `[${key}]` : key}
                path={childPath}
                depth={depth + 1}
                expandedMap={expandedMap}
                toggleExpand={toggleExpand}
                filterQuery={filterQuery}
                onCopyPath={onCopyPath}
              />
            );
          })}
          <div className="text-slate-400 font-semibold py-0.5">{isArray ? "]" : "}"}</div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_JSON = `{
  "app": "ToolHive",
  "version": "1.0.0",
  "status": "active",
  "activeUsers": 1250,
  "features": ["JSON Viewer", "Code to Image", "Slug Generator"],
  "settings": {
    "darkMode": true,
    "maxUploadMb": 50,
    "supportEmail": null
  },
  "developers": [
    { "id": 1, "name": "Alice", "role": "Frontend Lead" },
    { "id": 2, "name": "Bob", "role": "Backend Architect" }
  ]
}`;

export default function JsonTreeViewer() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON);
  const [filterQuery, setFilterQuery] = useState("");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  // Parse state
  const { parsedJson, error } = useMemo(() => {
    if (!jsonText.trim()) {
      return { parsedJson: null, error: null };
    }
    try {
      const parsed = JSON.parse(jsonText);
      return { parsedJson: parsed, error: null };
    } catch (err) {
      return { parsedJson: null, error: (err as Error).message };
    }
  }, [jsonText]);

  const toggleExpand = (path: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [path]: !(prev[path] ?? true),
    }));
  };

  const handleExpandAll = () => {
    setExpandedMap({});
  };

  const handleCollapseAll = () => {
    if (!parsedJson || typeof parsedJson !== "object") return;
    const collapsed: Record<string, boolean> = {};

    const collapseRecursive = (val: unknown, path: string) => {
      if (val && typeof val === "object") {
        collapsed[path] = false;
        Object.entries(val as Record<string, unknown>).forEach(([k, v]) => {
          const childPath = Array.isArray(val) ? `${path}[${k}]` : path ? `${path}.${k}` : k;
          collapseRecursive(v, childPath);
        });
      }
    };

    collapseRecursive(parsedJson, "");
    setExpandedMap(collapsed);
  };

  const handleCopyPath = async (path: string) => {
    if (!path) return;
    await copyToClipboard(path);
    setCopyNotice(`Copied path: ${path}`);
    setTimeout(() => setCopyNotice(null), 2000);
  };

  const prettyJson = useMemo(() => {
    if (parsedJson === null) return "";
    return JSON.stringify(parsedJson, null, 2);
  }, [parsedJson]);

  // Count total keys / nodes
  const nodeCount = useMemo(() => {
    if (!parsedJson) return 0;
    let count = 0;
    const countNodes = (val: unknown) => {
      count++;
      if (val && typeof val === "object") {
        Object.values(val as Record<string, unknown>).forEach(countNodes);
      }
    };
    countNodes(parsedJson);
    return count;
  }, [parsedJson]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Interactive Tree View
            </span>
            <div className="flex gap-2">
              <Btn variant="outline" className="!px-2.5 !py-1 !text-xs" onClick={handleExpandAll}>
                Expand All
              </Btn>
              <Btn variant="outline" className="!px-2.5 !py-1 !text-xs" onClick={handleCollapseAll}>
                Collapse All
              </Btn>
            </div>
          </div>

          <TextInput
            value={filterQuery}
            onChange={setFilterQuery}
            placeholder="Search keys or values in JSON tree..."
          />

          {copyNotice && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ {copyNotice}
            </div>
          )}

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-mono text-rose-600 dark:text-rose-400">
              <p className="font-bold mb-1">Invalid JSON Syntax:</p>
              <p className="break-all">{error}</p>
            </div>
          ) : parsedJson !== null ? (
            <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <TreeNode
                data={parsedJson}
                path=""
                depth={0}
                expandedMap={expandedMap}
                toggleExpand={toggleExpand}
                filterQuery={filterQuery}
                onCopyPath={handleCopyPath}
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-xs text-slate-400 dark:border-slate-800">
              Paste JSON input to render tree structure.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Total Nodes" value={nodeCount} />
            <StatPill label="Formatted Size" value={`${prettyJson.length} B`} />
          </div>

          {parsedJson !== null && (
            <Output
              text={prettyJson}
              label="Formatted Raw JSON"
              filename="formatted.json"
              mono
            />
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="JSON Input Text">
          <TextArea
            value={jsonText}
            onChange={setJsonText}
            placeholder="Paste raw JSON here..."
            rows={14}
            mono
          />
        </Field>
      </div>
    </ToolShell>
  );
}
