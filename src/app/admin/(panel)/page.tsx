import Link from "next/link";
import { ArrowRight, Gem, Inbox, PanelsTopLeft, Plus, Tag, Upload } from "lucide-react";
import { Card, PageHeader, StatusBadge, TypeBadge, formatDateTime, sar } from "@/components/admin/parts";
import { QrCard } from "@/components/admin/QrCard";
import { catalogCounts, listOrders, orderCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAdmin();
  const [counts, catalog, recent] = await Promise.all([orderCounts(), catalogCounts(), listOrders({ page: 1 })]);
  const stats = [
    { label: "New requests", value: counts.new, href: "/admin/orders?status=new", icon: Inbox, tone: "text-red-600 bg-red-50" },
    { label: "Accepted (in progress)", value: counts.accepted, href: "/admin/orders?status=accepted", icon: Inbox, tone: "text-amber-700 bg-amber-50" },
    { label: "Products", value: catalog.products, href: "/admin/products", icon: Gem, tone: "text-gold-dark bg-gold-light" },
    { label: "Aluminium works", value: catalog.works, href: "/admin/aluminium", icon: PanelsTopLeft, tone: "text-navy bg-navy/5" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" text="Everything that happens on delowaralkhalij.net, in one place.">
        <Link href="/admin/products/new" className="btn btn-dark rounded-lg bg-navy px-4 py-2.5">
          <Plus className="size-4" /> Add product
        </Link>
        <Link href="/admin/aluminium" className="btn btn-gold rounded-lg px-4 py-2.5">
          <Upload className="size-4" /> Upload work
        </Link>
        <Link href="/admin/products" className="btn btn-outline rounded-lg bg-white px-4 py-2.5">
          <Tag className="size-4" /> Update rates
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon, tone }) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-gold hover:shadow-lg">
            <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-navy">{value}</p>
            <p className="text-sm font-semibold text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-extrabold text-navy">Latest requests</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-gold-dark hover:text-navy">
              All requests <ArrowRight className="size-4" />
            </Link>
          </div>
          {recent.rows.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">No requests yet. Orders and quote requests from the website will appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.rows.slice(0, 8).map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-steel">
                    <span className="w-24 font-mono text-xs font-bold text-navy">{o.ref}</span>
                    <TypeBadge type={o.type} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{o.name || o.phone || "—"}</span>
                    <span className="text-sm text-muted">{sar(o.total)}</span>
                    <StatusBadge status={o.status} />
                    <span className="w-full text-xs text-muted sm:w-auto">{formatDateTime(o.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <QrCard />
      </div>
    </>
  );
}
