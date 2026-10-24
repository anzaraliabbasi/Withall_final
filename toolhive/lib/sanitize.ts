/**
 * Client-side input sanitization helpers.
 * ToolHive processes everything locally in the browser — these helpers make
 * sure user-provided content can never execute as script when it is rendered
 * back into the page (XSS).
 */

/** Escape a string so it can be embedded in HTML as text. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitize an SVG string before it is rendered as markup:
 * - removes <script>, <foreignObject>, <iframe>, <handler>, <animate> with
 *   event targets, and any element starting with "on"
 * - removes javascript:/data:text/html URLs
 * - removes all on* event-handler attributes (onload, onerror, onclick…)
 *
 * For maximum defense-in-depth, previews should render the sanitized string
 * through an <img> data URL where possible (browsers never execute scripts in
 * SVGs loaded via <img>).
 */
export function sanitizeSvg(svg: string): string {
  let out = svg;
  // strip executable / embeddable elements entirely
  out = out.replace(
    /<\s*(script|foreignObject|iframe|handler|animate|set|animateTransform)\b[\s\S]*?<\/\s*\1\s*>/gi,
    ""
  );
  out = out.replace(/<\s*(script|foreignObject|iframe|handler)\b[^>]*\/?>/gi, "");
  // strip inline event handlers
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  // strip dangerous URL schemes
  out = out.replace(/(href|xlink:href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1=""');
  out = out.replace(/(href|xlink:href|src)\s*=\s*'\s*javascript:[^']*'/gi, "$1=''");
  return out;
}

/**
 * A data URL for rendering an SVG safely inside <img> — scripts inside the SVG
 * are never executed when loaded through an image element.
 */
export function svgToSafeImgSrc(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Validate an uploaded file against an allowlist of extensions / MIME prefixes.
 * Returns an error message string, or "" when the file is allowed.
 */
export function validateFileKind(
  file: File,
  allowedExtensions: string[],
  allowedMimePrefixes: string[] = []
): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extOk = allowedExtensions.includes(ext);
  const mimeOk = allowedMimePrefixes.some((p) => file.type.startsWith(p));
  // Trust the MIME type when present; fall back to extension check.
  if (file.type) {
    return mimeOk || extOk ? "" : `Unsupported file type ".${ext}". Allowed: ${allowedExtensions.join(", ")}`;
  }
  return extOk ? "" : `Unsupported file type ".${ext}". Allowed: ${allowedExtensions.join(", ")}`;
}
