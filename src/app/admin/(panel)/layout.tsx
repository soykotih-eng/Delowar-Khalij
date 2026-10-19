import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/ui/Logo";
import { orderCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const counts = await orderCounts();

  return (
    <div className="lg:flex">
      <aside className="blueprint sticky top-0 z-30 flex flex-col gap-4 p-4 lg:h-dvh lg:w-72 lg:shrink-0 lg:gap-8 lg:p-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="rounded-xl bg-white px-3 py-2">
            <Logo className="h-9" />
          </Link>
          <div className="flex gap-1 lg:hidden">
            <a href="/en" target="_blank" aria-label="View website" className="grid size-10 place-items-center rounded-xl text-white/80 hover:bg-white/10">
              <ExternalLink className="size-5" />
            </a>
            <form action={logoutAction}>
              <button type="submit" aria-label="Log out" className="grid size-10 place-items-center rounded-xl text-white/80 hover:bg-white/10">
                <LogOut className="size-5" />
              </button>
            </form>
          </div>
        </div>
        <AdminNav newOrders={counts.new} email={admin.email} />
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
