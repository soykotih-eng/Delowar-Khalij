import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/en/cart", "/ar/cart", "/en/account", "/ar/account"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
