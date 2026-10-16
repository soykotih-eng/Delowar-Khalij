import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";

type Crumb = { label: string; path?: string };

export function Breadcrumbs({ lang, items, light = false }: { lang: Locale; items: Crumb[]; light?: boolean }) {
  const home = getDictionary(lang).common.nav.home;
  const all: Crumb[] = [{ label: home, path: "" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={light ? "text-white/70" : "text-muted"}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60 rtl:rotate-180" />}
            {c.path !== undefined && i < all.length - 1 ? (
              <Link href={href(lang, c.path)} className={light ? "hover:text-white" : "hover:text-gold"}>
                {c.label}
              </Link>
            ) : (
              <span className={light ? "font-semibold text-white" : "font-semibold text-ink"}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Compact title bar for utility pages (cart, wishlist, account…). */
export function PageTitle({ lang, title }: { lang: Locale; title: string }) {
  return (
    <section className="border-b border-line bg-cream">
      <div className="container-x py-10 sm:py-14">
        <Breadcrumbs lang={lang} items={[{ label: title }]} />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      </div>
    </section>
  );
}

export function PageHero({
  lang,
  title,
  eyebrow,
  text,
  image,
  crumbs,
}: {
  lang: Locale;
  title: string;
  eyebrow?: string;
  text?: string;
  image: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/40 to-transparent" />
      <div className="container-x py-16 text-white sm:py-24">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>}
        <div className="mt-8">
          <Breadcrumbs lang={lang} items={crumbs ?? [{ label: title }]} light />
        </div>
      </div>
    </section>
  );
}
