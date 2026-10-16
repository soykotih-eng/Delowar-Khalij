import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BrandIcon, type Brand } from "@/components/ui/SocialIcons";
import { getCategory } from "@/data/categories";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { telUrl, whatsappUrl } from "@/lib/utils";

export function Footer({ lang }: { lang: Locale }) {
  const { footer: f, common } = getDictionary(lang);
  const nav = common.nav;

  const columns = [
    {
      title: f.usefulLinks,
      links: [
        [nav.about, "/about"],
        [nav.contact, "/contact"],
        [nav.showrooms, "/showrooms"],
        [nav.knowledge, "/knowledge-center"],
        [nav.join, "/join"],
      ],
    },
    {
      title: f.quickLinks,
      links: [
        [nav.allProducts, "/shop"],
        [nav.aluminium, "/aluminium"],
        ...["marble", "granite", "quartz"].map((slug) => [getCategory(slug)!.name[lang], `/product-category/${slug}`]),
        [nav.kitchenCalculator, "/kitchen-calculator"],
        [nav.projectCost, "/project-cost"],
      ],
    },
    {
      title: f.importantLinks,
      links: [
        [nav.services, "/services"],
        [f.privacy, "/policies/privacy-policy"],
        [f.terms, "/policies/terms-of-use"],
        [f.returns, "/policies/return-policy"],
        [nav.faq, "/faq"],
      ],
    },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="container-x pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gold px-6 py-10 sm:px-12">
          <div className="absolute inset-0 bg-[url(/images/products/carrara-white.webp)] bg-cover bg-center opacity-15 mix-blend-multiply" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{f.ctaTitle}</h2>
              <p className="mt-2 text-white/85">{f.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl(common.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn bg-white text-ink hover:bg-ink hover:text-white">
                <BrandIcon name="whatsapp" /> {f.ctaButton}
              </a>
              <a href={telUrl()} className="btn btn-light">
                <Phone className="size-4" /> <span dir="ltr">{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Logo light className="h-14" />
          <p className="mt-5 text-sm leading-7 text-white/60">{f.about}</p>
          <div className="mt-6 flex gap-2">
            {(Object.entries(siteConfig.socials) as [Brand, string][]).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="grid size-10 place-items-center rounded-full bg-white/5 text-white/70 transition hover:bg-gold hover:text-white"
              >
                <BrandIcon name={name} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-extrabold tracking-wide text-gold uppercase">{col.title}</h3>
            <ul className="space-y-3 text-sm text-white/65">
              {col.links.map(([label, path]) => (
                <li key={path}>
                  <Link href={href(lang, path)} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-3">
          <h3 className="mb-5 text-sm font-extrabold tracking-wide text-gold uppercase">{f.contactUs}</h3>
          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-gold" />
              {siteConfig.address[lang]}
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0 text-gold" />
              <a href={whatsappUrl()} className="hover:text-white" dir="ltr">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0 text-gold" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="size-4 shrink-0 text-gold" />
              {siteConfig.hours[lang]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 lg:flex-row">
          <p className="text-center lg:text-start">
            © {new Date().getFullYear()} {lang === "ar" ? siteConfig.nameAr : siteConfig.name} — {f.rights}
            {siteConfig.commercialRegistration && ` · ${f.cr}: ${siteConfig.commercialRegistration}`}
            {siteConfig.vatNumber && ` · ${f.vat}: ${siteConfig.vatNumber}`}
          </p>
          <p className="font-semibold text-white/70">{f.tagline}</p>
          <div className="flex items-center gap-2" aria-label={f.payments}>
            {["VISA", "Mastercard", "mada", "Apple Pay"].map((p) => (
              <span key={p} className="rounded-md border border-white/15 px-2 py-1 text-[10px] font-bold tracking-wide text-white/70" dir="ltr">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
