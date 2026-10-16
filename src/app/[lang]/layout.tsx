import type { Metadata, Viewport } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header, TopStrip } from "@/components/layout/Header";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { PurchaseRequestModal } from "@/components/product/PurchaseRequestModal";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap", preload: false });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: d.meta.title, template: `%s | ${lang === "ar" ? siteConfig.nameAr : siteConfig.name}` },
    description: d.meta.description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", ar: "/ar" } },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      images: ["/images/scenes/hero-kitchen.webp"],
    },
  };
}

export const viewport: Viewport = { themeColor: "#141414" };

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={`${jakarta.variable} ${cairo.variable}`}>
      <body className="min-h-dvh pb-16 lg:pb-0">
        <I18nProvider lang={lang} t={d.common}>
          <StoreProvider>
            <TopStrip />
            <Header />
            <main>{children}</main>
            <Footer lang={lang} />
            <MobileBottomBar />
            <a
              href={whatsappUrl(d.common.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={d.common.chatWhatsApp}
              className="fixed end-4 bottom-20 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-110 lg:end-6 lg:bottom-6"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25 [animation-iteration-count:4]" />
              <BrandIcon name="whatsapp" className="relative size-7" />
            </a>
            <QuickViewModal />
            <PurchaseRequestModal />
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
