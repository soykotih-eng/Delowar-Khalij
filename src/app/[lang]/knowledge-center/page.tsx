import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { PageHero } from "@/components/ui/PageHero";
import { posts } from "@/data/posts";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const k = getDictionary(lang).knowledge;
  return { title: k.title, description: k.intro };
}

export default async function KnowledgeCenterPage({ params }: Props) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const [first, ...rest] = posts;

  return (
    <>
      <PageHero lang={lang} eyebrow={d.knowledge.eyebrow} title={d.knowledge.title} text={d.knowledge.intro} image="/images/scenes/stone-columns.webp" />
      <section className="container-x py-16 lg:py-24">
        <PostCard post={first} lang={lang} t={d.common} large />
        <h2 className="mt-20 mb-10 text-2xl font-extrabold">{d.knowledge.latest}</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} t={d.common} />
          ))}
        </div>
      </section>
    </>
  );
}
