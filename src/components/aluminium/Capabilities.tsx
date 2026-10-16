"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { aluImage, aluServices, type AluService } from "@/data/aluminium";
import { tr, type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { QuoteButton } from "./AluQuote";

type Copy = Dictionary["aluminium"]["capabilities"];

function Detail({ s, lang, copy }: { s: AluService; lang: Locale; copy: Copy }) {
  return (
    <div className="grid animate-fade-in gap-8 md:grid-cols-[1fr_0.85fr]">
      <div>
        <p className="mono-label text-[10px] text-gold-dark">{tr(s.tag, lang)}</p>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{tr(s.title, lang)}</h3>
        <p className="mt-4 leading-7 text-navy/65">{tr(s.text, lang)}</p>
        <ul className="mt-6 space-y-3">
          {s.points.map((p) => (
            <li key={p.en} className="flex gap-3 text-sm font-semibold text-navy/80">
              <span className="mt-1.5 size-2 shrink-0 bg-gold" />
              {tr(p, lang)}
            </li>
          ))}
        </ul>
        <QuoteButton label={copy.cta} service={s.key} className="btn btn-dark mt-8 rounded-md bg-navy" />
      </div>
      <div className="frame-corners relative aspect-[4/5] overflow-hidden bg-navy">
        <Image src={aluImage(s.image)} alt={tr(s.title, lang)} fill sizes="(min-width: 1024px) 340px, (min-width: 768px) 40vw, 100vw" className="object-cover" />
        <span className="mono-label absolute start-4 bottom-4 z-10 text-[10px] text-white/85">{tr(s.tag, lang).split(" · ")[0]}</span>
      </div>
    </div>
  );
}

export function Capabilities({ copy }: { copy: Copy }) {
  const { lang } = useI18n();
  const [active, setActive] = useState(0);

  return (
    <div className="grid overflow-hidden border border-navy/10 bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
      <div role="tablist" className="divide-y divide-navy/10 lg:border-e lg:border-navy/10">
        {aluServices.map((s, i) => (
          <div key={s.key}>
            <button
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={cn("relative flex w-full items-center gap-4 px-5 py-5 text-start transition sm:px-7", active === i ? "bg-steel" : "hover:bg-steel/60")}
            >
              {active === i && <span className="absolute inset-y-0 start-0 w-[3px] bg-gold" />}
              <span className="font-mono text-xs text-navy/40">0{i + 1}</span>
              <span className="flex-1">
                <span className="mono-label block text-[10px] text-navy/45">{tr(s.tag, lang)}</span>
                <span className="mt-1 block text-base font-extrabold text-navy sm:text-lg">{tr(s.title, lang)}</span>
              </span>
              <ArrowRight className={cn("size-4 shrink-0 text-gold transition rtl:rotate-180", active === i ? "opacity-100" : "opacity-0")} />
            </button>
            {/* On small screens the details open right under the selected tab. */}
            {active === i && (
              <div className="border-t border-navy/10 p-5 sm:p-7 lg:hidden">
                <Detail s={s} lang={lang} copy={copy} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="hidden p-10 lg:block">
        <Detail key={active} s={aluServices[active]} lang={lang} copy={copy} />
      </div>
    </div>
  );
}
