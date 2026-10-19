"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { qtyRules } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { Field, QtyStepper } from "@/components/ui/Fields";
import { Money, Price } from "@/components/ui/Price";
import { units } from "@/data/attributes";
import type { Product } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { siteConfig } from "@/lib/config";
import { fill, href, tr, type Dictionary } from "@/lib/i18n";
import { productSpecs } from "@/lib/product-specs";
import { formatMoney, formatNumber } from "@/lib/utils";
import { submitRequest } from "@/lib/requests";

function EmptyState({ icon: Icon, text, cta }: { icon: typeof Heart; text: string; cta: string }) {
  const { lang } = useI18n();
  return (
    <div className="py-20 text-center">
      <span className="mx-auto grid size-24 place-items-center rounded-full bg-cream text-gold">
        <Icon className="size-10" />
      </span>
      <p className="mt-6 text-xl font-extrabold">{text}</p>
      <Link href={href(lang, "/shop")} className="btn btn-dark mt-8">
        {cta}
      </Link>
    </div>
  );
}

const Loading = () => <div className="h-72 animate-pulse rounded-3xl bg-cream" />;

const useResolve = () => {
  const { getProduct } = useCatalog();
  return (slugs: string[]) => slugs.map(getProduct).filter((p): p is Product => !!p);
};

