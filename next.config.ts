import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STEM_STANDALONE === "1" ? "standalone" : undefined,
  poweredByHeader: false,
  async redirects() {
    return [{
      source: "/:path*",
      has: [
        { type: "host", value: "fightersacademy.com.vn" },
        { type: "header", key: "x-forwarded-proto", value: "http" },
      ],
      destination: "https://fightersacademy.com.vn/:path*",
      permanent: true,
    }];
  },
};

export default nextConfig;
