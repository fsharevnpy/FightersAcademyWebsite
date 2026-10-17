import type { NextConfig } from "next";
import { getProgramPath, programs } from "./content/programs";

const nextConfig: NextConfig = {
  output: process.env.STEM_STANDALONE === "1" ? "standalone" : undefined,
  poweredByHeader: false,
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "fightersacademy.com.vn" }],
      destination: "https://stem.fightersacademy.com.vn/:path*",
      permanent: true,
    }, {
      source: "/:path*",
      has: [
        { type: "host", value: "stem.fightersacademy.com.vn" },
        { type: "header", key: "x-forwarded-proto", value: "http" },
      ],
      destination: "https://stem.fightersacademy.com.vn/:path*",
      permanent: true,
    }, ...programs.flatMap(program => (program.legacySlugs ?? []).map(slug => ({
      source: `/khoa-hoc/${slug}`,
      destination: getProgramPath(program),
      permanent: true,
    })))];
  },
};

export default nextConfig;
