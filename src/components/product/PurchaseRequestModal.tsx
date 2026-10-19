"use client";

import Image from "next/image";
import { useState } from "react";
import { Info } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { siteConfig } from "@/lib/config";
import { fill, tr } from "@/lib/i18n";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import { submitRequest } from "@/lib/requests";

type InstallType = "floors" | "walls-dry" | "walls-wet" | "stairs";

function PurchaseForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { lang, t } = useI18n();
  const { currency, toast } = useStore();
  const pr = t.pr;
  const [service, setService] = useState<"supply" | "install">("supply");
  const [install, setInstall] = useState<InstallType>("floors");
  const [length, setLength] = useState(2);
  const [width, setWidth] = useState(1);
  const [pieces, setPieces] = useState(1);

  const area = Math.max(0, length * width * pieces);
  const billable = Math.max(area, siteConfig.minOrderArea);
  const rate = product.price === null ? null : product.price + (service === "install" ? siteConfig.installationRate : 0);
  const total = rate === null ? null : billable * rate;
  const freeShipping = total !== null && total >= siteConfig.freeShippingThreshold;
  const money = (v: number) => formatMoney(v, currency, lang);

  const installOptions: [InstallType, string][] = [
    ["floors", pr.installFloors],
    ["walls-dry", pr.installWallsDry],
    ["walls-wet", pr.installWallsWet],
    ["stairs", pr.installStairs],
  ];

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submitRequest({ type: "purchase", lang, name: data.get("name"), phone: data.get("phone"), email: data.get("email"), location: data.get("address"), total, lines: [
      `*${pr.message} — ${siteConfig.name}*`,
      `${tr(product.name, lang)} (${product.sku})`,
      `${pr.serviceType}: ${service === "supply" ? pr.supplyOnly : pr.supplyInstall}`,
      service === "install" && `${pr.installType}: ${installOptions.find(([k]) => k === install)?.[1]}`,
      `${pr.dimensions}: ${length} × ${width} m × ${pieces} = ${formatNumber(area, lang)} m²`,
      total !== null && `${pr.totalValue}: ${money(total)}`,
      "",
      `${pr.name}: ${data.get("name")}`,
      `${pr.phone}: ${data.get("phone")}`,
      `${pr.address}: ${data.get("address")}`,
      data.get("email") && `${pr.email}: ${data.get("email")}`,
      data.get("notes") && `${pr.notes}: ${data.get("notes")}`,
    ] });
    toast(t.sentWhatsApp);
    onClose();
  }

  return (
    <form onSubmit={submit} className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">{pr.title}</h2>
          <p className="mt-1 text-sm text-muted">{pr.subtitle}</p>
        </div>
        <CloseButton onClick={onClose} label={t.close} className="shrink-0" />
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-cream p-3">
        <Image src={product.image} alt="" width={64} height={64} className="size-16 rounded-xl object-cover" />
        <div>
          <p className="font-extrabold">{tr(product.name, lang)}</p>
          <p className="text-xs text-muted">{product.sku}</p>
          <Price product={product} className="text-sm" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <fieldset>
            <legend className="label">{pr.serviceType}</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["supply", "install"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-bold transition",
                    service === s ? "border-gold bg-gold/10 text-gold-dark" : "border-line hover:border-ink/30",
                  )}
                >
                  {s === "supply" ? pr.supplyOnly : pr.supplyInstall}
                </button>
              ))}
            </div>
          </fieldset>

          {service === "install" && (
            <Field label={pr.installType}>
              <select className="field" value={install} onChange={(e) => setInstall(e.target.value as InstallType)}>
                {installOptions.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
                <option disabled>{pr.installMechanical}</option>
              </select>
              {install === "stairs" && <p className="mt-2 text-xs text-gold-dark">{pr.stairsNote}</p>}
            </Field>
          )}

          <fieldset>
            <legend className="label">{pr.dimensions}</legend>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: pr.length, value: length, set: setLength, step: 0.1 },
                { label: pr.width, value: width, set: setWidth, step: 0.1 },
                { label: pr.pieces, value: pieces, set: setPieces, step: 1 },
              ].map((d) => (
                <label key={d.label} className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-muted">{d.label}</span>
                  <input
                    type="number"
                    min={0}
                    step={d.step}
                    value={d.value}
                    onChange={(e) => d.set(Math.max(0, Number(e.target.value)))}
                    className="field px-3"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{fill(pr.minOrder, { min: siteConfig.minOrderArea })}</p>
          </fieldset>

          <div className="rounded-2xl border border-line p-4 text-sm">
            <Row label={pr.area} value={`${formatNumber(area, lang)} m²`} />
            {rate === null ? (
              <p className="mt-3 flex gap-2 text-gold-dark">
                <Info className="mt-0.5 size-4 shrink-0" /> {pr.onRequestNote}
              </p>
            ) : (
              <>
                <Row label={pr.pricePerM2} value={money(product.price!)} />
                {service === "install" && <Row label={pr.installation} value={`+ ${money(siteConfig.installationRate)}`} />}
                <Row label={pr.totalAmount} value={money(total!)} />
                <Row label={pr.shipping} value={freeShipping ? pr.shippingFree : pr.shippingByLocation} />
                <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-extrabold">
                  <span>{pr.totalValue}</span>
                  <span>{money(total!)}</span>
                </div>
                <p className="mt-2 text-xs text-muted">{pr.priceNote}</p>
              </>
            )}
          </div>
        </div>

        <fieldset className="space-y-4">
          <legend className="label mb-3 text-sm">{pr.contactDetails}</legend>
          <Field label={pr.name} required>
            <input name="name" required className="field" autoComplete="name" />
          </Field>
          <Field label={pr.phone} required>
            <input name="phone" type="tel" required className="field" autoComplete="tel" dir="ltr" />
          </Field>
          <Field label={pr.address} required>
            <input name="address" required className="field" autoComplete="street-address" />
          </Field>
          <Field label={pr.email}>
            <input name="email" type="email" className="field" autoComplete="email" />
          </Field>
          <Field label={pr.notes}>
            <textarea name="notes" rows={3} className="field resize-none" />
          </Field>
        </fieldset>
      </div>

      <button type="submit" className="btn btn-gold mt-6 h-12 w-full">
        {pr.submit}
      </button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function PurchaseRequestModal() {
  const { t } = useI18n();
  const { purchase, setPurchase } = useStore();
  const { getProduct } = useCatalog();
  const product = purchase ? getProduct(purchase) : undefined;
  const close = () => setPurchase(null);

  return (
    <Modal open={!!product} onClose={close} label={t.pr.title} className="max-w-4xl">
      {product && <PurchaseForm product={product} onClose={close} />}
    </Modal>
  );
}
