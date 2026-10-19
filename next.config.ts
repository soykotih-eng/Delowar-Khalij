import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Loaded from node_modules at runtime instead of being bundled (native / driver code).
  serverExternalPackages: ["mysql2", "sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb", // admin photo uploads
      allowedOrigins: ["delowaralkhalij.net", "www.delowaralkhalij.net"],
    },
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
