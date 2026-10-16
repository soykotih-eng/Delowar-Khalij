"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";
import { href } from "@/lib/i18n";

export default function NotFound() {
  const { lang, t } = useI18n();
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="bg-linear-to-b from-gold to-gold-dark bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-muted">{t.notFound.text}</p>
      <Link href={href(lang)} className="btn btn-dark mt-8">
        {t.notFound.cta}
      </Link>
    </section>
  );
}
