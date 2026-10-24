# Worker specs

## W1 — components/tools/simple/ (text+security+color+misc, 25 tools)
text-to-handwriting-converter: render typed text onto canvas in handwriting style (load Google Fonts "Caveat","Homemade Apple","Liu Jian Mao Cao" by injecting a <link> in useEffect, wait for document.fonts.ready), paper options (lined/grid/plain), ink colors, font size, margins → download PNG (canvas.toBlob) and PDF via pdf-lib (embed the PNG on a letter-size page).
handwriting-to-font-converter: grid of boxes for A-Z, a-z, 0-9 glyphs the user draws in (each box is a small drawing canvas; support pen color + clear), then export a transparent PNG sprite sheet of all glyphs + an SVG per glyph download — label it "glyph sheet for font editors" honestly.
bionic-reading-converter: bold the first ~40% letters of each word via <b>, output as rich text + copy as HTML/text.
case-converter: upper/lower/title/sentence/camel/snake/kebab/alternating + language toggle (Turkish i).
lorem-ipsum-generator: built-in word bank, N paragraphs/sentences/words, start with "Lorem ipsum" toggle.
letter-counter: live counts (chars, chars-no-spaces, words, sentences, lines, paragraphs, reading time).
multiple-whitespace-remover: collapse spaces/lines, trim, remove tabs, optional custom char removal.
google-fonts-pair-finder: curated static list of ~40 nice heading+body Google font pairs (names + CSS via <link>), filter by vibe (modern/classic/playful/elegant), live preview text, copy CSS.
strong-random-password-generator: length slider, upper/lower/digits/symbols toggles, exclude-ambiguous, crypto.getRandomValues, strength meter, copy.
md5/sha1/sha224/sha256/sha384/sha512-encrypt-decrypt: SAME component pattern, dynamic import("crypto-sha...") is NOT available — use Web Crypto: crypto.subtle.digest("SHA-256"|"SHA-1"|"SHA-512", ...) — NOTE: MD5 and SHA-224/384: MD5 not in WebCrypto → implement a compact MD5 in-file (public-domain implementation you write yourself); SHA-224/384: implement by truncating/adjusting SHA-256/512? 224/384 are variants — implement compact in-file SHA-224 (SHA-256 variant) and SHA-384 via WebCrypto "SHA-512" is NOT valid (384 ≠ truncated 512 in digest length but 384 = truncate of 512 yes — SHA-384 is the same algorithm family, truncation works: digest("SHA-512") gives 64 bytes, but SHA-384 uses different IV → NOT a valid truncation. Implement SHA-384 via in-file variant too, or compute with subtle.digest("SHA-384") — WebCrypto DOES support "SHA-384"! Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512. So only MD5 and SHA-224 need in-file implementations.) Each page: input text or file → hash; also file hashing via arrayBuffer.
jwt-encoder-decoder: split header.payload, base64url decode, pretty JSON, signature display, encode back.
ai-color-palette-generator: pick base color → generate 5-color harmonious palette (HSL rotations: analogous/complementary/triadic modes) + name each; click to copy hex; export CSS vars. ("AI" = smart algorithm, label honestly "palette engine").
hex-to-rgba-converter / rgba-to-hex-converter: two-way hex/rgba/hsl parsing + opacity slider.
color-shades-generator: pick color → 11-step tint/shade scale rendered as swatches, click to copy, CSS output.
color-mixer: two colors + ratio slider → mixed result, shows hex/rgb.
list-randomizer: paste lines → shuffle (Fisher-Yates), pick N unique, sort toggle.
qr-code-generator: `import QRCode from "qrcode"` → toDataURL; size slider, margin, dark/light colors, error-correction level; download PNG.
barcode-generator: `import JsBarcode from "jsbarcode"` — render into an <svg> ref; formats CODE128/EAN13/UPC/ITF/CODE39; download SVG.
fake-iban-generator: pick country (DE/GB/FR/NL/PK/etc) → generate structurally valid-looking IBAN (correct length+mod97 check digits; label clearly "for testing only"), copy.

