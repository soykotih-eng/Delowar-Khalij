import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const c = getDictionary(lang).contact;
  return { title: c.title, description: c.intro };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const c = getDictionary(lang).contact;
  const info = [
    { Icon: MapPin, label: c.info.address, value: siteConfig.address[lang] },
    { Icon: Phone, label: c.info.phone, value: siteConfig.phone, link: whatsappUrl(), ltr: true },
    { Icon: Mail, label: c.info.email, value: siteConfig.email, link: `mailto:${siteConfig.email}` },
    { Icon: Clock, label: c.info.hours, value: siteConfig.hours[lang] },
  ];

  return (
    <>
      <PageHero lang={lang} eyebrow={c.eyebrow} title={c.title} text={c.intro} image="/images/scenes/living-room.webp" />

      <section className="container-x -mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {info.map(({ Icon, label, value, link, ltr }) => (
          <div key={label} className="relative rounded-2xl border border-line bg-white p-6 shadow-sm">
            <span className="grid size-12 place-items-center rounded-full bg-gold text-white">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-xs font-bold text-muted uppercase">{label}</p>
            {link ? (
              <a href={link} className="mt-1 block font-extrabold break-words hover:text-gold" dir={ltr ? "ltr" : undefined}>
                {value}
              </a>
            ) : (
              <p className="mt-1 font-extrabold">{value}</p>
            )}
          </div>
        ))}
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="heading">{c.form.title}</h2>
          <div className="mt-8">
            <ContactForm copy={c} />
          </div>
        </div>
        <div className="min-h-[380px] overflow-hidden rounded-3xl border border-line">
          <iframe
            title={c.map}
            src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full min-h-[380px] grayscale-[40%]"
          />
        </div>
      </section>
    </>
  );
}
