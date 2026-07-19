import type { NextConfig } from "next";

// Content-Security-Policy, shipped in REPORT-ONLY mode first: the browser
// reports violations to the console but blocks nothing, so we can watch for
// false positives (a missing ad/analytics/font domain) and tune before
// enforcing. Sources below cover every third party the site loads:
//   - Google AdSense / DoubleClick / ad traffic quality
//   - Google Analytics (gtag) + its inline bootstrap script
//   - Vercel Speed Insights + Web Analytics (same-origin proxied)
//   - Google Fonts (next/font self-hosts, gstatic kept as a safety net)
//   - Supabase (REST + realtime websocket)
// 'unsafe-inline'/'unsafe-eval' are intentionally kept for now because Next's
// hydration bootstrap and AdSense/GA need them; tighten to nonces/hashes once
// the report-only run is clean.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.googletagmanager.com https://*.google-analytics.com https://*.doubleclick.net https://*.adtrafficquality.google https://www.google.com https://*.gstatic.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://www.google.com https://*.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // NOTE: upgrade-insecure-requests is ignored in report-only mode; add it back
  // when this policy is promoted to the enforcing Content-Security-Policy header.
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
