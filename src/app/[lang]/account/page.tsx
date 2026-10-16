import type { Metadata } from "next";
import { AccountForms } from "@/components/forms/MembershipForms";
import { PageTitle } from "@/components/ui/PageHero";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(lang).account.title, robots: { index: false } };
}

export default async function AccountPage({ params }: Props) {
  const { lang } = await params;
  const a = getDictionary(lang).account;
  return (
    <>
      <PageTitle lang={lang} title={a.title} />
      <section className="container-x max-w-5xl py-14 lg:py-20">
        <AccountForms copy={a} />
      </section>
    </>
  );
}
