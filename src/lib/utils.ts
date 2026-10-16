import { siteConfig, type Currency } from "./config";
import type { Locale } from "./i18n";

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const numberLocale = (lang: Locale) => (lang === "ar" ? "ar-SA-u-nu-latn" : "en-US");

/** Format an amount stored in the base currency into the selected currency. */
export function formatMoney(amount: number, currency: Currency, lang: Locale) {
  const value = amount * siteConfig.rates[currency];
  return new Intl.NumberFormat(numberLocale(lang), {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

export const formatNumber = (value: number, lang: Locale, digits = 2) =>
  new Intl.NumberFormat(numberLocale(lang), { maximumFractionDigits: digits }).format(value);

export const formatDate = (iso: string, lang: Locale) =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Open WhatsApp with a prepared message (used by every form on the site). */
export function sendWhatsApp(lines: (string | false | undefined | null)[]) {
  const text = lines.filter(Boolean).join("\n");
  window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}

export const telUrl = () => `tel:${siteConfig.phone.replace(/\s/g, "")}`;
