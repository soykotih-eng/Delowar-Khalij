import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
    "/aluminium",
    "/services",
    "/kitchen-calculator",
    "/project-cost",
    "/about",
    "/knowledge-center",
    "/contact",
    "/showrooms",
    "/faq",
    "/join",
    "/policies/privacy-policy",
    "/policies/terms-of-use",
    "/policies/return-policy",
    ...categories.map((c) => `/product-category/${c.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
    ...posts.map((p) => `/knowledge-center/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteConfig.url}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])) },
    })),
  );
}
