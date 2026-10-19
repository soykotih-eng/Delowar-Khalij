"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, Eye, Heart } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Price } from "@/components/ui/Price";
import { colors, origins } from "@/data/attributes";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { href, tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Wishlist / compare / quick-view actions shared by cards and product pages. */
export function useProductActions(product: Product) {
  const { t } = useI18n();
  const store = useStore();
  const inWishlist = store.wishlist.includes(product.slug);
  const inCompare = store.compare.includes(product.slug);

  return {
    inWishlist,
    inCompare,
    toggleWishlist: () => store.toast(store.toggleWishlist(product.slug) ? t.addedToWishlist : t.removedFromWishlist),
    toggleCompare: () => {
      const result = store.toggleCompare(product.slug);
      store.toast(result === "added" ? t.addedToCompare : result === "removed" ? t.removedFromCompare : t.compareLimit);
    },
    quickView: () => store.setQuickView(product.slug),
    purchase: () => store.setPurchase(product.slug),
  };
}

function ActionButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "grid size-8 place-items-center rounded-full shadow-md transition hover:bg-ink hover:text-white sm:size-10 [&>svg]:size-3.5 sm:[&>svg]:size-4",
        active ? "bg-gold text-white" : "bg-white text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function ProductCard({ product, view = "grid", priority }: { product: Product; view?: "grid" | "list"; priority?: boolean }) {
  const { lang, t } = useI18n();
  const actions = useProductActions(product);
  const category = getCategory(product.category);
  const url = href(lang, `/product/${product.slug}`);
  const name = tr(product.name, lang);

  const image = (
    <div className={cn("relative overflow-hidden rounded-2xl bg-sand", view === "grid" ? "aspect-square" : "aspect-square w-36 shrink-0 sm:w-56")}>
      <Link href={url} aria-label={name}>
        <Image
          src={product.image}
          alt={name}
          fill
          priority={priority}
          sizes={view === "grid" ? "(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" : "224px"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="pointer-events-none absolute start-3 top-3 flex flex-col items-start gap-1.5">
        {!product.inStock && <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-bold text-white">{t.onRequest}</span>}
        {product.featured && <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-white">{t.featured}</span>}
      </div>
      <div className="absolute end-2 top-2 flex flex-col gap-1.5 transition sm:end-3 sm:top-3 sm:gap-2 duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
        <ActionButton label={actions.inWishlist ? t.removeFromWishlist : t.addToWishlist} active={actions.inWishlist} onClick={actions.toggleWishlist}>
          <Heart className={cn("size-4", actions.inWishlist && "fill-current")} />
        </ActionButton>
        <ActionButton label={t.addToCompare} active={actions.inCompare} onClick={actions.toggleCompare}>
          <ArrowLeftRight className="size-4" />
        </ActionButton>
        <ActionButton label={t.quickView} onClick={actions.quickView}>
          <Eye className="size-4" />
        </ActionButton>
      </div>
    </div>
  );

  if (view === "list") {
    return (
      <article className="group flex gap-4 rounded-2xl border border-line bg-white p-3 sm:gap-6 sm:p-4">
        {image}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {category && (
            <Link href={href(lang, `/product-category/${category.slug}`)} className="text-xs font-semibold text-muted hover:text-gold">
              {tr(category.name, lang)}
            </Link>
          )}
          <h3 className="mt-1 text-lg font-extrabold">
            <Link href={url} className="hover:text-gold">
              {name}
            </Link>
          </h3>
          <Price product={product} className="mt-1 text-base" />
          <p className="mt-2 line-clamp-2 hidden text-sm leading-6 text-muted sm:block">{tr(product.short, lang)}</p>
          <div className="mt-2 hidden flex-wrap gap-1.5 text-[11px] font-semibold text-ink/70 sm:flex">
            <span className="rounded-full bg-cream px-2.5 py-1">{tr(origins[product.origin], lang)}</span>
            <span className="rounded-full bg-cream px-2.5 py-1">{tr(colors[product.color], lang)}</span>
          </div>
          <div className="mt-4">
            <button type="button" onClick={actions.purchase} className="btn btn-dark px-5 py-2.5 text-xs">
              {t.purchaseRequest}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      {image}
      <div className="flex flex-1 flex-col pt-4">
        {category && (
          <Link href={href(lang, `/product-category/${category.slug}`)} className="text-xs font-semibold text-muted hover:text-gold">
            {tr(category.name, lang)}
          </Link>
        )}
        <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold leading-snug sm:text-base">
          <Link href={url} className="hover:text-gold">
            {name}
          </Link>
        </h3>
        <Price product={product} className="mt-1.5 text-sm sm:text-[15px]" />
        <div className="mt-auto pt-3">
          <button type="button" onClick={actions.purchase} className="btn btn-outline w-full px-3 py-2.5 text-xs">
            {t.purchaseRequest}
          </button>
        </div>
      </div>
    </article>
  );
}
