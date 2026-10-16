"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  Clock,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Logo } from "@/components/ui/Logo";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { Money } from "@/components/ui/Price";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { categoryGroups, childCategories } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { fill, href, tr } from "@/lib/i18n";
import { cn, formatMoney, telUrl, whatsappUrl } from "@/lib/utils";
import { SearchBox } from "./SearchBox";
import { CurrencySwitcher, LanguageSwitcher } from "./Switchers";

export function TopStrip() {
  const { lang, t } = useI18n();
  const { currency } = useStore();
  return (
    <div className="bg-ink text-xs text-white/80">
      <div className="container-x flex h-10 items-center justify-between gap-4">
        <div className="hidden items-center gap-5 md:flex">
          <a href={whatsappUrl()} className="flex items-center gap-1.5 hover:text-gold" dir="ltr">
            <Phone className="size-3.5 text-gold" />
            {siteConfig.phone}
          </a>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Clock className="size-3.5 text-gold" />
            {siteConfig.hours[lang]}
          </span>
        </div>
        <div className="h-5 min-w-0 flex-1 overflow-hidden text-[11px] sm:text-xs md:flex-none">
          <div className="[animation:ticker_10s_ease-in-out_infinite]">
            <p className="h-5 truncate leading-5">{fill(t.freeShipping, { amount: formatMoney(siteConfig.freeShippingThreshold, currency, lang) })}</p>
            <p className="h-5 truncate leading-5">{t.announcement}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <LanguageSwitcher />
          <span className="h-4 w-px bg-white/20" />
          <CurrencySwitcher />
        </div>
      </div>
    </div>
  );
}

