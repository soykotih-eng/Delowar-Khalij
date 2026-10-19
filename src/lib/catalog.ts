import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";
import type { ColorKey, FinishKey, OriginKey, UnitKey, UsageKey } from "@/data/attributes";
import { seedAluWorks, type AluCategory, type AluWork } from "@/data/aluminium";
import { seedProducts, type Product } from "@/data/products";
import { isDbConfigured, query } from "./db";

export type Catalog = { products: Product[]; works: AluWork[]; live: boolean };
export const CATALOG_TAG = "catalog";

type ProductRow = RowDataPacket & {
  id: number; slug: string; sku: string; name_en: string; name_ar: string; category: string; origin: string;
  color: string; finish: string; thickness: number | null; usage_list: string; price: number | null; unit: string;
  in_stock: number; featured: number; short_en: string; short_ar: string; image: string;
};
type WorkRow = RowDataPacket & {
  id: number; slug: string; category: string; title_en: string; title_ar: string; system_en: string;
  system_ar: string; image: string; w: number; h: number; featured: number;
};

export const rowToProduct = (r: ProductRow): Product => ({
  slug: r.slug,
  sku: r.sku,
  name: { en: r.name_en, ar: r.name_ar },
  category: r.category,
  origin: r.origin as OriginKey,
  color: r.color as ColorKey,
  finish: r.finish as FinishKey,
  thickness: r.thickness === null ? null : Number(r.thickness),
  usage: (r.usage_list ? r.usage_list.split(",") : []) as UsageKey[],
  price: r.price === null ? null : Number(r.price),
  unit: r.unit as UnitKey,
  inStock: Boolean(r.in_stock),
  featured: Boolean(r.featured),
  short: { en: r.short_en, ar: r.short_ar },
  image: r.image,
});

export const rowToWork = (r: WorkRow): AluWork => ({
  slug: r.slug,
  category: r.category as AluCategory,
  title: { en: r.title_en, ar: r.title_ar },
  system: { en: r.system_en, ar: r.system_ar },
  image: r.image,
  w: r.w,
  h: r.h,
  featured: Boolean(r.featured),
});

export type { ProductRow, WorkRow };

const seedCatalog: Catalog = { products: seedProducts, works: seedAluWorks, live: false };

// Cached across requests; admin changes call revalidateTag(CATALOG_TAG) so they appear immediately.
const loadCatalog = unstable_cache(
  async (): Promise<Catalog> => {
    const [products, works] = await Promise.all([
      query<ProductRow>("SELECT * FROM products ORDER BY sort DESC, id DESC"),
      query<WorkRow>("SELECT id, slug, category, title_en, title_ar, system_en, system_ar, image, w, h, featured FROM alu_works ORDER BY sort DESC, id DESC"),
    ]);
    return { products: products.map(rowToProduct), works: works.map(rowToWork), live: true };
  },
  ["catalog-v1"],
  { tags: [CATALOG_TAG] },
);

/** Products and aluminium works for the public site: from the database, or the starter catalogue. */
export const getCatalog = cache(async (): Promise<Catalog> => {
  await connection(); // always render with current data, never bake it in at build time
  if (!isDbConfigured()) return seedCatalog;
  try {
    return await loadCatalog();
  } catch (error) {
    console.error("[catalog] Database unavailable — showing the starter catalogue.", error);
    return seedCatalog;
  }
});
