import type { Metadata } from "next";
import { CartView } from "@/components/shop/StoreViews";
import { PageTitle } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(lang).cart.title, robots: { index: false } };
}

export default async function CartPage({ params }: Props) {
  const { lang } = await params;
  const c = getDictionary(lang).cart;
  return (
    <>
      <PageTitle lang={lang} title={c.title} />
      <section className="container-x py-12 lg:py-16">
        <CartView copy={c} />
      </section>
    </>
  );
}
