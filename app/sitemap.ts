import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/contact";
import { getProgramPath, programs } from "@/content/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...programs.map(getProgramPath)].map(path => ({ url: new URL(path, siteUrl).href }));
}
