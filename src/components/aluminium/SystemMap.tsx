"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { aluHotspots, aluImage, getSeedWork } from "@/data/aluminium";
import { tr, type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Polaroid } from "./Shared";

/** Clickable hotspots on a house photo, each linked to one of our real installations. */
export function SystemMap({ copy }: { copy: Dictionary["aluminium"]["systemMap"] }) {
  const { lang } = useI18n();
  const [active, setActive] = useState(0);
  const spot = aluHotspots[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="frame-corners relative mx-auto w-full max-w-[480px] overflow-hidden bg-navy shadow-2xl" style={{ aspectRatio: "868 / 1280" }}>
        <Image src={aluImage("modern-glass-villa")} alt={copy.title} fill sizes="480px" className="object-cover" />
        <div className="absolute inset-0 bg-navy/15" />
        {aluHotspots.map((h, i) => (
          <button
            key={h.title.en}
            type="button"
            onClick={() => setActive(i)}
            aria-label={tr(h.title, lang)}
            aria-pressed={active === i}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span className="relative grid size-9 place-items-center">
              <span className="absolute inset-1 animate-ping rounded-full bg-gold/60" />
              <span className={cn("relative size-4 rounded-full border-2 border-white shadow transition", active === i ? "scale-125 bg-gold" : "bg-navy-3 group-hover:bg-gold")} />
            </span>
            <span
              className={cn(
                "absolute hidden rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-white shadow-lg sm:block",
                h.labelAbove ? "bottom-full mb-0.5" : "top-full mt-0.5",
                active === i ? "bg-gold" : "bg-navy/90",
                h.x > 75 ? "right-0" : h.x < 25 ? "left-0" : "left-1/2 -translate-x-1/2",
              )}
            >
              {tr(h.title, lang)}
            </span>
          </button>
        ))}
        <span className="mono-label absolute start-4 bottom-4 z-10 text-[10px] text-white/80">{copy.hint}</span>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {aluHotspots.map((h, i) => (
            <button
              key={h.title.en}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-[11px] font-medium transition",
                active === i ? "border-navy bg-navy text-white" : "border-navy/15 text-navy/60 hover:border-navy/40",
              )}
            >
              0{i + 1} · {tr(h.title, lang)}
            </button>
          ))}
        </div>
        <div key={active} className="mt-8 grid animate-fade-in items-center gap-8 sm:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="mono-label text-gold-dark" dir="ltr">
              0{active + 1} / 0{aluHotspots.length}
            </p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">{tr(spot.title, lang)}</h3>
            <p className="mt-4 leading-7 text-navy/65">{tr(spot.text, lang)}</p>
          </div>
          <div className="px-4 sm:px-0">
            <Polaroid work={getSeedWork(spot.work)} lang={lang} rotate={2} sizes="300px" badge={copy.realWork} />
          </div>
        </div>
      </div>
    </div>
  );
}
