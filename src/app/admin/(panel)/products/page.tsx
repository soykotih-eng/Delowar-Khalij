import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { deleteProductAction, updatePricesAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/parts";
import { ConfirmButton, Notice } from "@/components/admin/ui";
import { units } from "@/data/attributes";
import { categories, getCategory } from "@/data/categories";
import { listProducts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Products & rates" };

type Props = { searchParams: Promise<{ q?: string; category?: string; saved?: string; deleted?: string; prices?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const products = await listProducts({ q: sp.q?.trim(), category: sp.category || undefined });
  const leaves = categories.filter((c) => c.parent);

  return (
    <>
      <PageHeader title="Products & rates" text="Update prices (SAR) in the list and press “Save all prices”. Leave a price empty to show “On request”.">
        <Link href="/admin/products/new" className="btn btn-dark rounded-lg bg-navy px-4 py-2.5">
          <Plus className="size-4" /> Add product
        </Link>
      </PageHeader>

      <div className="mb-4 space-y-2">
        {sp.saved && <Notice>“{sp.saved}” saved. It is live on the website now.</Notice>}
        {sp.deleted && <Notice>Product deleted.</Notice>}
        {sp.prices !== undefined && <Notice>{Number(sp.prices) ? `${sp.prices} price(s) updated on the website.` : "No prices were changed."}</Notice>}
      </div>

      <form className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={sp.q} placeholder="Search name or SKU…" className="field ps-10" />
        </label>
        <select name="category" defaultValue={sp.category ?? ""} className="field sm:w-60">
          <option value="">All categories</option>
          {leaves.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name.en}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-dark rounded-lg bg-navy px-5">Search</button>
      </form>

      {/* Price inputs belong to this form via form="prices"; delete buttons use their own forms. */}
      <form id="prices" action={updatePricesAction} />

      {/* Table-like rows on desktop, compact cards on phones — the price box is always visible. */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)_88px] gap-4 border-b border-line bg-steel px-4 py-3 text-xs font-bold text-muted uppercase lg:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price (SAR)</span>
          <span>Stock</span>
          <span className="text-end">Actions</span>
        </div>
        <ul className="divide-y divide-line">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-[52px_1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 hover:bg-steel/50 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)_88px] lg:gap-4"
            >
              <div className="contents lg:flex lg:items-center lg:gap-3">
                <Image src={p.image} alt="" width={52} height={52} className="size-13 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-bold text-navy">
                    <span className="truncate">{p.name.en}</span>
                    {p.featured && <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-label="Featured" />}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {p.sku}
                    {p.name.ar && <> · <span dir="rtl">{p.name.ar}</span></>}
                    <span className="lg:hidden"> · {getCategory(p.category)?.name.en ?? p.category}</span>
                  </p>
                </div>
              </div>
              <span className="hidden text-sm text-muted lg:block">{getCategory(p.category)?.name.en ?? p.category}</span>
              <div className="col-span-2 col-start-2 flex items-center gap-2 lg:col-span-1 lg:col-start-auto">
                <input
                  form="prices"
                  name={`price-${p.id}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  defaultValue={p.price ?? ""}
                  placeholder="On request"
                  aria-label={`Price of ${p.name.en}`}
                  className="field w-32 px-3 py-2"
                />
                <span className="text-xs text-muted">/ {units[p.unit].en}</span>
                <span className={`ms-auto text-xs font-semibold lg:hidden ${p.inStock ? "text-emerald-700" : "text-amber-700"}`}>
                  {p.inStock ? "Available" : "On request"}
                </span>
              </div>
              <span className={`hidden text-sm font-semibold lg:block ${p.inStock ? "text-emerald-700" : "text-amber-700"}`}>
                {p.inStock ? "Available" : "On request"}
              </span>
              <div className="col-start-3 row-start-1 flex justify-end gap-1 lg:col-start-auto lg:row-start-auto">
                <Link href={`/admin/products/${p.id}`} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-steel hover:text-navy" aria-label="Edit">
                  <Pencil className="size-4" />
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton message={`Delete “${p.name.en}” from the website?`} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
        {products.length === 0 && <p className="p-10 text-center text-sm text-muted">No products found.</p>}
      </div>

      {products.length > 0 && (
        <div className="sticky bottom-4 mt-4 flex justify-end">
          <button type="submit" form="prices" className="btn btn-gold rounded-xl px-6 py-3 shadow-xl">
            Save all prices
          </button>
        </div>
      )}
    </>
  );
}

