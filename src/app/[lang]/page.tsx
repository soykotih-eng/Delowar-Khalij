import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutSection, AluminiumBand, CategoryTiles, Highlights, LatestArticles, Promos, WhyUs } from "@/components/home/Sections";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const d = getDictionary(lang);

  return (
    <>
      <HeroSlider lang={lang} copy={d.home.hero} />
      <Highlights lang={lang} d={d} />
      <FeaturedProducts copy={d.home.products} />
      <AboutSection lang={lang} d={d} />
      <WhyUs lang={lang} d={d} />
      <CategoryTiles lang={lang} d={d} />
      <AluminiumBand lang={lang} d={d} />
      <Promos lang={lang} d={d} />
      <LatestArticles lang={lang} d={d} />
    </>
  );
}
