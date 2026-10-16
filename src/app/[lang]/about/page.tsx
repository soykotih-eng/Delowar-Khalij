import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Building2, Calculator, ClipboardList, Eye, Factory, FileSearch,
  Newspaper, Package, Target, Users, Wallet, Wrench,
} from "lucide-react";
import { CountUp } from "@/components/home/CountUp";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const a = getDictionary(lang).about;
  return { title: a.title, description: a.intro.text };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const a = d.about;
  const whyIcons = [Users, ClipboardList, BadgeCheck, Calculator, Wallet, Newspaper];
  const offerIcons = [Package, Factory, FileSearch, Calculator, Wrench, Newspaper];
  const offerLinks = ["/shop", "/join", "/shop", "/project-cost", "/services", "/knowledge-center"];
  const stats = [
    [siteConfig.stats.factories, d.home.stats.factories],
    [siteConfig.stats.products, d.home.stats.products],
    [siteConfig.stats.stoneTypes, d.home.stats.types],
  ] as const;

  return (
    <>
      <PageHero lang={lang} eyebrow={a.intro.eyebrow} title={a.title} image="/images/scenes/quarry-aerial.webp" />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div>
          <SectionHeading align="start" eyebrow={a.intro.eyebrow} title={a.intro.title} />
          <p className="mt-6 text-lg leading-8 text-ink/70">{a.intro.text}</p>
          <h3 className="mt-10 text-xl font-extrabold">{a.who.title}</h3>
          <p className="mt-3 leading-8 text-muted">{a.who.text}</p>
        </div>
        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5]">
          <Image src="/images/scenes/living-luxury.webp" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/95 p-4 backdrop-blur sm:inset-x-6 sm:bottom-6">
            {stats.map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-gold sm:text-3xl">
                  <CountUp value={value} />
                </p>
                <p className="text-[11px] font-bold text-muted sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { ...a.vision, Icon: Eye },
            { ...a.mission, Icon: Target },
          ].map(({ title, text, Icon }) => (
            <div key={title} className="reveal rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-gold text-white">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">{title}</h2>
              <p className="mt-4 leading-8 text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 lg:py-28">
        <SectionHeading title={a.why.title} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {a.why.items.map((item, i) => {
            const Icon = whyIcons[i];
            return (
              <div key={item.title} className="reveal rounded-3xl bg-cream p-7">
                <Icon className="size-7 text-gold" />
                <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading title={a.offers.title} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.offers.items.map((item, i) => {
              const Icon = offerIcons[i];
              return (
                <Link
                  key={item.title}
                  href={href(lang, offerLinks[i])}
                  className="reveal group flex flex-col rounded-3xl border border-line p-7 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-ink text-white transition group-hover:bg-gold">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-gold-dark">
                    {item.link}
                    <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-x pb-20 lg:pb-28">
        <div className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12">
          <Image src="/images/scenes/stone-columns.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
          <Building2 className="mx-auto size-10 text-gold" />
          <h2 className="heading mt-4">{a.start.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">{a.start.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={href(lang, "/shop")} className="btn btn-gold">{a.start.shop}</Link>
            <Link href={href(lang, "/project-cost")} className="btn btn-light">{a.start.request}</Link>
            <Link href={href(lang, "/join")} className="btn btn-light">{a.start.join}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
