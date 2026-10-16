// Locale helpers that are safe to import from client components (no dictionary data here).
import type { en } from "@/dictionaries/en";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export type L = { en: string; ar: string };
export type Dictionary = typeof en;
export type CommonDict = Dictionary["common"];

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const tr = (value: L, lang: Locale) => value[lang];

/** Replace {placeholders} in a dictionary string. */
export const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));

/** Prefix an internal path with the active locale. */
export const href = (lang: Locale, path = "") => `/${lang}${path}`;
