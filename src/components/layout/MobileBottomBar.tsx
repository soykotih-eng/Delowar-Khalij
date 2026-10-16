"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, House, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { href } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const { lang, t } = useI18n();
  const { wishlist, cartCount } = useStore();
  const pathname = usePathname();

  const items = [
    { path: "", label: t.nav.home, icon: House },
    { path: "/shop", label: t.nav.shop, icon: LayoutGrid },
    { path: "/wishlist", label: t.nav.wishlist, icon: Heart, count: wishlist.length },
    { path: "/cart", label: t.nav.cart, icon: ShoppingBag, count: cartCount },
    { path: "/account", label: t.nav.account, icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {items.map(({ path, label, icon: Icon, count }) => {
          const active = pathname === href(lang, path);
          return (
            <li key={path}>
              <Link href={href(lang, path)} className={cn("flex h-full flex-col items-center justify-center gap-1 text-[10.5px] font-bold", active ? "text-gold" : "text-ink/70")}>
                <span className="relative">
                  <Icon className="size-5" />
                  {!!count && (
                    <span className="absolute -end-2.5 -top-1.5 grid size-4 place-items-center rounded-full bg-gold text-[9px] text-white">{count}</span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
