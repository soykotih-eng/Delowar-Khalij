"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SLIDE_MS = 7000;
const slides = [
  { image: "/images/scenes/hero-kitchen.webp", primary: "/shop", secondary: "/kitchen-calculator" },
  { image: "/images/scenes/hero-lobby.webp", primary: "/services", secondary: "/project-cost" },
  { image: "/images/scenes/hero-bathroom.webp", primary: "/shop", secondary: "/contact" },
];

export function HeroSlider({ lang, copy }: { lang: Locale; copy: Dictionary["home"]["hero"] }) {
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index]);

  const text = copy[index];

  return (
    <section className="relative isolate h-[78svh] min-h-[560px] max-h-[820px] overflow-hidden bg-ink text-white">
      {slides.map((s, i) => (
        <div key={s.image} aria-hidden={i !== index} className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")}>
          <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" className={cn("object-cover", i === index && "animate-kenburns")} />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/90 via-ink/55 to-ink/5 rtl:bg-linear-to-l" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-ink/70 to-transparent" />

      <div className="container-x flex h-full flex-col justify-center pb-16">
        <div key={index} className="max-w-3xl animate-slide-up">
          <p className="eyebrow mb-5">{text.eyebrow}</p>
          <h1 className="text-[2.75rem] leading-[1.03] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem] rtl:leading-[1.25]">
            {text.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{text.text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={href(lang, slides[index].primary)} className="btn btn-gold px-7 py-3.5">
              {text.primary}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
            <Link href={href(lang, slides[index].secondary)} className="btn btn-light px-7 py-3.5">
              {text.secondary}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8">
        <div className="container-x flex items-center justify-between">
          <div className="flex gap-4">
            {slides.map((s, i) => (
              <button key={s.image} type="button" onClick={() => go(i)} aria-label={`${i + 1}`} className="flex items-center gap-2 text-xs font-bold">
                <span className={i === index ? "text-white" : "text-white/45"}>0{i + 1}</span>
                <span className="relative h-0.5 w-8 overflow-hidden bg-white/25 sm:w-14">
                  {i === index && <span key={index} className="absolute inset-y-0 start-0 bg-gold [animation:grow_7s_linear_forwards]" />}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous" className="grid size-11 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-ink">
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next" className="grid size-11 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-ink">
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
