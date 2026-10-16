import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { getPost, posts } from "@/data/posts";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { fill, href, tr, type Locale } from "@/lib/i18n";
import { formatDate, whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: tr(post.title, lang),
    description: tr(post.excerpt, lang),
    openGraph: { type: "article", images: [post.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const d = getDictionary(lang);
  const title = tr(post.title, lang);
  const url = encodeURIComponent(`${siteConfig.url}/${lang}/knowledge-center/${post.slug}`);
  const shares = [
    { name: "facebook" as const, link: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: "x" as const, link: `https://x.com/intent/post?url=${url}&text=${encodeURIComponent(title)}` },
    { name: "linkedin" as const, link: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { name: "whatsapp" as const, link: `https://wa.me/?text=${encodeURIComponent(title)}%20${url}` },
  ];

  return (
    <>
      <article>
        <header className="container-x max-w-4xl pt-10 pb-10 lg:pt-14">
          <Breadcrumbs lang={lang} items={[{ label: d.knowledge.title, path: "/knowledge-center" }, { label: title }]} />
          <p className="eyebrow mt-10">{tr(post.topic, lang)}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="font-semibold text-ink">{d.knowledge.by}</span>
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <span className="flex items-center gap-1">
              <Clock className="size-4" /> {fill(d.common.minRead, { n: post.readMinutes })}
            </span>
          </div>
        </header>

        <div className="container-x max-w-6xl">
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl">
            <Image src={post.image} alt={title} fill priority sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="container-x grid max-w-4xl gap-10 py-14 lg:grid-cols-[1fr_auto]">
          <div className="prose-stone">
            <p className="text-lg font-semibold leading-8 text-ink">{tr(post.excerpt, lang)}</p>
            {post.sections.map((s) => (
              <section key={s.heading.en}>
                <h2>{tr(s.heading, lang)}</h2>
                <p>{tr(s.body, lang)}</p>
              </section>
            ))}
          </div>
          <aside className="flex gap-2 lg:sticky lg:top-36 lg:flex-col lg:self-start">
            <span className="me-2 text-xs font-bold text-muted lg:me-0 lg:mb-1">{d.common.share}</span>
            {shares.map((s) => (
              <a key={s.name} href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="grid size-10 place-items-center rounded-full border border-line text-ink/70 hover:border-gold hover:bg-gold hover:text-white">
                <BrandIcon name={s.name} />
              </a>
            ))}
          </aside>
        </div>

        <div className="container-x max-w-4xl pb-16">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-cream p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold">{d.knowledge.ctaTitle}</h2>
              <p className="mt-1 text-sm text-muted">{d.knowledge.ctaText}</p>
            </div>
            <a href={whatsappUrl(d.common.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn btn-gold shrink-0">
              <BrandIcon name="whatsapp" /> {d.footer.ctaButton}
            </a>
          </div>
          <Link href={href(lang, "/knowledge-center")} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-gold-dark hover:text-ink">
            <ArrowLeft className="size-4 rtl:rotate-180" /> {d.knowledge.backToAll}
          </Link>
        </div>
      </article>

      <section className="border-t border-line bg-cream py-16 lg:py-20">
        <div className="container-x">
          <h2 className="mb-10 text-2xl font-extrabold">{d.knowledge.related}</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((p) => (
                <PostCard key={p.slug} post={p} lang={lang} t={d.common} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
