import Image from "next/image";
import { aluImage, type AluWork } from "@/data/aluminium";
import { tr, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** "01 —— LABEL" + heading, in the technical style of the aluminium pages. */
export function AluHeading({
  n,
  label,
  title,
  text,
  light = false,
  className,
}: {
  n: string;
  label: string;
  title: string;
  text?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="mono-label flex items-center gap-3 text-gold">
        <span className={light ? "text-white/50" : "text-navy/40"}>{n}</span>
        <span className="h-px w-10 bg-current" />
        {label}
      </p>
      <h2 className={cn("mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl", light ? "text-white" : "text-navy")}>
        {title}
      </h2>
      {text && <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/65" : "text-navy/60")}>{text}</p>}
    </div>
  );
}

/** Taped polaroid frame — makes on-site photos feel like a curated album. */
export function Polaroid({
  work,
  lang,
  rotate = 0,
  sizes,
  badge,
  priority,
  className,
}: {
  work: AluWork;
  lang: Locale;
  rotate?: number;
  sizes: string;
  badge?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("polaroid rotate-(--r)", className)} style={{ "--r": `${rotate}deg` } as React.CSSProperties}>
      <span className="polaroid-tape" aria-hidden />
      <div className="relative overflow-hidden bg-navy-2" style={{ aspectRatio: `${work.w} / ${work.h}` }}>
        <Image src={aluImage(work.slug)} alt={tr(work.title, lang)} fill sizes={sizes} priority={priority} className="object-cover" />
        {badge && (
          <span className="absolute start-2 top-2 hidden rounded-full bg-navy/80 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur sm:inline-block">
            {badge}
          </span>
        )}
      </div>
      <figcaption className="px-1 pt-3 text-center">
        <span className="block text-[15px] leading-snug font-extrabold text-navy italic sm:text-base">{tr(work.title, lang)}</span>
        <span className="mt-1 block font-mono text-[10px] tracking-wider text-navy/50 uppercase">{tr(work.system, lang)}</span>
      </figcaption>
    </figure>
  );
}
