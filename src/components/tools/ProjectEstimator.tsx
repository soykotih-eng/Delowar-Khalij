"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Plus, Printer, Trash2 } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { Logo } from "@/components/ui/Logo";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { categoryGroups, childCategories } from "@/data/categories";
import { getProduct, pricedProducts } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { fill, tr, type Dictionary } from "@/lib/i18n";
import { formatDate, formatMoney, formatNumber, sendWhatsApp } from "@/lib/utils";

type Mode = "supply" | "install";
type Item = { id: number; slug: string; area: number; mode: Mode };
type Client = { name: string; phone: string; project: string };
type Copy = Dictionary["estimate"];

const unitPrice = (item: Item) =>
  (getProduct(item.slug)?.price ?? 0) + (item.mode === "install" ? siteConfig.installationRate : 0);
const lineTotal = (item: Item) => Math.max(0, item.area) * unitPrice(item);

export function ProjectEstimator({ copy }: { copy: Copy }) {
  const { lang, t } = useI18n();
  const { currency, toast } = useStore();
  const [client, setClient] = useState<Client>({ name: "", phone: "", project: "" });
  const [items, setItems] = useState<Item[]>([
    { id: 1, slug: "carrara-white", area: 40, mode: "install" },
    { id: 2, slug: "black-galaxy-granite", area: 8, mode: "supply" },
  ]);
  const [quote, setQuote] = useState<{ number: string; date: Date } | null>(null);

  const money = (v: number) => formatMoney(v, currency, lang);
  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const update = (id: number, patch: Partial<Item>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  // Materials grouped by category for the <select>.
  const groups = categoryGroups.flatMap((g) => childCategories(g.slug))
    .map((c) => ({ label: tr(c.name, lang), options: pricedProducts.filter((p) => p.category === c.slug) }))
    .filter((g) => g.options.length);

  function sendQuote() {
    if (!quote) return;
    sendWhatsApp([
      `*${copy.message} — ${siteConfig.name}*`,
      `${copy.quote.number}: ${quote.number}`,
      `${copy.quote.client}: ${client.name} · ${client.phone}`,
      `${copy.quote.project}: ${client.project}`,
      ...items.map((i) => `• ${tr(getProduct(i.slug)!.name, lang)} — ${i.area} m² — ${i.mode === "supply" ? copy.items.supply : copy.items.supplyInstall} — ${money(lineTotal(i))}`),
      `${copy.total}: ${money(total)}`,
    ]);
    toast(t.sentWhatsApp);
  }

  return (
    <>
      <form
        className="grid gap-8 lg:grid-cols-[1fr_340px]"
        onSubmit={(e) => {
          e.preventDefault();
          setQuote({ number: `DK-${Date.now().toString().slice(-6)}`, date: new Date() });
        }}
      >
        <div className="space-y-6">
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold">{copy.client.title}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {(["name", "phone", "project"] as const).map((key) => (
                <Field key={key} label={copy.client[key]} required>
                  <input
                    required
                    type={key === "phone" ? "tel" : "text"}
                    dir={key === "phone" ? "ltr" : undefined}
                    value={client[key]}
                    onChange={(e) => setClient((c) => ({ ...c, [key]: e.target.value }))}
                    className="field"
                  />
                </Field>
              ))}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold">{copy.items.title}</h2>
            <div className="mt-5 space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-2xl border border-line p-4 sm:grid-cols-[2fr_1fr_1.4fr_auto] sm:items-end">
                  <Field label={`${index + 1}. ${copy.items.material}`}>
                    <select value={item.slug} onChange={(e) => update(item.id, { slug: e.target.value })} className="field">
                      {groups.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.options.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {tr(p.name, lang)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                  <Field label={copy.items.area}>
                    <input type="number" min={0} step={0.5} value={item.area} onChange={(e) => update(item.id, { area: Number(e.target.value) })} className="field" />
                  </Field>
                  <Field label={copy.items.mode}>
                    <select value={item.mode} onChange={(e) => update(item.id, { mode: e.target.value as Mode })} className="field">
                      <option value="supply">{copy.items.supply}</option>
                      <option value="install">{copy.items.supplyInstall}</option>
                    </select>
                  </Field>
                  <button
                    type="button"
                    aria-label={copy.items.remove}
                    disabled={items.length === 1}
                    onClick={() => setItems((list) => list.filter((i) => i.id !== item.id))}
                    className="grid size-12 place-items-center rounded-xl border border-line text-muted hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <div className="flex justify-between text-sm sm:col-span-4">
                    <span className="text-muted">
                      {copy.items.unitPrice}: <b className="text-ink">{money(unitPrice(item))}</b>
                    </span>
                    <span className="text-muted">
                      {copy.items.total}: <b className="text-ink">{money(lineTotal(item))}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setItems((list) => [...list, { id: Date.now(), slug: pricedProducts[0].slug, area: 10, mode: "supply" }])}
              className="btn btn-outline mt-4 px-4 py-2.5 text-xs"
            >
              <Plus className="size-4" /> {copy.items.add}
            </button>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
            <p className="text-sm text-white/60">{copy.total}</p>
            <p className="mt-2 text-4xl font-extrabold text-gold">{money(total)}</p>
            <ul className="mt-6 space-y-2 text-xs leading-5 text-white/55">
              {copy.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" />
                  {fill(n, { days: siteConfig.quoteValidityDays })}
                </li>
              ))}
            </ul>
            <button type="submit" className="btn btn-gold mt-6 w-full">
              <FileText className="size-4" /> {copy.preview}
            </button>
          </div>
        </aside>
      </form>

      <Modal open={!!quote} onClose={() => setQuote(null)} label={copy.quote.title} className="max-w-4xl">
        {quote && (
          <>
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white p-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => window.print()} className="btn btn-dark px-4 py-2.5">
                  <Printer className="size-4" /> {copy.quote.print}
                </button>
                <button type="button" onClick={() => window.print()} className="btn btn-outline px-4 py-2.5">
                  <FileText className="size-4" /> {copy.quote.pdf}
                </button>
                <button type="button" onClick={sendQuote} className="btn bg-[#25d366] px-4 py-2.5 text-white">
                  <BrandIcon name="whatsapp" /> {copy.quote.whatsapp}
                </button>
              </div>
              <CloseButton onClick={() => setQuote(null)} label={copy.quote.close} />
            </div>
            <QuoteDocument copy={copy} client={client} items={items} quote={quote} total={total} />
            {createPortal(
              <div id="print-area" className="hidden bg-white text-ink" dir={lang === "ar" ? "rtl" : "ltr"}>
                <QuoteDocument copy={copy} client={client} items={items} quote={quote} total={total} />
              </div>,
              document.body,
            )}
          </>
        )}
      </Modal>
    </>
  );
}

