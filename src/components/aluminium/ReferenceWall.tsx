"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { aluCategories, aluImage, aluWorks, type AluCategory } from "@/data/aluminium";
import { fill, tr, type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Polaroid } from "./Shared";

const tilt = [-2.2, 1.6, -1.2, 2, -1.6, 1.1, -0.8, 1.8];
type Filter = "all" | AluCategory;

export function ReferenceWall({ copy }: { copy: Dictionary["aluminium"]["wall"] }) {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = filter === "all" ? aluWorks : aluWorks.filter((w) => w.category === filter);
  const current = open === null ? null : list[open];

  const go = (step: number) => setOpen((i) => (i === null ? i : (i + step + list.length) % list.length));

  useEffect(() => {
    if (open === null) return;
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filters: Filter[] = ["all", ...(Object.keys(aluCategories) as AluCategory[])];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "all" ? aluWorks.length : aluWorks.filter((w) => w.category === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs font-medium transition",
                filter === f ? "border-gold bg-gold text-white" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white",
              )}
            >
              {f === "all" ? copy.all : tr(aluCategories[f], lang)}
              <span className={filter === f ? "text-white/80" : "text-white/40"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 columns-2 gap-4 sm:gap-7 md:columns-3 lg:columns-4">
        {list.map((work, i) => (
          <button
            key={work.slug}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative mb-6 block w-full break-inside-avoid text-start hover:z-10 sm:mb-9"
          >
            <Polaroid
              work={work}
              lang={lang}
              rotate={tilt[i % tilt.length]}
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
              badge={tr(aluCategories[work.category], lang)}
              className="group-hover:scale-[1.03] group-hover:rotate-0"
            />
          </button>
        ))}
      </div>
      <p className="mono-label text-center text-[10px] text-white/40">{fill(copy.photos, { n: list.length })}</p>

      <Modal open={current !== null} onClose={() => setOpen(null)} label={copy.title} surface="bg-navy" className="max-w-6xl">
        {current && (
          <div className="relative flex h-[min(88dvh,920px)] flex-col">
            <div className="relative flex-1">
              <Image key={current.slug} src={aluImage(current.slug)} alt={tr(current.title, lang)} fill sizes="100vw" className="animate-fade-in object-contain" />
              <button type="button" onClick={() => go(-1)} aria-label={copy.prev} className="absolute start-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-gold">
                <ChevronLeft className="size-6 rtl:rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label={copy.next} className="absolute end-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-gold">
                <ChevronRight className="size-6 rtl:rotate-180" />
              </button>
              <CloseButton onClick={() => setOpen(null)} label={t.close} className="absolute end-3 top-3" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-white">
              <div>
                <p className="font-extrabold">{tr(current.title, lang)}</p>
                <p className="mono-label mt-1 text-[10px] text-gold">{tr(current.system, lang)}</p>
              </div>
              <span className="font-mono text-xs text-white/50" dir="ltr">
                {String(open! + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
