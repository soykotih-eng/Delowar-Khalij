"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Price } from "@/components/ui/Price";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { href, tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function matchesQuery(p: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const cat = getCategory(p.category);
  return [p.name.en, p.name.ar, p.sku, cat?.name.en, cat?.name.ar]
    .filter(Boolean)
    .some((text) => text!.toLowerCase().includes(q));
}

export function SearchBox({ autoFocus, className }: { autoFocus?: boolean; className?: string }) {
  const { lang, t } = useI18n();
  const { products } = useCatalog();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(
    () => (query.trim().length < 2 ? [] : products.filter((p) => matchesQuery(p, query)).slice(0, 6)),
    [query, products],
  );
  const showResults = focused && query.trim().length >= 2;

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(href(lang, `/shop?q=${encodeURIComponent(query.trim())}`));
        setFocused(false);
      }}
    >
      <input
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={t.searchPlaceholder}
        aria-label={t.search}
        className="h-12 w-full rounded-full border border-line bg-cream ps-5 pe-14 text-sm outline-none transition focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/20"
      />
      <button
        type="submit"
        aria-label={t.search}
        className="absolute inset-y-1 end-1 grid w-10 place-items-center rounded-full bg-ink text-white transition hover:bg-gold"
      >
        <Search className="size-4" />
      </button>

      {showResults && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          {results.length === 0 ? (
            <p className="p-5 text-sm text-muted">{t.noResults}</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={href(lang, `/product/${p.slug}`)}
                    className="flex items-center gap-3 p-3 transition hover:bg-cream"
                  >
                    <Image src={p.image} alt="" width={48} height={48} className="size-12 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{tr(p.name, lang)}</span>
                      <Price product={p} className="text-xs" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button type="submit" className="block w-full bg-ink py-3 text-center text-sm font-bold text-white hover:bg-gold">
            {t.viewAllResults}
          </button>
        </div>
      )}
    </form>
  );
}
