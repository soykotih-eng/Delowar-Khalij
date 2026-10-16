import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleHelp, Factory, SearchCheck, UserRound } from "lucide-react";
import { SupplierForm } from "@/components/forms/MembershipForms";
import { PageHero } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const j = getDictionary(lang).join;
  return { title: j.title, description: j.intro };
}

export default async function JoinPage({ params }: Props) {
  const { lang } = await params;
  const j = getDictionary(lang).join;
  const cards = [
    { ...j.cards.supplier, Icon: Factory, link: "#register", cta: j.form.title, external: false },
    { ...j.cards.customer, Icon: UserRound, link: href(lang, "/account#register"), external: false },
    { ...j.cards.help, Icon: CircleHelp, link: whatsappUrl(j.helpMessage), external: true },
    { ...j.cards.status, Icon: SearchCheck, link: whatsappUrl(j.statusMessage), external: true },
  ];

  return (
    <>
      <PageHero lang={lang} eyebrow={j.eyebrow} title={j.title} text={j.intro} image="/images/scenes/quarry-underground.webp" />

      <section className="container-x grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, text, cta, Icon, link, external }) => (
          <Link
            key={title}
            href={link}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="reveal group flex flex-col rounded-3xl border border-line p-6 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-cream text-gold transition group-hover:bg-gold group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-gold-dark">
              {cta ?? title}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </span>
          </Link>
        ))}
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="heading">{j.benefits.title}</h2>
            <ul className="mt-8 space-y-4">
              {j.benefits.items.map((b) => (
                <li key={b} className="flex gap-3 text-lg font-semibold">
                  <CircleCheck className="mt-1 size-5 shrink-0 text-gold" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <SupplierForm copy={j.form} />
        </div>
      </section>
    </>
  );
}
