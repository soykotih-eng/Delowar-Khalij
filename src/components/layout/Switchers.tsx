"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { currencies, type Currency } from "@/lib/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang } = useI18n();
  const pathname = usePathname();
  const other = lang === "en" ? "ar" : "en";
  const target = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);
  return (
    <Link href={target} hrefLang={other} lang={other} className={cn("inline-flex items-center gap-1.5 font-semibold hover:text-gold", className)}>
      <Globe className="size-4" />
      {other === "ar" ? "العربية" : "English"}
    </Link>
  );
}

export function CurrencySwitcher({ className }: { className?: string }) {
  const { t } = useI18n();
  const { currency, setCurrency } = useStore();
  return (
    <select
      aria-label={t.currency}
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className={cn("cursor-pointer bg-transparent font-semibold outline-none hover:text-gold", className)}
    >
      {currencies.map((c) => (
        <option key={c} value={c} className="text-ink">
          {c}
        </option>
      ))}
    </select>
  );
}
