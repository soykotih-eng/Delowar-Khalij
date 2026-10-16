import type { Metadata } from "next";
import { ProjectEstimator } from "@/components/tools/ProjectEstimator";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const e = getDictionary(lang).estimate;
  return { title: e.title, description: e.intro };
}

export default async function ProjectCostPage({ params }: Props) {
  const { lang } = await params;
  const e = getDictionary(lang).estimate;
  return (
    <>
      <PageHero lang={lang} eyebrow={e.eyebrow} title={e.title} text={e.intro} image="/images/scenes/hero-lobby.webp" />
      <section className="bg-cream/60 py-12 lg:py-16">
        <div className="container-x">
          <ProjectEstimator copy={e} />
        </div>
      </section>
    </>
  );
}
