"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { units } from "@/data/attributes";
import type { Product } from "@/data/products";
import { cn, formatMoney } from "@/lib/utils";

/** An amount in the base currency, shown in the visitor's selected currency. */
export function Money({ amount, className }: { amount: number; className?: string }) {
  const { lang } = useI18n();
  const { currency } = useStore();
  return <span className={className}>{formatMoney(amount, currency, lang)}</span>;
}

export function Price({ product, className }: { product: Product; className?: string }) {
  const { lang, t } = useI18n();
  if (product.price === null) {
    return <span className={cn("font-bold text-gold-dark", className)}>{t.onRequest}</span>;
  }
  return (
    <span className={cn("font-extrabold", className)}>
      <Money amount={product.price} />
      <span className="ms-1 text-[0.75em] font-medium text-muted">/ {units[product.unit][lang]}</span>
    </span>
  );
}
