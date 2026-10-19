"use client";

import { createContext, useContext, useMemo } from "react";
import type { AluWork } from "@/data/aluminium";
import type { Product } from "@/data/products";

type CatalogValue = {
  products: Product[];
  works: AluWork[];
  getProduct: (slug: string) => Product | undefined;
};

const CatalogContext = createContext<CatalogValue | null>(null);

/** Live products and aluminium works (from the database), loaded once per page by the root layout. */
export function CatalogProvider({ products, works, children }: { products: Product[]; works: AluWork[]; children: React.ReactNode }) {
  const value = useMemo(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return { products, works, getProduct: (slug: string) => bySlug.get(slug) };
  }, [products, works]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used inside CatalogProvider");
  return value;
}
