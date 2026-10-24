# DESIGN.md — ToolHive Design System

> The visual language that makes 117 different tools feel like one product.

---

## 1. Design Principles

1. **Calm surface, one accent.** ToolHive is a warm paper-like neutral canvas with a single amber accent (`hive`). Data and results get color; chrome never does.
2. **Tool first.** Every tool page: title → the interactive tool immediately → supporting SEO content after. The user is 100% of the way here for the tool; the tool is above the fold.
3. **Instant = trustworthy.** Live previews update as you type. No spinners for client-side work; progress only for genuinely heavy files.
4. **Consistent controls everywhere.** Same inputs, same buttons, same sliders on every tool — learn one, know all 117.
5. **Dark mode is a first-class citizen,** not an inverted afterthought.
6. **Mockups look real, chrome stays honest.** Social mockups reproduce platform styling faithfully (explicit hex, inside export nodes); the site around them never mimics another brand.

## 2. Color Palette

### Brand — "hive" amber (Tailwind custom scale)

| Token | Hex | Use |
|---|---|---|
| `hive-50` | `#FFFBEB` | Hero wash, subtle backgrounds |
| `hive-100` | `#FEF3C7` | Chips, hover washes |
| `hive-300` | `#FCD34D` | Decorative gradients |
| `hive-400` | `#FBBF24` | Hover state of primary buttons |
| `hive-500` | `#F59E0B` | **Primary accent** — buttons, links, focus rings, logo |
| `hive-600` | `#D97706` | Accent text (on light bg) |
| `hive-700+` | `#B45309…` | Deep accents |

Primary button: amber fill with **near-black text** (`text-slate-950`) — high contrast, no white-on-amber.

### Neutrals — Tailwind `slate`

| Role | Light | Dark |
|---|---|---|
| Page background | `#FAF9F6` (warm paper, not pure white) | `slate-950` |
| Card surface | white | `slate-900` |
| Border | `slate-200` | `slate-800` |
| Body text | `slate-800` | `slate-200` |
| Muted text | `slate-500` | `slate-400` |

### Semantic
- Success/positive: `emerald-600` / `dark:emerald-400`
- Error/destructive: `red-600` / `dark:red-400`
- Platform colors (mockups only, inline): WhatsApp `#25D366`, Telegram `#2AABEE`, iMessage `#0A84FF`, Messenger `#0084FF`, Discord `#313338`, Snapchat `#FFFC00`, Teams `#6264A7`, TikTok `#FE2C55/#010101`, YouTube `#FF0000`.

## 3. Typography

- **Family:** Inter (`next/font`, variable `--font-sans`) — body + UI. Fallback: `system-ui`.
- **Scale:**

| Element | Classes |
|---|---|
| Tool page H1 | `text-3xl sm:text-4xl font-extrabold tracking-tight` |
| Section H2 | `text-xl font-bold` |
| Card title | `font-bold` |
| Body | `text-sm leading-7` (SEO copy), `text-sm` (UI) |
| Labels | `text-xs font-semibold uppercase tracking-wide text-slate-500` |
| Code/output | `font-mono text-xs` |

- SEO article copy: `max-w-3xl text-slate-600 dark:text-slate-300`, relaxed line-height for readability.

## 4. UI Components

All defined in `components/ui/kit.tsx` + `globals.css`. **Use these — never rebuild them.**

| Component | Purpose | Notes |
|---|---|---|
| `.card` / `<ToolShell>` | Tool container | rounded-2xl, border, shadow-sm; `side` prop → 2-col layout (controls | preview) |
| `.btn-primary` / `.btn-outline` / `<Btn>` | Actions | amber vs bordered; `!px-3 !py-1.5 !text-xs` for compact |
| `.input-base` / `TextInput` `TextArea` `Select` `Range` `ColorInput` `Toggle` | Inputs | uniform 14px text, rounded-xl, amber focus ring (`focus:ring-hive-500/20`) |
| `<Field>` | Label + control + hint | uppercase micro-label |
| `<FileDrop>` | Drag & drop / browse | dashed 2px, amber on hover-drag; returns `File[]` |
| `<Output>` | Text results block | scrollable pre + Copy + Download buttons |
| `<CodeBox>` | CSS/code results | language tag chip + Copy |
| `<StatPill>` | Metric tiles | amber number, micro-label |
| `<PhoneFrame>` | Phone mockup chrome | for social generators |
| `useMockupExport()` | DOM → PNG download | 2× pixel ratio; remember explicit-hex rule inside exported nodes |
| `<ToolCard>` `<Header>` `<Footer>` | Site chrome | search, category menus, dark toggle |

### Layout patterns
- **Transform tools (text→text):** single column, input `TextArea` → live `<Output>`.
- **Generator tools (CSS/etc.):** `ToolShell side` two-column — controls left, preview + `<CodeBox>` right.
- **File tools:** `<FileDrop>` top, status/results below.
- **Mockup tools:** controls left (desktop) / stacked (mobile), mockup right, Download PNG prominent.
- Spacing rhythm: 4px grid (`gap-2/4/6`), cards `p-4 sm:p-6`, sections `mt-12` in SEO content.

## 5. Interaction details

- Focus states: amber ring 2px at 20% opacity on every input/button.
- Range sliders: `accent-hive-500`, value readout right-aligned.
- Copy buttons confirm with inline `Copied!` (`text-emerald-600`) — no toasts needed.
- Theme bootstrap script in `layout.tsx` head prevents dark-mode flash (FOUC).

## 6. Iconography & imagery

- Inline SVG line icons (stroke 1.5–2) or single emoji per category card max. No icon font, no external icon CDN.
- Logo: hexagon mark (`#F59E0B→#B45309` gradient) + "Tool**Hive**" wordmark.
