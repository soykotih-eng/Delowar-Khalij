"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight, Heart } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { href, tr } from "@/lib/i18n";
import { productSpecs } from "@/lib/product-specs";
import { cn } from "@/lib/utils";
import { AddToCart } from "./AddToCart";
import { useProductActions } from "./ProductCard";

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const { lang, t } = useI18n();
  const actions = useProductActions(product);
  const specs = productSpecs(product, lang, t).slice(1, 6);

  return (
    <div className="grid md:grid-cols-2">
      <div className="relative aspect-[4/3] bg-sand md:aspect-auto md:min-h-[560px]">
        <Image src={product.image} alt={tr(product.name, lang)} fill sizes="(min-width: 768px) 450px, 100vw" className="object-cover" />
      </div>
      <div className="p-6 sm:p-8">
        <CloseButton onClick={onClose} label={t.close} className="absolute end-4 top-4 z-10" />
        <p className="text-xs font-bold text-gold uppercase">{product.sku}</p>
        <h2 className="mt-2 pe-10 text-2xl font-extrabold tracking-tight sm:text-3xl">{tr(product.name, lang)}</h2>
        <Price product={product} className="mt-3 block text-2xl" />
        <p className="mt-4 text-sm leading-7 text-muted">{tr(product.short, lang)}</p>

        <dl className="mt-5 divide-y divide-line rounded-xl border border-line text-sm">
          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-muted">{label}</dt>
              <dd className="text-end font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 space-y-3">
          <AddToCart product={product} />
          <button
            type="button"
            onClick={() => {
              onClose();
              actions.purchase();
            }}
            className="btn btn-gold h-12 w-full"
          >
            {t.purchaseRequest}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          <div className="flex gap-4">
            <button type="button" onClick={actions.toggleWishlist} className={cn("flex items-center gap-1.5 hover:text-gold", actions.inWishlist && "text-gold")}>
              <Heart className={cn("size-4", actions.inWishlist && "fill-current")} />
              {actions.inWishlist ? t.removeFromWishlist : t.addToWishlist}
            </button>
            <button type="button" onClick={actions.toggleCompare} className={cn("flex items-center gap-1.5 hover:text-gold", actions.inCompare && "text-gold")}>
              <ArrowLeftRight className="size-4" />
              {t.addToCompare}
            </button>
          </div>
          <Link href={href(lang, `/product/${product.slug}`)} onClick={onClose} className="flex items-center gap-1 text-gold-dark hover:text-ink">
            {t.viewDetails}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function QuickViewModal() {
  const { t } = useI18n();
  const { quickView, setQuickView } = useStore();
  const { getProduct } = useCatalog();
  const product = quickView ? getProduct(quickView) : undefined;
  const close = () => setQuickView(null);

  return (
    <Modal open={!!product} onClose={close} label={t.quickView} className="max-w-5xl">
      {product && <QuickViewBody product={product} onClose={close} />}
    </Modal>
  );
}
