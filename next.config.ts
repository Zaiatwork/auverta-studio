import type { NextConfig } from "next";

// Hostinger shared hosting serves static files plus PHP, so the site ships as a
// static export (`out/`). Security headers live in public/.htaccess because
// `headers()` is unsupported in export mode.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
