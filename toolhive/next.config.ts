/** @type {import('next').NextConfig} */

/**
 * Security headers applied to every response.
 * CSP notes:
 *  - script-src 'unsafe-inline' is required by Next.js SSG hydration bootstrap
 *    (small inline JSON payloads); no third-party scripts are allowed.
 *  - style-src allows Google Fonts because the Google Fonts Pair Finder tool
 *    injects <link> to fonts.googleapis.com for live previews.
 *  - img-src includes data: and blob: because tools render local files and
 *    generated images entirely in the browser.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  output: "standalone", // self-contained server build for Docker / VPS / Render
  compress: true, // gzip/brotli for API + static responses
  reactStrictMode: true,
  images: { unoptimized: true },
  // never ship source maps to production
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // static assets are content-stable: cache a year at the CDN/browser
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/og.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

export default nextConfig;
