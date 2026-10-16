import { colors, finishes, origins, usages } from "@/data/attributes";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { tr, type CommonDict, type Locale } from "./i18n";

/** Label/value rows describing a product (used by quick view, product page and compare). */
export function productSpecs(p: Product, lang: Locale, t: CommonDict) {
  const category = getCategory(p.category);
  const rows: [string, string][] = [
    [t.sku, p.sku],
    [t.category, category ? tr(category.name, lang) : "—"],
    [t.origin, tr(origins[p.origin], lang)],
    [t.color, tr(colors[p.color], lang)],
    [t.finish, tr(finishes[p.finish], lang)],
    [t.thickness, p.thickness ? `${p.thickness} ${t.cm}` : t.custom],
    [t.usage, p.usage.length ? p.usage.map((u) => tr(usages[u], lang)).join(lang === "ar" ? "، " : ", ") : "—"],
    [t.availability, p.inStock ? t.inStock : t.onRequest],
  ];
  return rows;
}
