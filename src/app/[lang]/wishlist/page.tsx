import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/StoreViews";
import { PageTitle } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(lang).wishlist.title, robots: { index: false } };
}

export default async function WishlistPage({ params }: Props) {
  const { lang } = await params;
  const w = getDictionary(lang).wishlist;
  return (
    <>
      <PageTitle lang={lang} title={w.title} />
      <section className="container-x py-12 lg:py-16">
        <WishlistView copy={w} />
      </section>
    </>
  );
}
