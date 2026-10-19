"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Gem, Inbox, LayoutDashboard, LogOut, PanelsTopLeft, Settings } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders & requests", icon: Inbox, badge: true },
  { href: "/admin/products", label: "Products & rates", icon: Gem },
  { href: "/admin/aluminium", label: "Aluminium works", icon: PanelsTopLeft },
  { href: "/admin/settings", label: "Settings & QR code", icon: Settings },
];

export function AdminNav({ newOrders, email }: { newOrders: number; email: string }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
              active(href) ? "bg-gold text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-4.5" />
            {label}
            {badge && newOrders > 0 && (
              <span className="ms-auto grid min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{newOrders}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden space-y-1 border-t border-white/10 pt-4 text-sm lg:block">
        <a href="/en" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          <ExternalLink className="size-4.5" /> View website
        </a>
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 font-semibold text-white/70 hover:bg-white/10 hover:text-white">
            <LogOut className="size-4.5" /> Log out
          </button>
        </form>
        <p className="truncate px-3.5 pt-2 text-xs text-white/40">{email}</p>
      </div>
    </>
  );
}
