"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { aluImage } from "@/data/aluminium";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { QuoteButton } from "./AluQuote";

const SLIDE_MS = 7000;
const slides = ["palace-facade-glazing", "curved-bay-glazing", "pool-house-glass-front"];

type Copy = Dictionary["aluminium"];
type Stat = { value: string; unit: string; label: string };

export function AluHero({ copy, stats }: { copy: Copy; stats: Stat[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index]);
  const text = copy.hero[index];

  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {slides.map((slug, i) => (
        <div key={slug} aria-hidden={i !== index} className={cn("absolute inset-0 -z-20 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")}>
          <Image src={aluImage(slug)} alt="" fill priority={i === 0} sizes="100vw" className={cn("object-cover", i === index && "animate-kenburns")} />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy via-navy/85 to-navy/25 rtl:bg-linear-to-l" />
      <div className="grid-lines absolute inset-0 -z-10" />

      <div className="container-x flex min-h-[600px] flex-col justify-center py-20 lg:h-[74svh] lg:max-h-[760px]">
        <div key={index} className="max-w-3xl animate-slide-up">
          <p className="mono-label flex items-center gap-3 text-gold">
            <span className="h-px w-10 bg-current" />
            {text.eyebrow}
          </p>
          <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl rtl:leading-[1.3]">
            {text.title}
            <span className="block text-gold">{text.accent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{text.text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#works" className="btn btn-gold rounded-md px-7 py-3.5">
              {copy.viewWork}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </a>
            <QuoteButton label={copy.requestQuote} className="btn btn-light rounded-md px-7 py-3.5" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex items-center justify-between py-4 font-mono text-xs text-white/45">
          <div className="flex items-center gap-4">
            {slides.map((slug, i) => (
              <button key={slug} type="button" onClick={() => setIndex(i)} className="flex items-center gap-2" aria-label={`${i + 1}`}>
                <span className={i === index ? "text-white" : ""}>0{i + 1}</span>
                <span className="relative h-px w-8 overflow-hidden bg-white/20 sm:w-14">
                  {i === index && <span key={index} className="absolute inset-y-0 start-0 bg-gold [animation:grow_7s_linear_forwards]" />}
                </span>
              </button>
            ))}
          </div>
          <span dir="ltr">
            0{index + 1} / 0{slides.length}
          </span>
        </div>
      </div>

      <dl className="border-t border-white/10 bg-navy/70 backdrop-blur-md">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("py-6 lg:py-7", i % 2 === 1 && "border-s border-white/10 ps-5 sm:ps-8", i > 1 && "border-t border-white/10 lg:border-t-0", i === 2 && "lg:border-s lg:ps-8")}>
              <dd className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl font-extrabold sm:text-4xl" dir="ltr">
                  {s.value}
                </span>
                <span className="mono-label text-[10px] text-gold">{s.unit}</span>
              </dd>
              <dt className="mono-label mt-2 text-[10px] text-white/50">{s.label}</dt>
            </div>
          ))}
        </div>
      </dl>
    </section>
  );
}
