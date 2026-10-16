"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products, productsInCategory } from "@/data/products";
import { href, type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const tabs = {
  featured: products.filter((p) => p.featured),
  marble: productsInCategory("marble"),
  granite: productsInCategory("granite"),
  stoneProducts: productsInCategory("stone-products"),
};
type Tab = keyof typeof tabs;

export function FeaturedProducts({ copy }: { copy: Dictionary["home"]["products"] }) {
  const { lang } = useI18n();
  const [tab, setTab] = useState<Tab>("featured");

  return (
    <section className="container-x py-20 lg:py-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading align="start" eyebrow={copy.eyebrow} title={copy.title} text={copy.text} />
        <div role="tablist" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {(Object.keys(tabs) as Tab[]).map((key) => (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition",
                tab === key ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
              )}
            >
              {copy.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {tabs[tab].slice(0, 8).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href={href(lang, "/shop")} className="btn btn-outline px-8">
          {copy.viewAll}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
