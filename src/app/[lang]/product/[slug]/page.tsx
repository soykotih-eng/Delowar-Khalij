import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Ruler, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductActions, ProductGallery, ProductTabs } from "@/components/product/ProductDetail";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Price } from "@/components/ui/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory } from "@/data/categories";
import { getProduct, productImage, products, productsInCategory } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { fill, href, tr, type Locale } from "@/lib/i18n";
import { productSpecs } from "@/lib/product-specs";
import { cn, formatMoney } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: tr(product.name, lang),
    description: tr(product.short, lang),
    openGraph: { images: [productImage(product.slug)] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const d = getDictionary(lang);
  const t = d.common;
  const category = getCategory(product.category)!;
  const parent = category.parent ? getCategory(category.parent) : undefined;
  const name = tr(product.name, lang);
  const specs = productSpecs(product, lang, t);
  const related = productsInCategory(parent?.slug ?? category.slug)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);
  const perkIcons = [Truck, Ruler, BadgeCheck];
  const amount = formatMoney(siteConfig.freeShippingThreshold, "SAR", lang);

  return (
    <>
      <div className="border-b border-line bg-cream">
        <div className="container-x py-4">
          <Breadcrumbs
            lang={lang}
            items={[
              ...(parent ? [{ label: tr(parent.name, lang), path: `/product-category/${parent.slug}` }] : []),
              { label: tr(category.name, lang), path: `/product-category/${category.slug}` },
              { label: name },
            ]}
          />
        </div>
      </div>

      <section className="container-x grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <ProductGallery src={productImage(product.slug)} alt={name} enlargeLabel={d.product.enlarge} />
        </div>

        <div>
          <Link href={href(lang, `/product-category/${category.slug}`)} className="eyebrow hover:text-gold-dark">
            {tr(category.name, lang)}
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">{name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">
              {t.sku}: <span className="font-bold text-ink">{product.sku}</span>
            </span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-gold-light text-gold-dark")}>
              {product.inStock ? t.inStock : t.onRequest}
            </span>
          </div>
          <Price product={product} className="mt-6 block text-3xl" />
          <p className="mt-5 text-base leading-8 text-ink/70">{tr(product.short, lang)}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.slice(2, 6).map(([label, value]) => (
              <div key={label} className="rounded-xl bg-cream px-4 py-3">
                <dt className="text-[11px] font-semibold text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>

          <ProductActions product={product} copy={d.product} url={`${siteConfig.url}/${lang}/product/${product.slug}`} />

          <ul className="mt-8 grid gap-3 rounded-2xl border border-line p-5 sm:grid-cols-3">
            {d.product.perks.map((perk, i) => {
              const Icon = perkIcons[i];
              return (
                <li key={perk.title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    <span className="block text-sm font-extrabold">{perk.title}</span>
                    <span className="block text-xs leading-5 text-muted">{fill(perk.text, { amount })}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-x">
        <ProductTabs product={product} copy={d.product} specs={specs} description={[tr(product.short, lang), ...d.product.descGeneric]} />
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-cream py-16 lg:py-24">
          <div className="container-x">
            <SectionHeading align="start" title={d.product.related} />
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
