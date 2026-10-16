import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Dictionary, Locale } from "@/lib/i18n";

const slugs = ["privacy-policy", "terms-of-use", "return-policy"] as const;
type Slug = (typeof slugs)[number];
type Props = { params: Promise<{ lang: Locale; slug: string }> };

const isSlug = (s: string): s is Slug => (slugs as readonly string[]).includes(s);
const getPolicy = (d: Dictionary, slug: Slug) => d.policies[slug];

export const dynamicParams = false;
export const generateStaticParams = () => slugs.map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSlug(slug)) return {};
  const p = getPolicy(getDictionary(lang), slug);
  return { title: p.title, description: p.intro };
}

export default async function PolicyPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isSlug(slug)) notFound();
  const d = getDictionary(lang);
  const p = getPolicy(d, slug);

  return (
    <>
      <PageHero lang={lang} title={p.title} text={p.intro} image="/images/products/carrara-white.webp" />
      <section className="container-x max-w-3xl py-16 lg:py-20">
        <p className="text-sm font-semibold text-muted">{d.policies.updated}</p>
        <div className="prose-stone mt-6">
          {p.sections.map((s, i) => (
            <section key={s.h}>
              <h2>
                {i + 1}. {s.h}
              </h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
