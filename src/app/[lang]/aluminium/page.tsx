import type { Metadata } from "next";
import { AluHero } from "@/components/aluminium/AluHero";
import { AluQuoteProvider } from "@/components/aluminium/AluQuote";
import { Capabilities } from "@/components/aluminium/Capabilities";
import { ReferenceWall } from "@/components/aluminium/ReferenceWall";
import { AluCta, DesignBuild, FeaturedProjects } from "@/components/aluminium/Sections";
import { AluHeading } from "@/components/aluminium/Shared";
import { SystemMap } from "@/components/aluminium/SystemMap";
import { aluServices } from "@/data/aluminium";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const m = getDictionary(lang).aluminium.meta;
  return { title: m.title, description: m.description, openGraph: { images: ["/images/aluminium/palace-facade-glazing.webp"] } };
}

export default async function AluminiumPage({ params }: Props) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const a = d.aluminium;
  const { projects, years } = siteConfig.aluminiumStats;
  const values = [`${projects}+`, `${years}+`, `${aluServices.length}`, "100%"];
  const stats = a.stats.map((s, i) => ({ ...s, value: values[i] }));

  return (
    <AluQuoteProvider copy={a.form}>
      <AluHero copy={a} stats={stats} />

      <section id="capabilities" className="blueprint-light scroll-mt-32 py-20 lg:py-28">
        <div className="container-x">
          <AluHeading n="01" label={a.capabilities.label} title={a.capabilities.title} text={a.capabilities.text} />
          <div className="mt-12">
            <Capabilities copy={a.capabilities} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <AluHeading n="02" label={a.systemMap.label} title={a.systemMap.title} text={a.systemMap.text} />
          <div className="mt-12">
            <SystemMap copy={a.systemMap} />
          </div>
        </div>
      </section>

      <FeaturedProjects lang={lang} d={d} />
      <DesignBuild lang={lang} d={d} />

      <section id="works" className="blueprint scroll-mt-32 py-20 lg:py-28">
        <div className="container-x">
          <AluHeading n="05" label={a.wall.label} title={a.wall.title} text={a.wall.text} light className="mb-10" />
          <ReferenceWall copy={a.wall} />
        </div>
      </section>

      <AluCta lang={lang} d={d} />
    </AluQuoteProvider>
  );
}
