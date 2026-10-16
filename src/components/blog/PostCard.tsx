import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/data/posts";
import { fill, href, tr, type CommonDict, type Locale } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";

export function PostCard({ post, lang, t, large = false }: { post: Post; lang: Locale; t: CommonDict; large?: boolean }) {
  const url = href(lang, `/knowledge-center/${post.slug}`);
  return (
    <article className={cn("group flex flex-col", large && "lg:flex-row lg:items-center lg:gap-10")}>
      <Link href={url} className={cn("relative block overflow-hidden rounded-2xl bg-sand", large ? "aspect-[16/10] lg:w-3/5" : "aspect-[16/11]")}>
        <Image
          src={post.image}
          alt={tr(post.title, lang)}
          fill
          sizes={large ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink">{tr(post.topic, lang)}</span>
      </Link>
      <div className={cn("pt-5", large && "lg:flex-1 lg:pt-0")}>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted">
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span className="size-1 rounded-full bg-gold" />
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {fill(t.minRead, { n: post.readMinutes })}
          </span>
        </div>
        <h3 className={cn("mt-3 font-extrabold tracking-tight text-balance", large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl")}>
          <Link href={url} className="hover:text-gold">
            {tr(post.title, lang)}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{tr(post.excerpt, lang)}</p>
        <Link href={url} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-dark hover:text-ink">
          {t.readMore}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}
