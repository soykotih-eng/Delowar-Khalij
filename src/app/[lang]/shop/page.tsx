import type { Metadata } from "next";
import { Shop } from "@/components/shop/Shop";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(lang).shop.title };
}

export default async function ShopPage({ params }: Props) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <>
      <PageHero lang={lang} eyebrow={d.shop.eyebrow} title={d.shop.title} image="/images/scenes/lobby-floor.webp" />
      <Shop copy={d.shop} />
    </>
  );
}
