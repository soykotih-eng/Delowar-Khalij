"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { matchesQuery } from "@/components/layout/SearchBox";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { colors, finishes, origins, usages } from "@/data/attributes";
import { categoryGroups, childCategories } from "@/data/categories";
import { inCategory, type Product } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { siteConfig } from "@/lib/config";
import { fill, href, tr, type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FilterKey = "color" | "finish" | "origin" | "usage" | "thickness" | "availability";
type SortKey = keyof Dictionary["shop"]["sort"];
type Filters = Record<FilterKey, string[]>;

const emptyFilters: Filters = { color: [], finish: [], origin: [], usage: [], thickness: [], availability: [] };
const PER_PAGE = [9, 12, 18, 24];

const swatches: Record<string, string> = {
  white: "#f4f1ec", black: "#1d1d1d", grey: "#9a9a9a", beige: "#d8c4a1", brown: "#7b5a3c",
  red: "#a8432f", pink: "#e3a9a0", green: "#2f6b4f", blue: "#2c5a85",
  multi: "conic-gradient(#a8432f, #d8c4a1, #2f6b4f, #2c5a85, #a8432f)",
};

const values: Record<FilterKey, (p: Product) => string[]> = {
  color: (p) => [p.color],
  finish: (p) => [p.finish],
  origin: (p) => [p.origin],
  usage: (p) => p.usage,
  thickness: (p) => [p.thickness ? String(p.thickness) : "custom"],
  availability: (p) => [p.inStock ? "in" : "request"],
};

function SearchParamReader({ onChange }: { onChange: (q: string) => void }) {
  const q = useSearchParams().get("q") ?? "";
  useEffect(() => onChange(q), [q, onChange]);
  return null;
}

export function Shop({ categorySlug, copy }: { categorySlug?: string; copy: Dictionary["shop"] }) {
  const { lang, t } = useI18n();
  const { currency } = useStore();
  const { products } = useCatalog();
  const productsInCategory = (slug: string) => inCategory(products, slug);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [price, setPrice] = useState<{ min?: number; max?: number }>({});
  const [sort, setSort] = useState<SortKey>("default");
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const base = useMemo(
    () => (categorySlug ? productsInCategory(categorySlug) : products).filter((p) => matchesQuery(p, query)),
    [categorySlug, query, products],
  );

  const facets = useMemo(() => {
    const result = {} as Record<FilterKey, [string, number][]>;
    (Object.keys(values) as FilterKey[]).forEach((key) => {
      const counts = new Map<string, number>();
      base.forEach((p) => values[key](p).forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
      result[key] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    });
    return result;
  }, [base]);

  const filtered = useMemo(() => {
    const list = base.filter((p) => {
      const facetOk = (Object.keys(filters) as FilterKey[]).every(
        (k) => filters[k].length === 0 || values[k](p).some((v) => filters[k].includes(v)),
      );
      if (!facetOk) return false;
      if (price.min === undefined && price.max === undefined) return true;
      if (p.price === null) return false;
      return (price.min === undefined || p.price >= price.min) && (price.max === undefined || p.price <= price.max);
    });
    const byPrice = (dir: 1 | -1) => (a: Product, b: Product) =>
      a.price === null ? 1 : b.price === null ? -1 : (a.price - b.price) * dir;
    if (sort === "popularity") return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    if (sort === "latest") return [...list].reverse();
    if (sort === "priceAsc") return [...list].sort(byPrice(1));
    if (sort === "priceDesc") return [...list].sort(byPrice(-1));
    return list;
  }, [base, filters, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * perPage, current * perPage);
  const activeCount = Object.values(filters).flat().length + (price.min !== undefined || price.max !== undefined ? 1 : 0);

  const label = (key: FilterKey, value: string) => {
    if (key === "color") return tr(colors[value as keyof typeof colors], lang);
    if (key === "finish") return tr(finishes[value as keyof typeof finishes], lang);
    if (key === "origin") return tr(origins[value as keyof typeof origins], lang);
    if (key === "usage") return tr(usages[value as keyof typeof usages], lang);
    if (key === "thickness") return value === "custom" ? t.custom : `${value} ${t.cm}`;
    return value === "in" ? t.inStock : t.onRequest;
  };
  const titles: Record<FilterKey, string> = {
    color: t.color, finish: t.finish, origin: t.origin, usage: t.usage, thickness: t.thickness, availability: t.availability,
  };

  const toggle = (key: FilterKey, value: string) => {
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
    setPage(1);
  };
  const applyPrice = () => {
    // Inputs are in the visitor's currency; catalogue prices are in the base currency.
    const toBase = (v: string) => (v === "" ? undefined : Number(v) / siteConfig.rates[currency]);
    setPrice({ min: toBase(priceInput.min), max: toBase(priceInput.max) });
    setPage(1);
  };
  const reset = () => {
    setFilters(emptyFilters);
    setPrice({});
    setPriceInput({ min: "", max: "" });
    setPage(1);
  };

  const sidebar = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-extrabold uppercase">{copy.categories}</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href={href(lang, "/shop")} className={cn("block rounded-lg px-3 py-2 font-semibold hover:bg-cream", !categorySlug && "bg-cream text-gold-dark")}>
              {copy.allProducts} <span className="text-muted">({products.length})</span>
            </Link>
          </li>
          {categoryGroups.map((g) => (
            <li key={g.slug}>
              <Link
                href={href(lang, `/product-category/${g.slug}`)}
                className={cn("block rounded-lg px-3 py-2 font-bold hover:bg-cream", categorySlug === g.slug && "bg-cream text-gold-dark")}
              >
                {tr(g.name, lang)} <span className="font-semibold text-muted">({productsInCategory(g.slug).length})</span>
              </Link>
              <ul className="ms-3 border-s border-line ps-2">
                {childCategories(g.slug).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={href(lang, `/product-category/${c.slug}`)}
                      className={cn("block rounded-lg px-3 py-1.5 text-ink/75 hover:text-gold", categorySlug === c.slug && "font-bold text-gold-dark")}
                    >
                      {tr(c.name, lang)} <span className="text-muted">({productsInCategory(c.slug).length})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-extrabold uppercase">
          {copy.price} <span className="text-muted">({currency})</span>
        </h3>
        <div className="flex items-center gap-2">
          <input type="number" min={0} placeholder={copy.min} value={priceInput.min} onChange={(e) => setPriceInput((v) => ({ ...v, min: e.target.value }))} className="field px-3 py-2.5" />
          <span className="text-muted">–</span>
          <input type="number" min={0} placeholder={copy.max} value={priceInput.max} onChange={(e) => setPriceInput((v) => ({ ...v, max: e.target.value }))} className="field px-3 py-2.5" />
        </div>
        <button type="button" onClick={applyPrice} className="btn btn-dark mt-3 w-full py-2.5">
          {copy.apply}
        </button>
      </div>

      {(Object.keys(facets) as FilterKey[]).map(
        (key) =>
          facets[key].length > 0 && (
            <div key={key}>
              <h3 className="mb-4 text-sm font-extrabold uppercase">{titles[key]}</h3>
              <ul className="space-y-2.5 text-sm">
                {facets[key].map(([value, count]) => (
                  <li key={value}>
                    <label className="flex cursor-pointer items-center gap-3 hover:text-gold">
                      <input type="checkbox" checked={filters[key].includes(value)} onChange={() => toggle(key, value)} className="size-4 accent-[#b08a4e]" />
                      {key === "color" && <span className="size-4 rounded-full border border-line" style={{ background: swatches[value] }} />}
                      <span className="flex-1">{label(key, value)}</span>
                      <span className="text-xs text-muted">({count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  );

  return (
    <div className="container-x py-12 lg:py-16">
      <Suspense fallback={null}>
        <SearchParamReader onChange={setQuery} />
      </Suspense>

      <div className="grid gap-10 lg:grid-cols-[270px_1fr]">
        <aside className="hidden lg:block">{sidebar}</aside>

        <div>
          {query && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold">{fill(copy.resultsFor, { q: query })}</h2>
              <Link href={href(lang, "/shop")} className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-gold">
                <X className="size-4" /> {copy.reset}
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
            <p className="text-sm text-muted">
              {fill(copy.showing, {
                from: filtered.length ? (current - 1) * perPage + 1 : 0,
                to: Math.min(current * perPage, filtered.length),
                total: filtered.length,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline px-4 py-2 lg:hidden">
                <SlidersHorizontal className="size-4" />
                {copy.filters}
                {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] text-white">{activeCount}</span>}
              </button>
              <label className="hidden items-center gap-2 text-sm sm:flex">
                <span className="text-muted">{copy.perPage}</span>
                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="rounded-full border border-line bg-white px-3 py-2 font-semibold outline-none">
                  {PER_PAGE.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <div className="flex rounded-full border border-line p-1">
                {(["grid", "list"] as const).map((v) => {
                  const Icon = v === "grid" ? LayoutGrid : List;
                  return (
                    <button key={v} type="button" aria-label={copy[v]} aria-pressed={view === v} onClick={() => setView(v)} className={cn("grid size-8 place-items-center rounded-full", view === v ? "bg-ink text-white" : "text-muted hover:text-ink")}>
                      <Icon className="size-4" />
                    </button>
                  );
                })}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={copy.sort.default} className="rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold outline-none">
                {(Object.keys(copy.sort) as SortKey[]).map((k) => (
                  <option key={k} value={k}>{copy.sort[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(filters) as FilterKey[]).flatMap((k) =>
                filters[k].map((v) => (
                  <button key={k + v} type="button" onClick={() => toggle(k, v)} className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-bold hover:bg-sand">
                    {label(k, v)} <X className="size-3" />
                  </button>
                )),
              )}
              <button type="button" onClick={reset} className="px-2 text-xs font-bold text-gold-dark hover:text-ink">
                {copy.reset}
              </button>
            </div>
          )}

          {visible.length === 0 ? (
            <p className="py-24 text-center text-muted">{copy.noResults}</p>
          ) : (
            <div className={cn("mt-8", view === "grid" ? "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6" : "space-y-4")}>
              {visible.map((p, i) => (
                <ProductCard key={p.slug} product={p} view={view} priority={i < 3} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label={t.previous} className="grid size-11 place-items-center rounded-full border border-line hover:border-ink disabled:opacity-40">
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => setPage(n)} aria-current={n === current ? "page" : undefined} className={cn("grid size-11 place-items-center rounded-full text-sm font-bold", n === current ? "bg-ink text-white" : "border border-line hover:border-ink")}>
                  {n}
                </button>
              ))}
              <button type="button" disabled={current === totalPages} onClick={() => setPage(current + 1)} aria-label={t.next} className="grid size-11 place-items-center rounded-full border border-line hover:border-ink disabled:opacity-40">
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
            </nav>
          )}
        </div>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} label={copy.filters} variant="drawer-start">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 className="text-lg font-extrabold">{copy.filters}</h2>
            <CloseButton onClick={() => setDrawer(false)} label={t.close} />
          </div>
          <div className="flex-1 overflow-y-auto p-5">{sidebar}</div>
          <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
            <button type="button" onClick={reset} className="btn btn-outline">{copy.reset}</button>
            <button type="button" onClick={() => setDrawer(false)} className="btn btn-gold">{copy.showResults}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
