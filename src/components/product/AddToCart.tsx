"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { QtyStepper } from "@/components/ui/Fields";
import { units } from "@/data/attributes";
import type { Product } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { tr } from "@/lib/i18n";

export const qtyRules = (product: Product) =>
  product.unit === "m2" ? { step: 0.5, min: siteConfig.minOrderArea } : { step: 1, min: 1 };

export function AddToCart({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const { addToCart, toast } = useStore();
  const rules = qtyRules(product);
  const [qty, setQty] = useState(rules.min);

  if (product.price === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <QtyStepper value={qty} onChange={setQty} step={rules.step} min={rules.min} />
        <span className="text-sm font-semibold text-muted">{tr(units[product.unit], lang)}</span>
      </div>
      <button
        type="button"
        onClick={() => {
          addToCart(product.slug, qty);
          toast(t.addedToCart);
        }}
        className="btn btn-dark h-12 flex-1"
      >
        <ShoppingBag className="size-4" />
        {t.addToCart}
      </button>
    </div>
  );
}
