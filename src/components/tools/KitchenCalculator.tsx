"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field, QtyStepper } from "@/components/ui/Fields";
import { finishes, origins } from "@/data/attributes";
import { getCategory } from "@/data/categories";
import { isKitchenMaterial } from "@/data/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { siteConfig } from "@/lib/config";
import { fill, href, tr, type Dictionary } from "@/lib/i18n";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import { submitRequest } from "@/lib/requests";

type Kind = "top" | "backsplash" | "edge";
type Piece = { id: number; kind: Kind; length: number; width: number };

const newSize: Record<Kind, [number, number]> = { top: [200, 60], backsplash: [300, 10], edge: [300, 4] };
const initialPieces: Piece[] = [
  { id: 1, kind: "top", length: 300, width: 60 },
  { id: 2, kind: "top", length: 180, width: 60 },
];

export function KitchenCalculator({ copy }: { copy: Dictionary["kitchen"] }) {
  const { lang, t } = useI18n();
  const { currency, toast } = useStore();
  const { products, getProduct } = useCatalog();
  const kitchenMaterials = products.filter(isKitchenMaterial);
  const [slug, setSlug] = useState(
    () => kitchenMaterials.find((p) => p.slug === "black-galaxy-granite")?.slug ?? kitchenMaterials[0]?.slug ?? "",
  );
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [extra, setExtra] = useState(0);

  const material = getProduct(slug);
  const k = siteConfig.kitchen;
  const money = (v: number) => formatMoney(v, currency, lang);

  const area = pieces.reduce((sum, p) => sum + (p.length * p.width) / 10000, 0);
  const baseQty = Math.max(area, siteConfig.minOrderArea);
  const qty = Math.round((baseQty + extra) * 100) / 100;
  const price = material?.price ?? 0;
  const waste = (price * k.wastePercent) / 100;
  const perM2 = price + waste + k.transportPerM2 + k.cuttingPerM2;
  const total = qty * perM2;
  const freeShipping = total >= siteConfig.freeShippingThreshold;

  const pieceLabel = { top: copy.pieces.top, backsplash: copy.pieces.backsplash, edge: copy.pieces.edge };
  const addPiece = (kind: Kind) =>
    setPieces((list) => [...list, { id: Date.now(), kind, length: newSize[kind][0], width: newSize[kind][1] }]);
  const updatePiece = (id: number, key: "length" | "width", value: number) =>
    setPieces((list) => list.map((p) => (p.id === id ? { ...p, [key]: Math.max(0, value) } : p)));

  const breakdown: [string, string][] = material
    ? [
        [copy.breakdown.productPrice, money(price)],
        [fill(copy.breakdown.waste, { p: k.wastePercent }), money(waste)],
        [copy.breakdown.transport, money(k.transportPerM2)],
        [copy.breakdown.cutting, money(k.cuttingPerM2)],
        [copy.breakdown.preparation, copy.breakdown.afterInspection],
        [copy.breakdown.installation, copy.breakdown.afterInspection],
      ]
    : [];

  function send() {
    if (!material) return;
    submitRequest({ type: "kitchen", lang, total, lines: [
      `*${copy.message} — ${siteConfig.name}*`,
      `${copy.material.select}: ${tr(material.name, lang)} (${material.sku})`,
      ...pieces.map((p) => `• ${pieceLabel[p.kind]}: ${p.length} × ${p.width} cm`),
      `${copy.qty.title}: ${formatNumber(qty, lang)}`,
      `${copy.breakdown.pricePerM2}: ${money(perM2)}`,
      `${copy.breakdown.totalValue}: ${money(total)}`,
    ] });
    toast(t.sentWhatsApp);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-6">
        <section className="card p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">{copy.material.title}</h2>
          <Field label={copy.material.select} className="mt-5">
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="field">
              <option value="">{copy.material.placeholder}</option>
              {kitchenMaterials.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {tr(p.name, lang)} — {money(p.price!)}
                </option>
              ))}
            </select>
          </Field>
          {material && (
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[
                [copy.material.code, material.sku],
                [copy.material.price, money(price)],
                [copy.material.category, tr(getCategory(material.category)!.name, lang)],
                [copy.material.origin, tr(origins[material.origin], lang)],
                [copy.material.thickness, material.thickness ? `${material.thickness} ${t.cm}` : t.custom],
                [copy.material.finish, tr(finishes[material.finish], lang)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-cream px-4 py-3">
                  <dt className="text-[11px] font-semibold text-muted">{label}</dt>
                  <dd className="mt-0.5 font-extrabold">{value}</dd>
                </div>
              ))}
              <div className="col-span-2 rounded-xl bg-cream px-4 py-3 sm:col-span-3">
                <dt className="text-[11px] font-semibold text-muted">{copy.material.description}</dt>
                <dd className="mt-0.5 leading-6">{tr(material.short, lang)}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">{copy.pieces.title}</h2>
          <div className="mt-5 space-y-3">
            {pieces.map((p, i) => (
              <div key={p.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-2xl border border-line p-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
                <p className="col-span-3 text-sm font-extrabold sm:col-span-1 sm:self-center">
                  {i + 1}. {pieceLabel[p.kind]}
                </p>
                <Field label={copy.pieces.length}>
                  <input type="number" min={0} value={p.length} onChange={(e) => updatePiece(p.id, "length", Number(e.target.value))} className="field px-3 py-2.5" />
                </Field>
                <Field label={copy.pieces.width}>
                  <input type="number" min={0} value={p.width} onChange={(e) => updatePiece(p.id, "width", Number(e.target.value))} className="field px-3 py-2.5" />
                </Field>
                <button
                  type="button"
                  aria-label={copy.pieces.remove}
                  onClick={() => setPieces((list) => list.filter((x) => x.id !== p.id))}
                  className="grid size-11 place-items-center rounded-xl border border-line text-muted hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ["top", copy.pieces.addPiece],
              ["backsplash", copy.pieces.addBacksplash],
              ["edge", copy.pieces.addEdge],
            ] as [Kind, string][]).map(([kind, label]) => (
              <button key={kind} type="button" onClick={() => addPiece(kind)} className="btn btn-outline px-4 py-2.5 text-xs">
                <Plus className="size-4" /> {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-xl font-extrabold">{copy.qty.title}</h2>
            <p className="mt-1 text-sm text-muted">{copy.qty.auto}</p>
            <p className="mt-1 text-xs font-bold text-gold-dark">{fill(copy.qty.min, { min: siteConfig.minOrderArea })}</p>
          </div>
          <QtyStepper value={qty} min={Math.round(baseQty * 100) / 100} step={0.5} onChange={(v) => setExtra(Math.max(0, v - baseQty))} />
        </section>
      </div>

      <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
        <section className="rounded-3xl bg-ink p-6 text-white sm:p-8">
          <h2 className="text-xl font-extrabold">{copy.breakdown.title}</h2>
          {!material ? (
            <p className="mt-6 text-white/60">{copy.empty}</p>
          ) : (
            <>
              <dl className="mt-6 space-y-3 text-sm">
                {breakdown.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-white/60">{label}</dt>
                    <dd className={cn("font-semibold", value === copy.breakdown.afterInspection && "text-gold")}>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">{copy.breakdown.pricePerM2}</span>
                  <span className="font-bold">{money(perM2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{copy.breakdown.totalAmount}</span>
                  <span className="font-bold">
                    {formatNumber(qty, lang)} m² × {money(perM2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{copy.breakdown.shipping}</span>
                  <span className="font-bold">{freeShipping ? t.pr.shippingFree : t.pr.shippingByLocation}</span>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                <span className="font-bold">{copy.breakdown.totalValue}</span>
                <span className="text-3xl font-extrabold text-gold">{money(total)}</span>
              </div>
              <p className="mt-4 text-xs text-white/50">{copy.note}</p>
              <button type="button" onClick={send} className="btn btn-gold mt-6 w-full">
                {copy.send}
              </button>
            </>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="font-extrabold">{copy.preview.title}</h2>
              <p className="text-xs text-muted">{copy.preview.text}</p>
            </div>
            <span className="rounded-full bg-gold-light px-2.5 py-1 text-[10px] font-bold text-gold-dark">{copy.preview.badge}</span>
          </div>
          <KitchenPreview image={material?.image} />
        </section>

        <section className="rounded-3xl bg-cream p-6">
          <h2 className="font-extrabold">{copy.projectTitle}</h2>
          <p className="mt-1 text-sm text-muted">{copy.projectText}</p>
          <Link href={href(lang, "/project-cost")} className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-gold-dark hover:text-ink">
            {copy.projectCta}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </section>
      </div>
    </div>
  );
}

/** Simple kitchen elevation; worktop and backsplash are filled with the selected stone. */
function KitchenPreview({ image }: { image?: string }) {
  const stone = image ? "url(#stone)" : "#d9d2c7";
  return (
    <svg viewBox="0 0 400 250" className="block w-full" role="img" aria-hidden>
      <defs>
        {image && (
          <pattern id="stone" patternUnits="userSpaceOnUse" width="220" height="220">
            <image href={image} width="220" height="220" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
        <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="#f1ece4" />
      <rect y="214" width="400" height="36" fill="#d8d0c4" />
      {/* Upper cabinets */}
      <rect x="30" y="18" width="340" height="58" rx="3" fill="#fff" stroke="#e3dccf" />
      {[115, 200, 285].map((x) => (
        <line key={x} x1={x} y1="18" x2={x} y2="76" stroke="#e3dccf" />
      ))}
      {[105, 125, 275, 295].map((x) => (
        <rect key={x} x={x - 1} y="58" width="2" height="12" rx="1" fill="#b08a4e" />
      ))}
      {/* Backsplash */}
      <rect x="30" y="76" width="340" height="66" fill={stone} />
      <rect x="30" y="76" width="340" height="66" fill="url(#shade)" />
      {/* Hood */}
      <path d="M150 76h60l12 22h-84z" fill="#cfc8bc" />
      {/* Worktop */}
      <polygon points="22,142 378,142 392,156 8,156" fill={stone} />
      <polygon points="22,142 378,142 392,156 8,156" fill="#fff" opacity=".12" />
      <rect x="8" y="156" width="384" height="8" fill={stone} />
      <rect x="8" y="156" width="384" height="8" fill="#000" opacity=".22" />
      {/* Sink & hob */}
      <rect x="236" y="145" width="58" height="7" rx="2" fill="#9e9e9e" opacity=".75" />
      <path d="M265 145v-14h9" fill="none" stroke="#8a8a8a" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="160" cy="149" rx="11" ry="3" fill="#2a2a2a" opacity=".7" />
      <ellipse cx="192" cy="149" rx="11" ry="3" fill="#2a2a2a" opacity=".7" />
      {/* Lower cabinets */}
      <rect x="14" y="164" width="372" height="50" fill="#2b2b2b" />
      {[107, 200, 293].map((x) => (
        <line key={x} x1={x} y1="166" x2={x} y2="212" stroke="#444" />
      ))}
      {[60, 153, 246, 339].map((x) => (
        <rect key={x} x={x - 12} y="172" width="24" height="2.5" rx="1" fill="#b08a4e" />
      ))}
    </svg>
  );
}