## W2 — components/tools/coding/ (13 tools)
code-to-image-converter: code text area + language + theme (light/dark bg) → render styled code block (manual highlight: keywords per language regex is fine) inside exportable div (useMockupExport) → PNG download; padding/rounded controls.
url-slug-generator: live slugify (unicode-aware: convert accents, handle urdu/arabic passthrough), separator, lowercase toggle.
react-native-shadow-generator: elevation/ios shadow controls → live Android-style box preview + iOS shadow preview, output object spread code `{ shadowColor: ..., shadowOffset: {...}, ... }` + Android elevation.
base64-encoder-decoder: text⇄base64 (btoa/atob with UTF-8 safe via TextEncoder), also file→base64 via FileReader.
html-encoder-decoder: HTML entities escape/unescape (named + numeric map for &<>"' and common like &nbsp;).
url-encoder-decoder: encodeURIComponent/decodeURIComponent + encodeURI option, query-param mode (split & encode k=v pairs).
html-minifier: strip comments + collapse whitespace between tags (regex-based, conservative).
css-minifier: strip comments/whitespace, collapse spaces.
javascript-minifier: strip comments (line/block, careful with strings — regex approach), collapse blank lines; label "basic".
html-formatter / css-formatter / javascript-formatter: re-indent (brace/semicolon based) with indent-size option; label "basic".
json-tree-viewer: parse JSON → collapsible tree (recursive component), error messages, copy path on click.

## W3 — components/tools/css/ (12 generators)
Every generator: controls on left, live preview + CodeBox output. All pure string composition.
css-gradient-generator: linear/radial/conic, angle, 2-3 stops with positions, repeats; preview box.
css-box-shadow-generator: x/y/blur/spread/color/inset; multiple layers list.
css-border-radius-generator: 8 corner handles via sliders + "squircle" presets; blob mode.
css-clip-path-generator: presets (circle, ellipse, polygon triangle/star/arrow/hexagon) + draggable polygon points on a 300px grid.
css-background-pattern-generator: pattern presets (stripes/dots/checkers/cross/zigzag/diagonal) using repeating-linear-gradient; colors + size.
css-cubic-bezier-generator: draggable 2 control points on an SVG grid → bezier string, animated preview ball.
css-glassmorphism-generator: blur, bg alpha, border, saturation; preview over gradient/photo-like background.
css-text-glitch-effect-generator: layered text with clip/offset keyframes; text + colors; CSS output.
css-gradient… (already), css-triangle-generator: direction/size/color → border-trick CSS + preview.
css-switch-generator: size, on/off colors, knob style, speed → toggle preview + CSS.
css-checkbox-generator: size, check type (check/filled/square), colors → preview + CSS.
css-loader-generator: 10 loader types (spinner/pulse/ring/dots/bars/etc) with speed/color/size; animated live preview; CSS keyframes output (template keyframes per type, rename-safe).

## W4 — components/tools/image/ (13 tools, all canvas)
image-cropper: load image → draw on canvas with drag-to-select crop rect (mousedown/move/up math), aspect presets (free/1:1/16:9/4:3), preview, download PNG/JPEG.
image-resizer: width/height linked to aspect, quality, format (png/jpeg/webp via toBlob type), max-dimension presets.
image-filters: brightness/contrast/saturate/hue-rotate/grayscale/sepia/blur/opacity sliders → canvas ctx.filter, before/after, download.
image-average-color-finder: compute average pixel color (sum RGB), also dominant color (quantize to buckets), show swatches + copy.
image-color-extractor: k-bucket color quantization → top N palette swatches with hex + percentage bars, copy each.
image-color-picker: hover magnifier over canvas → pick pixel color, zoom panel, recent swatches, HEX/RGB/HSL outputs.
photo-censor: drag rects over image → pixelate or blur that region (repeated drawImage downscale trick), download.
svg-to-png-converter: paste SVG source or upload .svg → render via Image + blob URL → canvas at scale → PNG download.
svg-stroke-to-fill-converter: parse SVG string, set fill=color, stroke="none" on all elements (regex or DOMParser walk) → output SVG.
image-to-base64-converter: file → data URL, output in <img> tag / CSS background / raw modes, copy.
image-caption-generator: choose caption style templates (meme top/bottom, bottom bar, speech-bubble, classic white bottom) + text + font size → canvas draw, download.
svg-blob-generator: random smooth blob path (cubic bezier around circle w/ random radii), complexity/seed, fill color/gradient, copy SVG.
svg-pattern-generator: SVG <pattern> defs (dots/stripes/cross/waves) with colors/size → big preview, copy SVG.

## W5 — components/tools/pdf/ (9 tools, all pdf-lib)
pdf-merger: multi FileDrop → list with drag-free up/down ordering buttons, page counts, merge → save "merged.pdf".
pdf-splitter: single file → page range inputs (e.g. 1-3, 5, 8-10) or "every N pages" or extract single page → run each range → separate downloads.
pdf-compressor: load → save with object streams (PDFDocument.save({ useObjectStreams: true })) + remove metadata; show before/after sizes, honest note "lossless structural optimization".
pdf-editor: load → toolbar: add text (click page position, font size, color), draw white rect, delete page, rotate page, reorder (up/down); render pages as PNG via pdf-lib? pdf-lib can't rasterize. Instead use page thumbnails via pdf.js? NOT installed. Approach: show page list with operations; for text placement use simple x/y/size inputs + preview note. Keep operations real via pdf-lib APIs.
add-text-to-pdf: text, page, x/y, size, color, font (Helvetica variants) → apply, download.
sign-pdf: draw signature on a small canvas → export PNG → embed at position on chosen page.
fill-pdf-form: if PDF has form fields, list them (getForm().getFields()) with inputs by type (text/checkbox/dropdown), fill values, flatten optionally, download; message if no fields.
whiteout-pdf: draw white (or custom color) rectangles: page + x/y/w/h inputs (mm-ish units scaled), multiple rect list, apply, download.
scanned-pdf-converter: rasterize is NOT possible without a rasterizer; implement honestly: "optimize scanned PDFs" — strip metadata, compress object streams, optionally extract embedded images? Keep: metadata clean + save optimization + page-count/size report. (functional, modest)
## W6 — components/tools/social/ (15: chats + calls + notifications)
Helper `_chat.tsx` (ONLY this folder): shared chat types (Msg{side:'in'|'out', text, time, image?(dataURL), voice?(sec), reaction?}), ChatPhone component (PhoneFrame + platform-colored header + wallpaper + bubble list + date divider + double ticks + voice-note pill + reaction pills, explicit inline hex colors, mockup-dark-mode prop), used with useMockupExport.
whatsapp-chat-generator: WA colors (#25D366 header, #ECE5DD bg, out #DCF8C6), group mode (sender names), profile/status, mockup dark toggle.
telegram-chat-generator: #2AABEE header, out #EFFDDE, white in-bubbles.
imessage-chat-generator: iOS style; green SMS vs blue iMessage per-message toggle.
messenger-chat-generator: gradient header, blue out-bubbles, light/dark mockup.
instagram-dm-generator: white/dark, gradient heart, story-ring avatar.
snapchat-chat-generator: #FFFC00 accents, rounded white bubbles.
discord-message-generator: always-dark #313338, channel header, role-colored usernames, circular avatars.
teams-chat-generator: #6264A7, initials avatars.
android-text-message-generator: Material SMS style (#0B93F6 out).
fake-chat-generator: fully custom (bubble colors, radius, wallpaper, ticks style, platform name).
chatgpt-conversation-generator: clean chat UI, user right / assistant left, markdown-lite, title bar.
fake-notification-generator: iOS/Android banner mockup (app name, icon letter, title, body, time) on wallpaper; PNG export.
facetime-call-screen-generator: iOS call UI (avatar, name, buttons mute/keypad/speaker, red decline, green accept).
whatsapp-call-screen-generator: WA call UI (voice/video toggle, timer, end call).
instagram-call-screen-generator: IG video-call UI.

## W7 — components/tools/social/ (15: post/feed generators)
Helper `_post.tsx` (ONLY this folder): shared bits — Avatar (initials circle with color), Verified svg badge, StatIconBar, exportable Card wrapper (explicit colors, no dark: classes inside export node).
tweet-generator: X post card (avatar, name, @handle, verified, text, image?, replies/rt/likes counts, time) -> PNG.
tweet-to-image-converter: honest: "paste tweet text/URL -> clean shareable image" using the same X card with prefilled fields.
twitter-ad-revenue-generator: impressions + CPM/CPC + rate -> estimated revenue table + receipt-style card export.
instagram-post-generator: square media-or-gradient, heart/comment/share icons, likes, caption, verified.
instagram-story-generator: 9:16 story frame, progress bars, caption/text overlay, gradient bg.
instagram-reel-generator: 9:16 reel frame, right action rail with counts, audio row.
facebook-post-generator: post card (header, text, image, reactions bar).
facebook-story-generator: 9:16 FB-styled story frame.
reddit-post-generator: subreddit, votes arrows + count, title, body, awards, comments.
pinterest-post-generator: tall pin card, image/gradient, title, red Save button.
linkedin-post-generator: card with name/title, body, reactions, repost counts, company-page mode.
threads-post-generator: threads-style card, replies/reposts.
bluesky-post-generator: @handle.bsky.social card, reply/repost/like rail.
open-graph-meta-generator: OG/Twitter meta tag builder + FB/Telegram-style link preview card + copy code.
youtube-video-page-generator: player bar, title, views/date, channel row + red Subscribe, top comment.

## W8 — components/tools/social/ (15: profiles/comments/filters/thumbs)
Helper `_feed.tsx` (ONLY this folder): shared Avatar/Verified/stat bits + export wrapper (do not import W6/W7 helpers; small duplication is fine).
instagram-comment-generator: IG comment card (avatar, name, comment, likes, heart, time, reply).
facebook-comment-generator: FB comment card + reactions + reply.
tiktok-comment-generator: TikTok comment style.
youtube-comment-generator: YT comment (avatar, name, time, text, likes, creator-heart toggle, reply).
tiktok-post-generator: 9:16, @user, caption + #tags, action rail w/ counts, music marquee.
tiktok-live-generator: 9:16 LIVE badge, viewer count, floating comment stream, gift badges.
tiktok-profile-generator: profile (avatar, stats, bio, 3x3 grid).
instagram-profile-generator: IG profile (highlights row, stats, 3x3 grid).
youtube-shorts-generator: 9:16 shorts frame + rail + red subscribe.
youtube-channel-generator: banner strip, avatar, subs, tabs, 2x3 video grid.
youtube-thumbnail-grabber: video URL/ID -> img via https://i.ytimg.com/vi/<ID>/maxresdefault.jpg (runtime <img> allowed here) + hqdefault fallback + download via fetch->blob.
vimeo-thumbnail-grabber: paste URL -> fetch vimeo oEmbed JSON client-side -> thumbnail_url preview + download; error message with instructions if blocked.
snapchat-caption-maker: photo/gradient bg + classic caption bar (position/size controls).
instagram-filters: upload -> named filter presets (canvas filter combos: Clarendon, Gingham, Moon, Lark, Reyes, Juno, Slumber, Crema) + intensity slider -> download.
instagram-photo-downloader: paste direct image URL -> fetch -> preview + download; honest helper text for getting direct CDN URLs.
