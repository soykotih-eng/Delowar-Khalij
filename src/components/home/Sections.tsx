import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CircleCheck, Gem, Layers, Ruler, ShieldCheck, Truck, Wrench, Store } from "lucide-react";
import { Polaroid } from "@/components/aluminium/Shared";
import { PostCard } from "@/components/blog/PostCard";
import { getAluWork } from "@/data/aluminium";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory } from "@/data/categories";
import { posts } from "@/data/posts";
import { productsInCategory } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { fill, href, tr, type Dictionary, type Locale } from "@/lib/i18n";
import { cn, formatMoney, whatsappUrl } from "@/lib/utils";
import { CountUp } from "./CountUp";

type SectionProps = { lang: Locale; d: Dictionary };

export function Highlights({ lang, d }: SectionProps) {
  const icons = [Truck, Ruler, ShieldCheck, Wrench];
  const amount = formatMoney(siteConfig.freeShippingThreshold, "SAR", lang);
  return (
    <section className="border-b border-line bg-cream">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {d.home.highlights.map((h, i) => {
          const Icon = icons[i];
          return (
            <div key={h.title} className={cn("flex items-center gap-4 py-6 sm:py-8", i % 2 === 1 && "ps-4 sm:ps-8", i > 0 && "lg:border-s lg:border-line lg:ps-8")}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-gold shadow-sm">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold sm:text-base">{h.title}</p>
                <p className="text-xs text-muted sm:text-sm">{fill(h.text, { amount })}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AboutSection({ lang, d }: SectionProps) {
  const a = d.home.about;
  const stats = [
    [siteConfig.stats.factories, d.home.stats.factories],
    [siteConfig.stats.products, d.home.stats.products],
    [siteConfig.stats.stoneTypes, d.home.stats.types],
  ] as const;
  return (
    <section className="overflow-hidden bg-cream py-20 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="reveal relative pb-16 sm:pe-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src="/images/scenes/kitchen-island.webp" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div className="absolute end-0 bottom-0 aspect-square w-1/2 overflow-hidden rounded-3xl border-8 border-cream">
            <Image src="/images/scenes/quarry-aerial.webp" alt="" fill sizes="300px" className="object-cover" />
          </div>
          <div className="absolute start-6 top-6 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
            <span className="grid size-12 place-items-center rounded-full bg-gold text-white">
              <Gem className="size-5" />
            </span>
            <span className="text-sm font-extrabold">{a.badge}</span>
          </div>
        </div>

        <div className="reveal">
          <SectionHeading align="start" eyebrow={a.eyebrow} title={a.title} />
          <div className="mt-6 space-y-4 text-base leading-8 text-ink/70">
            <p>{a.p1}</p>
            <p>{a.p2}</p>
            <p>{a.p3}</p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-8">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-extrabold text-gold sm:text-4xl lg:text-5xl">
                  <CountUp value={value} />
                </dd>
                <p className="mt-2 text-xs font-bold text-muted sm:text-sm">{label}</p>
              </div>
            ))}
          </dl>
          <Link href={href(lang, "/about")} className="btn btn-dark mt-10 px-8">
            {a.cta}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhyUs({ d }: SectionProps) {
  const w = d.home.why;
  const icons = [Store, Layers, Ruler, Wrench, BadgeCheck];
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white lg:py-28">
      <Image src="/images/products/nero-marquina.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-15" />
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading align="start" light eyebrow={w.eyebrow} title={w.title} />
          <p className="max-w-md text-white/65">{w.text}</p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {w.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={item.title} className="reveal group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-gold/60 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-3xl font-extrabold text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CategoryTiles({ lang, d }: SectionProps) {
  const c = d.home.categories;
  const tiles = ["marble", "granite", "quartz", "limestone", "stone-products"].map((slug) => getCategory(slug)!);
  return (
    <section className="container-x py-20 lg:py-28">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} text={c.text} />
      <div className="mt-12 grid grid-cols-2 gap-4 lg:h-[620px] lg:grid-cols-4 lg:grid-rows-2">
        {tiles.map((cat, i) => (
          <Link
            key={cat.slug}
            href={href(lang, `/product-category/${cat.slug}`)}
            className={cn(
              "reveal group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl p-5 text-white sm:p-7",
              i === 0 ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-square lg:aspect-auto",
            )}
          >
            <Image src={cat.image} alt="" fill sizes={i === 0 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 50vw"} className="-z-10 object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" />
            <span className="absolute end-5 top-5 grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-gold">
              <ArrowUpRight className="size-5 rtl:-scale-x-100" />
            </span>
            <p className="text-xs font-bold text-white/70">{fill(c.count, { n: productsInCategory(cat.slug).length })}</p>
            <h3 className={cn("mt-1 font-extrabold tracking-tight", i === 0 ? "text-3xl sm:text-4xl" : "text-lg sm:text-2xl")}>{tr(cat.name, lang)}</h3>
            {i === 0 && <p className="mt-2 hidden max-w-md text-sm text-white/75 sm:block">{tr(cat.description, lang)}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Home-page highlight for the aluminium & glass division. */
export function AluminiumBand({ lang, d }: SectionProps) {
  const b = d.aluminium.band;
  const picks = ["black-glass-curtain-wall", "arched-entrance-door", "clear-shower-marble-bench"].map(getAluWork);
  const layout = [
    { rotate: -4, className: "mt-10" },
    { rotate: 3, className: "" },
    { rotate: -2, className: "mt-16 hidden sm:block" },
  ];
  return (
    <section className="blueprint overflow-hidden py-20 text-white lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="reveal">
          <p className="mono-label flex items-center gap-3 text-gold">
            <span className="h-px w-10 bg-current" />
            {b.label}
          </p>
          <h2 className="heading mt-5 text-white">{b.title}</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-white/70">{b.text}</p>
          <ul className="mt-7 space-y-3">
            {b.points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-semibold text-white/85">
                <CircleCheck className="size-5 shrink-0 text-gold" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={href(lang, "/aluminium")} className="btn btn-gold rounded-md px-7">
              {b.cta}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
            <a href={whatsappUrl(d.aluminium.form.message)} target="_blank" rel="noopener noreferrer" className="btn btn-light rounded-md px-7">
              {d.aluminium.requestQuote}
            </a>
          </div>
        </div>
        <Link href={href(lang, "/aluminium")} aria-label={b.cta} className="grid grid-cols-2 items-start gap-5 px-2 sm:grid-cols-3 sm:gap-4">
          {picks.map((work, i) => (
            <Polaroid
              key={work.slug}
              work={work}
              lang={lang}
              rotate={layout[i].rotate}
              sizes="(min-width: 640px) 200px, 45vw"
              className={cn(layout[i].className, "hover:z-10 hover:scale-105 hover:rotate-0")}
            />
          ))}
        </Link>
      </div>
    </section>
  );
}

export function Promos({ lang, d }: SectionProps) {
  const p = d.home.promo;
  const cards = [
    { ...p.kitchen, image: "/images/scenes/kitchen-white.webp", path: "/kitchen-calculator" },
    { ...p.project, image: "/images/scenes/lobby-floor.webp", path: "/project-cost" },
  ];
  return (
    <section className="container-x grid gap-5 py-20 lg:grid-cols-2 lg:py-28">
      {cards.map((card) => (
        <div key={card.path} className="reveal group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white sm:p-10">
          <Image src={card.image} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/50 to-ink/0" />
          <p className="eyebrow mb-3">{card.eyebrow}</p>
          <h3 className="max-w-md text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{card.title}</h3>
          <p className="mt-3 max-w-md text-white/75">{card.text}</p>
          <Link href={href(lang, card.path)} className="btn btn-gold mt-6 self-start">
            {card.cta}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      ))}
    </section>
  );
}

export function LatestArticles({ lang, d }: SectionProps) {
  const a = d.home.articles;
  return (
    <section className="border-t border-line bg-cream py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading align="start" eyebrow={a.eyebrow} title={a.title} />
          <Link href={href(lang, "/knowledge-center")} className="btn btn-outline self-start sm:self-auto">
            {a.viewAll}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} t={d.common} />
          ))}
        </div>
      </div>
    </section>
  );
}
