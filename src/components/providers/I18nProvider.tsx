"use client";

import { createContext, useContext, useMemo } from "react";
import type { CommonDict, Locale } from "@/lib/i18n";

type I18nValue = { lang: Locale; t: CommonDict };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ lang, t, children }: I18nValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
