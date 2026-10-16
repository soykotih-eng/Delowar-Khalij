import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Handshake, Phone } from "lucide-react";
import { ServicesGrid } from "@/components/forms/ServiceRequest";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { telUrl, whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const s = getDictionary(lang).services;
  return { title: s.title, description: s.intro };
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const s = d.services;

  return (
    <>
      <PageHero lang={lang} eyebrow={s.eyebrow} title={s.title} text={s.intro} image="/images/scenes/quarry-terraces.webp" />

      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <SectionHeading align="start" eyebrow={s.eyebrow} title={s.stepsTitle} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {s.highlights.map((h, i) => {
                const Icon = i === 0 ? Handshake : BadgeCheck;
                return (
                  <div key={h.title} className="rounded-2xl bg-cream p-5">
                    <Icon className="size-6 text-gold" />
                    <p className="mt-3 font-extrabold">{h.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{h.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {s.steps.map((step, i) => (
              <li key={step.title} className="reveal relative rounded-3xl border border-line p-6">
                <span className="grid size-12 place-items-center rounded-full bg-ink text-lg font-extrabold text-white">{i + 1}</span>
                <p className="mt-5 text-lg font-extrabold">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="container-x">
          <ServicesGrid copy={s} />
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <h2 className="heading">{d.footer.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{d.footer.ctaText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappUrl(d.common.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            <BrandIcon name="whatsapp" /> {d.common.chatWhatsApp}
          </a>
          <a href={telUrl()} className="btn btn-outline">
            <Phone className="size-4" /> <span dir="ltr">{siteConfig.phone}</span>
          </a>
          <Link href={href(lang, "/contact")} className="btn btn-outline">
            {d.common.nav.contact}
          </Link>
        </div>
      </section>
    </>
  );
}
