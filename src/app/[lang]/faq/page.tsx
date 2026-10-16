import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const f = getDictionary(lang).faq;
  return { title: f.title, description: f.intro };
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const f = getDictionary(lang).faq;

  return (
    <>
      <PageHero lang={lang} eyebrow={f.eyebrow} title={f.title} text={f.intro} image="/images/scenes/bathroom-white.webp" />
      <section className="container-x grid max-w-6xl gap-12 py-16 lg:grid-cols-[1fr_320px] lg:py-24">
        <div className="space-y-3">
          {f.items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group rounded-2xl border border-line bg-white open:border-gold/40 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-extrabold sm:p-6 sm:text-lg">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream transition group-open:rotate-45 group-open:bg-gold group-open:text-white">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="px-5 pb-6 leading-8 text-muted sm:px-6">{item.a}</p>
            </details>
          ))}
        </div>
        <aside className="h-fit rounded-3xl bg-ink p-8 text-white lg:sticky lg:top-36">
          <h2 className="text-2xl font-extrabold">{f.more.title}</h2>
          <p className="mt-3 text-white/65">{f.more.text}</p>
          <Link href={href(lang, "/contact")} className="btn btn-gold mt-6">
            {f.more.cta}
          </Link>
        </aside>
      </section>
    </>
  );
}