export function CartView({ copy }: { copy: Dictionary["cart"] }) {
  const { lang, t } = useI18n();
  const store = useStore();
  const { getProduct } = useCatalog();
  const money = (v: number) => formatMoney(v, store.currency, lang);

  if (!store.hydrated) return <Loading />;
  const lines = store.cart
    .map((line) => ({ ...line, product: getProduct(line.slug) }))
    .filter((l): l is typeof l & { product: Product } => !!l.product);
  if (!lines.length) return <EmptyState icon={ShoppingBag} text={copy.empty} cta={copy.browse} />;

  const remaining = Math.max(0, siteConfig.freeShippingThreshold - store.cartTotal);
  const hasOnRequest = lines.some((l) => l.product.price === null);

  function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const c = copy.checkout;
    submitRequest({ type: "order", lang, name: data.get("name"), phone: data.get("phone"), location: data.get("address"), total: store.cartTotal, lines: [
      `*${copy.message} — ${siteConfig.name}*`,
      ...lines.map(
        (l) =>
          `• ${tr(l.product.name, lang)} (${l.product.sku}) — ${formatNumber(l.qty, lang)} ${tr(units[l.product.unit], lang)} — ${
            l.product.price === null ? t.onRequest : money(l.product.price * l.qty)
          }`,
      ),
      `${copy.total}: ${money(store.cartTotal)}`,
      `${copy.shipping}: ${store.freeShipping ? copy.free : copy.byLocation}`,
      "",
      `${c.name}: ${data.get("name")}`,
      `${c.phone}: ${data.get("phone")}`,
      `${c.address}: ${data.get("address")}`,
      data.get("notes") && `${c.notes}: ${data.get("notes")}`,
    ] });
    store.toast(t.sentWhatsApp);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="hidden grid-cols-[1fr_120px_150px_120px_40px] gap-4 border-b border-line pb-3 text-xs font-bold text-muted uppercase md:grid">
          <span>{copy.product}</span>
          <span>{copy.price}</span>
          <span>{copy.qty}</span>
          <span className="text-end">{copy.subtotal}</span>
          <span />
        </div>
        <ul className="divide-y divide-line">
          {lines.map(({ product, qty }) => {
            const rules = qtyRules(product);
            return (
              <li key={product.slug} className="grid grid-cols-[80px_1fr] gap-4 py-5 md:grid-cols-[1fr_120px_150px_120px_40px] md:items-center">
                <div className="flex items-center gap-4 md:col-span-1">
                  <Image src={product.image} alt="" width={80} height={80} className="size-20 rounded-xl object-cover" />
                  <div className="hidden md:block">
                    <Link href={href(lang, `/product/${product.slug}`)} className="font-extrabold hover:text-gold">
                      {tr(product.name, lang)}
                    </Link>
                    <p className="text-xs text-muted">{product.sku}</p>
                  </div>
                </div>
                <div className="space-y-2 md:contents">
                  <Link href={href(lang, `/product/${product.slug}`)} className="block font-extrabold hover:text-gold md:hidden">
                    {tr(product.name, lang)}
                  </Link>
                  <Price product={product} className="text-sm" />
                  <QtyStepper value={qty} step={rules.step} min={rules.min} onChange={(v) => store.setCartQty(product.slug, v)} className="h-10" />
                  <p className="font-extrabold md:text-end">{product.price === null ? t.onRequest : money(product.price * qty)}</p>
                  <button type="button" onClick={() => store.removeFromCart(product.slug)} aria-label={copy.remove} className="flex items-center gap-1 text-sm text-muted hover:text-red-600 md:grid md:size-10 md:place-items-center">
                    <Trash2 className="size-4" />
                    <span className="md:hidden">{copy.remove}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link href={href(lang, "/shop")} className="btn btn-outline">
            {copy.continue}
          </Link>
          <button type="button" onClick={store.clearCart} className="btn px-4 text-muted hover:text-red-600">
            <X className="size-4" /> {copy.clear}
          </button>
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-3xl bg-cream p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">{copy.summary}</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{copy.subtotal}</span>
              <Money amount={store.cartTotal} className="font-bold" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{copy.shipping}</span>
              <span className="font-bold">{store.freeShipping ? copy.free : copy.byLocation}</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.min(100, (store.cartTotal / siteConfig.freeShippingThreshold) * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-gold-dark">
              {remaining > 0 ? fill(copy.freeLeft, { amount: money(remaining) }) : copy.freeReached}
            </p>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-5">
            <span className="font-bold">{copy.total}</span>
            <Money amount={store.cartTotal} className="text-2xl font-extrabold" />
          </div>
          {hasOnRequest && <p className="mt-3 text-xs text-muted">{copy.onRequestItems}</p>}
          <p className="mt-2 text-xs text-muted">{t.pr.priceNote}</p>
        </div>

        <form onSubmit={checkout} className="space-y-4 rounded-3xl border border-line p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">{copy.checkout.title}</h2>
          <Field label={copy.checkout.name} required>
            <input name="name" required className="field" autoComplete="name" />
          </Field>
          <Field label={copy.checkout.phone} required>
            <input name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
          </Field>
          <Field label={copy.checkout.address} required>
            <input name="address" required className="field" autoComplete="street-address" />
          </Field>
          <Field label={copy.checkout.notes}>
            <textarea name="notes" rows={3} className="field resize-none" />
          </Field>
          <button type="submit" className="btn btn-gold h-12 w-full">
            {copy.checkout.submit}
          </button>
        </form>
      </aside>
    </div>
  );
}

export function WishlistView({ copy }: { copy: Dictionary["wishlist"] }) {
  const store = useStore();
  const resolve = useResolve();
  if (!store.hydrated) return <Loading />;
  const items = resolve(store.wishlist);
  if (!items.length) return <EmptyState icon={Heart} text={copy.empty} cta={copy.browse} />;
  return (
    <>
      <div className="mb-8 flex justify-end">
        <button type="button" onClick={() => store.clearList("wishlist")} className="btn btn-outline px-4 py-2">
          <X className="size-4" /> {copy.clear}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

export function CompareView({ copy }: { copy: Dictionary["compare"] }) {
  const { lang, t } = useI18n();
  const store = useStore();
  const resolve = useResolve();
  if (!store.hydrated) return <Loading />;
  const items = resolve(store.compare);
  if (!items.length) return <EmptyState icon={ArrowLeftRight} text={copy.empty} cta={copy.browse} />;
  const specs = items.map((p) => productSpecs(p, lang, t));

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={() => store.clearList("compare")} className="btn btn-outline px-4 py-2">
          <X className="size-4" /> {copy.clear}
        </button>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <tbody className="divide-y divide-line">
            <tr>
              <th className="w-40 bg-cream p-4" />
              {items.map((p) => (
                <td key={p.slug} className="p-4 align-top">
                  <div className="relative">
                    <button type="button" onClick={() => store.toggleCompare(p.slug)} aria-label={copy.remove} className="absolute end-2 top-2 z-10 grid size-8 place-items-center rounded-full bg-white shadow hover:bg-ink hover:text-white">
                      <X className="size-4" />
                    </button>
                    <Image src={p.image} alt="" width={240} height={240} className="aspect-square w-full rounded-2xl object-cover" />
                  </div>
                  <Link href={href(lang, `/product/${p.slug}`)} className="mt-3 block text-base font-extrabold hover:text-gold">
                    {tr(p.name, lang)}
                  </Link>
                  <Price product={p} className="mt-1 block" />
                  <button type="button" onClick={() => store.setPurchase(p.slug)} className="btn btn-dark mt-3 w-full px-3 py-2.5 text-xs">
                    {t.purchaseRequest}
                  </button>
                </td>
              ))}
            </tr>
            {specs[0].map(([label], row) => (
              <tr key={label}>
                <th className="bg-cream p-4 text-start font-bold">{label}</th>
                {specs.map((s, i) => (
                  <td key={items[i].slug} className="p-4">
                    {s[row][1]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
