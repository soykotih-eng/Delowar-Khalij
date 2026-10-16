import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shop } from "@/components/shop/Shop";
import { PageHero } from "@/components/ui/PageHero";
import { categories, getCategory } from "@/data/categories";
import { getDictionary } from "@/lib/dictionaries";
import { tr, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: tr(category.name, lang), description: tr(category.description, lang) };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const d = getDictionary(lang);
  const parent = category.parent ? getCategory(category.parent) : undefined;

  return (
    <>
      <PageHero
        lang={lang}
        eyebrow={parent ? tr(parent.name, lang) : d.shop.eyebrow}
        title={tr(category.name, lang)}
        text={tr(category.description, lang)}
        image={category.image}
        crumbs={[
          { label: d.shop.title, path: "/shop" },
          ...(parent ? [{ label: tr(parent.name, lang), path: `/product-category/${parent.slug}` }] : []),
          { label: tr(category.name, lang) },
        ]}
      />
      <Shop categorySlug={category.slug} copy={d.shop} />
    </>
  );
}
