import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Horizontal brand lockup (emblem + Arabic & English name), generated from the official logo.
 * `light` is the reversed version for dark backgrounds. Source files: /public/brand.
 */
export function Logo({
  light = false,
  priority = false,
  className = "h-11 sm:h-[52px]", // height classes; width follows the aspect ratio
}: {
  light?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={light ? "/brand/logo-horizontal-light.png" : "/brand/logo-horizontal.png"}
      alt={`${siteConfig.name} — ${siteConfig.nameAr}`}
      width={1347}
      height={320}
      priority={priority}
      sizes="240px"
      className={cn("w-auto", className)}
    />
  );
}
