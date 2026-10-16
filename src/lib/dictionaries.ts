import "server-only";
import { ar } from "@/dictionaries/ar";
import { en } from "@/dictionaries/en";
import type { Dictionary, Locale } from "./i18n";

/** Full page copy — server components only. Client components get `common` via I18nProvider. */
export const getDictionary = (lang: Locale): Dictionary => (lang === "ar" ? ar : en);
