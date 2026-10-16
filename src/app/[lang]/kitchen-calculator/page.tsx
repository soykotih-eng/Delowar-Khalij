import type { Metadata } from "next";
import { KitchenCalculator } from "@/components/tools/KitchenCalculator";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const k = getDictionary(lang).kitchen;
  return { title: k.title, description: k.intro };
}

export default async function KitchenCalculatorPage({ params }: Props) {
  const { lang } = await params;
  const k = getDictionary(lang).kitchen;
  return (
    <>
      <PageHero lang={lang} eyebrow={k.eyebrow} title={k.title} text={k.intro} image="/images/scenes/kitchen-island.webp" />
      <section className="bg-cream/60 py-12 lg:py-16">
        <div className="container-x">
          <KitchenCalculator copy={k} />
        </div>
      </section>
    </>
  );
}
