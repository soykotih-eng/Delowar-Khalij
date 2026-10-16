import Image from "next/image";
import { ArrowUpRight, CircleCheck, Phone } from "lucide-react";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { aluCategories, aluFeatured, aluImage, aluServices, aluWorks, getAluWork } from "@/data/aluminium";
import { siteConfig } from "@/lib/config";
import { tr, type Dictionary, type Locale } from "@/lib/i18n";
import { telUrl, whatsappUrl } from "@/lib/utils";
import { QuoteButton } from "./AluQuote";
import { AluHeading } from "./Shared";

type Props = { lang: Locale; d: Dictionary };

export function FeaturedProjects({ lang, d }: Props) {
  const a = d.aluminium.projects;
  const main = getAluWork(aluFeatured.main);
  const side = aluFeatured.side.map(getAluWork);
  // Ticker of the systems we install (unique, from the works list).
  const systems = [...new Set([...aluServices.map((s) => tr(s.title, lang)), ...aluWorks.map((w) => tr(w.system, lang).split(" · ")[0])])];

  return (
    <section className="blueprint overflow-hidden py-20 text-white lg:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <AluHeading n="03" label={a.label} title={a.title} text={a.text} light />
          <a href="#works" className="mono-label inline-flex items-center gap-2 self-start border-b border-white/40 pb-1 text-white hover:text-gold lg:self-auto">
            {a.viewAll} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <a href="#works" className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden border border-white/10 p-6 sm:p-9 lg:min-h-[560px]">
            <Image src={aluImage(main.slug)} alt={tr(main.title, lang)} fill sizes="(min-width: 1024px) 760px, 100vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy via-navy/40 to-transparent" />
            <span className="mono-label absolute start-6 top-6 rounded-md bg-gold px-3 py-1.5 text-[10px] text-white sm:start-9 sm:top-9">{tr(aluCategories[main.category], lang)}</span>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{tr(main.title, lang)}</h3>
            <p className="mono-label mt-3 text-[10px] text-gold">◆ {tr(main.system, lang)}</p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">{a.mainText}</p>
          </a>
          <div className="grid gap-5">
            {side.map((w) => (
              <a key={w.slug} href="#works" className="group relative isolate flex min-h-[170px] flex-col justify-end overflow-hidden border border-white/10 p-5">
                <Image src={aluImage(w.slug)} alt={tr(w.title, lang)} fill sizes="(min-width: 1024px) 460px, 100vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-navy via-navy/60 to-navy/5" />
                <span className="mono-label absolute start-5 top-5 rounded-md bg-navy-3/90 px-2.5 py-1 text-[9px] text-white">{tr(aluCategories[w.category], lang)}</span>
                <h3 className="text-xl font-extrabold">{tr(w.title, lang)}</h3>
                <p className="mono-label mt-1.5 text-[9.5px] text-gold">◆ {tr(w.system, lang)}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 border-y border-white/10 py-5" dir="ltr">
        <div className="marquee-track flex w-max gap-10">
          {[...systems, ...systems].map((s, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-white/55">
              <span className="text-gold">◆</span>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DesignBuild({ d }: Props) {
  const b = d.aluminium.build;
  return (
    <section className="blueprint-light py-20 lg:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative pb-14 sm:pe-14">
            <div className="frame-corners relative aspect-[4/5] overflow-hidden bg-navy shadow-2xl">
              <Image src={aluImage("facade-installation")} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </div>
            <div className="frame-corners absolute end-0 bottom-0 aspect-[960/830] w-[55%] overflow-hidden border-8 border-steel bg-navy shadow-2xl">
              <Image src={aluImage("modern-villa-windows")} alt="" fill sizes="300px" className="object-cover" />
            </div>
          </div>
          <div>
            <AluHeading n="04" label={b.label} title={b.title} text={b.text} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {b.points.map((p) => (
                <li key={p} className="flex gap-3 rounded-md border border-navy/10 bg-white p-4 text-sm font-bold text-navy">
                  <CircleCheck className="size-5 shrink-0 text-gold" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="mono-label mt-20 flex items-center gap-3 text-gold-dark">
          <span className="h-px w-10 bg-current" />
          {b.stepsTitle}
        </h3>
        <ol className="mt-6 grid border border-navy/10 bg-white sm:grid-cols-2 lg:grid-cols-5">
          {b.steps.map((step, i) => (
            <li key={step.title} className="relative border-navy/10 p-6 max-lg:border-b sm:max-lg:odd:border-e lg:border-e lg:last:border-e-0">
              <span className="font-mono text-3xl font-medium text-navy/15">0{i + 1}</span>
              <p className="mt-4 font-extrabold text-navy">{step.title}</p>
              <p className="mt-2 text-sm leading-6 text-navy/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AluCta({ d }: Props) {
  const c = d.aluminium.cta;
  return (
    <section className="blueprint-light py-20 lg:py-28">
      <div className="container-x">
        <div className="relative isolate overflow-hidden bg-navy px-6 py-16 text-center text-white sm:px-12">
          <div className="grid-lines absolute inset-0 -z-10" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
          <p className="mono-label flex items-center justify-center gap-3 text-gold">
            <span className="h-px w-10 bg-current" />
            {c.label}
            <span className="h-px w-10 bg-current" />
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">{c.text}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <QuoteButton label={d.aluminium.requestQuote} className="btn btn-gold rounded-md px-7" />
            <a href={whatsappUrl(d.common.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn rounded-md bg-[#25d366] px-6 text-white">
              <BrandIcon name="whatsapp" /> WhatsApp
            </a>
            <a href={telUrl()} className="btn btn-light rounded-md px-6">
              <Phone className="size-4" /> <span dir="ltr">{siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
