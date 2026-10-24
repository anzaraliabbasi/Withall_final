# ToolHive Tool Implementation Contract (READ FIRST)

Project: /app/conversations/6ad92361225726347b1385c8/toolhive
Stack: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v3. Dependencies already installed and importable: pdf-lib, qrcode, jsbarcode, html-to-image, clsx.

## HARD RULES
1. Create ONLY the .tsx files assigned to you, inside YOUR assigned folder: components/tools/<folder>/<slug>.tsx
   (private helpers allowed only as files prefixed with `_` inside YOUR folder).
2. Every tool file starts with `"use client";` and default-exports one React component (no props).
3. Every tool must ACTUALLY WORK — real client-side logic, no fake/demo-only UI. No "coming soon".
4. TypeScript strict-clean: no unused imports, no implicit any, handle null/undefined.
5. Styling: Tailwind classes only. Brand accent: hive (amber, e.g. bg-hive-500, text-hive-500). Neutral: slate. Dark mode must look right (use dark: variants). NEVER use custom CSS files or styled-components.
6. No external images. Inline SVG or emoji only. No new npm packages. NEVER run npm install or next build.
7. Do not edit any file outside your folder (not registry.ts, not package.json, nothing).

## SHARED UI KIT — import from "@/components/ui/kit":
- `<ToolShell side={...}>` wraps your tool UI in a card; two-column via side prop.
- `<Field label="X" hint="...">{children}</Field>` labels a control.
- `<Btn onClick={fn} variant="primary"|"outline" className="...">Text</Btn>`
- `<TextInput value onChange placeholder mono type />`
- `<TextArea value onChange placeholder rows mono />`
- `<Select value onChange options={[{value,label}]...} />`
- `<Range value onChange min max step suffix />` (number slider)
- `<ColorInput value onChange />` (color + hex text)
- `<Toggle checked onChange label />`
- `<Output text label filename mono />` (scrollable pre + Copy/Download buttons)
- `<CodeBox code language />` (code block with Copy button)
- `<FileDrop accept multiple onFiles label />` (drag & drop / browse; onFiles gets File[])
- `<StatPill label value />`
- `<PhoneFrame width>` — phone mockup chrome around children (for social mockups).
- `useMockupExport()` → `{ exportRef, exportPng }`. Put exportRef on the DOM node to download (a <div>), then `exportPng("name.png")` renders it to PNG at 2x via html-to-image and downloads it. For dark/mockup sections set explicit bg colors (html-to-image needs concrete colors, avoid inherited/dark: classes inside the export node — use literal Tailwind like bg-white / bg-[#0f172a]).

## SHARED DOWNLOAD HELPERS — import from "@/lib/download":
- downloadBlob(blob, filename), downloadText(text, filename, mime?)
- baseName(name) (strips extension), copyToClipboard(text) (async, returns bool)

## VERIFY BEFORE DONE
Run: cd /app/conversations/6ad92361225726347b1385c8/toolhive && npx tsc --noEmit 2>&1 | grep "components/tools/<your-folder>"
Iterate until YOUR files show zero errors (IGNORE errors in other folders; other agents work in parallel).

## REGISTERING
Do not touch the registry — the coordinator scans folders and generates it after all workers finish.
