"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeftRight, Expand, Heart, Link2, MessageCircleQuestion, Star } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { BrandIcon } from "@/components/ui/SocialIcons";
import type { Product } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { fill, tr, type Dictionary } from "@/lib/i18n";
import { cn, whatsappUrl } from "@/lib/utils";
import { submitRequest } from "@/lib/requests";
import { AddToCart } from "./AddToCart";
import { useProductActions } from "./ProductCard";

type Copy = Dictionary["product"];

export function ProductGallery({ src, alt, enlargeLabel }: { src: string; alt: string; enlargeLabel: string }) {
  const { t } = useI18n();
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-sand"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          style={{ transformOrigin: origin }}
          className={cn("object-cover transition-transform duration-300", zoom && "lg:scale-[1.8]")}
        />
        <button type="button" aria-label={enlargeLabel} className="absolute end-4 bottom-4 grid size-11 place-items-center rounded-full bg-white shadow-lg transition hover:bg-ink hover:text-white">
          <Expand className="size-4" />
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label={alt} surface="bg-ink" className="max-w-5xl">
        <div className="relative aspect-square max-h-[calc(100dvh-2rem)] w-full">
          <Image src={src} alt={alt} fill sizes="1000px" className="object-contain" />
          <CloseButton onClick={() => setOpen(false)} label={t.close} className="absolute end-4 top-4" />
        </div>
      </Modal>
    </>
  );
}

export function ProductActions({ product, copy, url }: { product: Product; copy: Copy; url: string }) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const actions = useProductActions(product);
  const vars = { name: tr(product.name, lang), sku: product.sku };
  const shareText = encodeURIComponent(tr(product.name, lang));
  const shareUrl = encodeURIComponent(url);
  const shares = [
    { name: "facebook" as const, link: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: "x" as const, link: `https://x.com/intent/post?url=${shareUrl}&text=${shareText}` },
    { name: "pinterest" as const, link: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}` },
    { name: "linkedin" as const, link: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { name: "whatsapp" as const, link: `https://wa.me/?text=${shareText}%20${shareUrl}` },
  ];

  return (
    <div className="mt-8 space-y-4">
      <AddToCart product={product} />
      <button type="button" onClick={actions.purchase} className="btn btn-gold h-12 w-full text-base">
        {t.purchaseRequest}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a href={whatsappUrl(fill(copy.quoteMessage, vars))} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-3">
          <BrandIcon name="whatsapp" />
          {copy.requestQuote}
        </a>
        <a href={whatsappUrl(fill(copy.questionMessage, vars))} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-3">
          <MessageCircleQuestion className="size-4" />
          {copy.askQuestion}
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-sm font-semibold">
        <div className="flex gap-5">
          <button type="button" onClick={actions.toggleWishlist} className={cn("flex items-center gap-1.5 hover:text-gold", actions.inWishlist && "text-gold")}>
            <Heart className={cn("size-4", actions.inWishlist && "fill-current")} />
            {actions.inWishlist ? t.removeFromWishlist : t.addToWishlist}
          </button>
          <button type="button" onClick={actions.toggleCompare} className={cn("flex items-center gap-1.5 hover:text-gold", actions.inCompare && "text-gold")}>
            <ArrowLeftRight className="size-4" />
            {t.addToCompare}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="me-1 text-muted">{t.share}:</span>
          {shares.map((s) => (
            <a key={s.name} href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="grid size-8 place-items-center rounded-full text-ink/60 hover:bg-cream hover:text-gold">
              <BrandIcon name={s.name} className="size-3.5" />
            </a>
          ))}
          <button
            type="button"
            aria-label={t.copyLink}
            onClick={() => navigator.clipboard?.writeText(url).then(() => toast(t.linkCopied))}
            className="grid size-8 place-items-center rounded-full text-ink/60 hover:bg-cream hover:text-gold"
          >
            <Link2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductTabs({
  product,
  copy,
  specs,
  description,
}: {
  product: Product;
  copy: Copy;
  specs: [string, string][];
  description: string[];
}) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const [tab, setTab] = useState<"description" | "additional" | "reviews">("description");
  const [rating, setRating] = useState(5);
  const name = tr(product.name, lang);

  return (
    <div>
      <div role="tablist" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-line">
        {(["description", "additional", "reviews"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn("-mb-px shrink-0 border-b-2 py-4 text-base font-extrabold transition", tab === key ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink")}
          >
            {copy[key]}
            {key === "reviews" && " (0)"}
          </button>
        ))}
      </div>

      <div className="py-10">
        {tab === "description" && (
          <div className="prose-stone max-w-3xl">
            {description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}

        {tab === "additional" && (
          <table className="w-full max-w-3xl overflow-hidden rounded-2xl border border-line text-sm">
            <tbody className="divide-y divide-line">
              {specs.map(([label, value]) => (
                <tr key={label}>
                  <th className="w-1/3 bg-cream px-5 py-3.5 text-start font-bold">{label}</th>
                  <td className="px-5 py-3.5">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "reviews" && (
          <div className="grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-extrabold">0.0</span>
                <div>
                  <div className="flex text-line">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">{copy.noReviews}</p>
                </div>
              </div>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                submitRequest({ type: "review", lang, name: data.get("name"), email: data.get("email"), lines: [
                  `*${copy.reviewMessage} — ${siteConfig.name}*`,
                  `${name} (${product.sku})`,
                  `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`,
                  `${data.get("review")}`,
                  `— ${data.get("name")} (${data.get("email")})`,
                ] });
                toast(t.sentWhatsApp);
                e.currentTarget.reset();
              }}
            >
              <h3 className="text-lg font-extrabold">{fill(copy.beFirst, { name })}</h3>
              <div>
                <span className="label">{copy.rating}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} aria-label={`${s}`} className={s <= rating ? "text-gold" : "text-line"}>
                      <Star className="size-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <Field label={copy.review} required>
                <textarea name="review" required rows={4} className="field resize-none" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={copy.name} required>
                  <input name="name" required className="field" />
                </Field>
                <Field label={copy.email} required>
                  <input name="email" type="email" required className="field" />
                </Field>
              </div>
              <p className="text-xs text-muted">{copy.reviewNote}</p>
              <button type="submit" className="btn btn-dark">
                {copy.submitReview}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