function IconLink({
  to,
  label,
  count,
  className,
  children,
}: {
  to: string;
  label: string;
  count?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={to} aria-label={label} title={label} className={cn("relative grid size-11 place-items-center rounded-full transition hover:bg-cream hover:text-gold", className)}>
      {children}
      {!!count && (
        <span className="absolute end-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-gold text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { lang, t } = useI18n();
  const { cartCount, cartTotal, wishlist, compare } = useStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const groups = categoryGroups.map((g) => ({ group: g, children: childCategories(g.slug) }));
  const links = [
    { label: t.nav.aluminium, path: "/aluminium" },
    { label: t.nav.allProducts, path: "/shop" },
    { label: t.nav.services, path: "/services" },
    { label: t.nav.kitchenCalculator, path: "/kitchen-calculator" },
    { label: t.nav.about, path: "/about" },
  ];
  const moreLinks = [
    { label: t.nav.projectCost, path: "/project-cost" },
    { label: t.nav.knowledge, path: "/knowledge-center" },
    { label: t.nav.showrooms, path: "/showrooms" },
    { label: t.nav.join, path: "/join" },
    { label: t.nav.faq, path: "/faq" },
    { label: t.nav.contact, path: "/contact" },
  ];
  const isActive = (path: string) => pathname === href(lang, path) || (path !== "" && pathname.startsWith(href(lang, path)));

  return (
    <>
      <header className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow", scrolled && "shadow-[0_8px_30px_rgb(0_0_0/0.06)]")}>
        <div className="container-x flex h-[72px] items-center gap-3 lg:gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t.menu}
            className="-ms-2 grid size-11 place-items-center rounded-full hover:bg-cream xl:hidden"
          >
            <Menu className="size-6" />
          </button>
          <Link href={href(lang)} aria-label={siteConfig.name} className="shrink-0">
            <Logo priority />
          </Link>

          <SearchBox className="mx-auto hidden w-full max-w-xl md:block" />

          <div className="ms-auto flex items-center md:ms-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.search}
              className="grid size-11 place-items-center rounded-full hover:bg-cream md:hidden"
            >
              <Search className="size-5" />
            </button>
            <IconLink to={href(lang, "/compare")} label={t.nav.compare} count={compare.length} className="hidden sm:grid">
              <ArrowLeftRight className="size-5" />
            </IconLink>
            <IconLink to={href(lang, "/wishlist")} label={t.nav.wishlist} count={wishlist.length} className="hidden sm:grid">
              <Heart className="size-5" />
            </IconLink>
            <IconLink to={href(lang, "/account")} label={t.nav.account} className="hidden lg:grid">
              <User className="size-5" />
            </IconLink>
            <Link href={href(lang, "/cart")} className="group flex items-center gap-2 rounded-full ps-1 hover:text-gold" aria-label={t.nav.cart}>
              <span className="relative grid size-11 place-items-center rounded-full group-hover:bg-cream">
                <ShoppingBag className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute end-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-gold text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-bold xl:block">
                <Money amount={cartTotal} />
              </span>
            </Link>
          </div>
        </div>

        <nav className="hidden border-t border-line xl:block" aria-label="Main">
          <div className="container-x">
            <ul className="flex items-center justify-between text-[13.5px] font-bold whitespace-nowrap [&>li>a]:px-2">
              <li>
                <Link href={href(lang)} className={cn("flex h-12 items-center hover:text-gold", pathname === href(lang) && "text-gold")}>
                  {t.nav.home}
                </Link>
              </li>
              {groups.map(({ group, children }) => (
                <li key={group.slug} className="group relative">
                  <Link
                    href={href(lang, `/product-category/${group.slug}`)}
                    className={cn("flex h-12 items-center gap-1 hover:text-gold", isActive(`/product-category/${group.slug}`) && "text-gold")}
                  >
                    {tr(group.short ?? group.name, lang)}
                    <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute start-0 top-full z-50 w-80 translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-2xl transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {children.map((c) => (
                      <Link key={c.slug} href={href(lang, `/product-category/${c.slug}`)} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream">
                        <Image src={c.image} alt="" width={44} height={44} className="size-11 rounded-lg object-cover" />
                        <span>
                          <span className="block text-sm font-bold">{tr(c.name, lang)}</span>
                          <span className="block text-xs font-medium text-muted">
                            {fill(t.productsCount, { n: productsInCategory(c.slug).length })}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
              {links.map((l) => (
                <li key={l.path}>
                  <Link
                    href={href(lang, l.path)}
                    className={cn(
                      "flex h-12 items-center gap-1.5 hover:text-gold",
                      isActive(l.path) ? "text-gold" : l.path === "/aluminium" && "text-navy-3",
                    )}
                  >
                    {l.path === "/aluminium" && <span className="size-1.5 rounded-full bg-gold" />}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile search */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} label={t.search} variant="top">
        <div className="flex items-center gap-3 p-4">
          <SearchBox autoFocus className="flex-1" />
          <CloseButton onClick={() => setSearchOpen(false)} label={t.close} />
        </div>
        <div className="h-72" />
      </Modal>

      {/* Mobile menu */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} label={t.menu} variant="drawer-start">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line p-4">
            <Logo className="h-10" />
            <CloseButton onClick={() => setMenuOpen(false)} label={t.close} />
          </div>
          <nav className="flex-1 overflow-y-auto p-4 text-[15px] font-bold">
            <Link href={href(lang)} className="block rounded-xl px-3 py-3 hover:bg-cream">
              {t.nav.home}
            </Link>
            {groups.map(({ group, children }) => (
              <details key={group.slug} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 hover:bg-cream">
                  {tr(group.name, lang)}
                  <ChevronDown className="size-4 transition group-open:rotate-180" />
                </summary>
                <div className="ms-3 border-s border-line ps-3 pb-2">
                  <Link href={href(lang, `/product-category/${group.slug}`)} className="block rounded-lg px-3 py-2 text-sm text-gold-dark">
                    {t.nav.viewAll}
                  </Link>
                  {children.map((c) => (
                    <Link key={c.slug} href={href(lang, `/product-category/${c.slug}`)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 hover:bg-cream">
                      {tr(c.name, lang)}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            {[...links, ...moreLinks].map((l) => (
              <Link key={l.path} href={href(lang, l.path)} className="block rounded-xl px-3 py-3 hover:bg-cream">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-3 border-t border-line bg-cream p-4 text-sm">
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={telUrl()} className="btn btn-outline px-3 py-2.5">
                <Phone className="size-4" /> {t.callUs}
              </a>
              <a href={whatsappUrl(t.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn bg-[#25d366] px-3 py-2.5 text-white">
                <BrandIcon name="whatsapp" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
