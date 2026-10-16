import type { Metadata } from "next";
import Image from "next/image";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const s = getDictionary(lang).showrooms;
  return { title: s.title, description: s.intro };
}

const images = ["/images/scenes/bathroom-gold.webp", "/images/scenes/quarry-underground.webp"];

export default async function ShowroomsPage({ params }: Props) {
  const { lang } = await params;
  const s = getDictionary(lang).showrooms;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`;

  return (
    <>
      <PageHero lang={lang} eyebrow={s.eyebrow} title={s.title} text={s.intro} image="/images/scenes/lobby-floor.webp" />
      <section className="container-x grid gap-8 py-16 lg:grid-cols-2 lg:py-24">
        {s.items.map((item, i) => (
          <article key={item.name} className="reveal overflow-hidden rounded-3xl border border-line">
            <div className="relative aspect-[16/10]">
              <Image src={images[i]} alt={item.name} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            </div>
            <div className="p-7 sm:p-9">
              <h2 className="text-2xl font-extrabold">{item.name}</h2>
              <p className="mt-2 text-muted">{item.text}</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="size-4 shrink-0 text-gold" /> {siteConfig.address[lang]}
                </li>
                <li className="flex gap-3">
                  <Clock className="size-4 shrink-0 text-gold" /> {siteConfig.hours[lang]}
                </li>
                <li className="flex gap-3">
                  <Phone className="size-4 shrink-0 text-gold" /> <span dir="ltr">{siteConfig.phone}</span>
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  <Navigation className="size-4" /> {s.directions}
                </a>
                <a href={whatsappUrl(`${s.bookMessage} (${item.name})`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <BrandIcon name="whatsapp" /> {s.book}
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