function QuoteDocument({
  copy,
  client,
  items,
  quote,
  total,
}: {
  copy: Copy;
  client: Client;
  items: Item[];
  quote: { number: string; date: Date };
  total: number;
}) {
  const { lang } = useI18n();
  const { currency } = useStore();
  const q = copy.quote;
  const money = (v: number) => formatMoney(v, currency, lang);
  const validUntil = new Date(quote.date.getTime() + siteConfig.quoteValidityDays * 86_400_000);

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-6">
        <div>
          {/* priority = eager load, so the logo is ready in the hidden print copy too */}
          <Logo priority className="h-14 sm:h-16" />
          <p className="mt-3 text-xs leading-5 text-muted">
            {siteConfig.address[lang]}
            <br />
            <span dir="ltr">{siteConfig.phone}</span> · {siteConfig.email}
          </p>
        </div>
        <div className="text-end">
          <h2 className="text-3xl font-extrabold">{q.title}</h2>
          <p className="mt-2 text-sm">
            {q.number}: <b>{quote.number}</b>
          </p>
          <p className="text-sm">
            {q.date}: <b>{formatDate(quote.date.toISOString(), lang)}</b>
          </p>
          <p className="text-sm">
            {q.validUntil}: <b>{formatDate(validUntil.toISOString(), lang)}</b>
          </p>
        </div>
      </div>

      <div className="grid gap-2 py-6 text-sm sm:grid-cols-3">
        <p>
          <span className="text-muted">{q.client}:</span> <b>{client.name}</b>
        </p>
        <p>
          <span className="text-muted">{q.phone}:</span> <b dir="ltr">{client.phone}</b>
        </p>
        <p>
          <span className="text-muted">{q.project}:</span> <b>{client.project}</b>
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-ink text-white">
            <th className="p-3 text-start">#</th>
            <th className="p-3 text-start">{q.item}</th>
            <th className="p-3 text-end">{q.qty}</th>
            <th className="p-3 text-end">{q.unitPrice}</th>
            <th className="p-3 text-end">{q.amount}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item, i) => {
            const product = getProduct(item.slug)!;
            return (
              <tr key={item.id}>
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  <b>{tr(product.name, lang)}</b>
                  <span className="block text-xs text-muted">
                    {product.sku} · {item.mode === "supply" ? copy.items.supply : copy.items.supplyInstall}
                  </span>
                </td>
                <td className="p-3 text-end">{formatNumber(item.area, lang)}</td>
                <td className="p-3 text-end">{money(unitPrice(item))}</td>
                <td className="p-3 text-end font-bold">{money(lineTotal(item))}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <td colSpan={4} className="p-3 text-end font-extrabold">
              {copy.total}
            </td>
            <td className="p-3 text-end text-lg font-extrabold">{money(total)}</td>
          </tr>
        </tfoot>
      </table>

      <ul className="mt-8 space-y-1 text-xs text-muted">
        {copy.notes.map((n) => (
          <li key={n}>• {fill(n, { days: siteConfig.quoteValidityDays })}</li>
        ))}
        <li>• {q.footer}</li>
      </ul>
    </div>
  );
}
