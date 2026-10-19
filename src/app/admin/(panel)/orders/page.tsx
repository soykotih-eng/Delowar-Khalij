import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Notice } from "@/components/admin/ui";
import { PageHeader, StatusBadge, TypeBadge, formatDateTime, sar } from "@/components/admin/parts";
import { PAGE_SIZE, listOrders, orderCounts } from "@/lib/admin-data";
import { requestStatuses, requestTypes } from "@/lib/requests";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Orders & requests" };

type Props = { searchParams: Promise<{ status?: string; type?: string; page?: string; deleted?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const status = sp.status && sp.status in requestStatuses ? sp.status : undefined;
  const type = sp.type && sp.type in requestTypes ? sp.type : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ rows, total }, counts] = await Promise.all([listOrders({ status, type, page }), orderCounts()]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { status, type, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    return `/admin/orders${params.size ? `?${params}` : ""}`;
  };
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader title="Orders & requests" text="Every order, quote and message sent from the website. New ones also arrive on WhatsApp." />
      {sp.deleted && <div className="mb-4"><Notice>Request deleted.</Notice></div>}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-line">
          {[["", "All", allCount] as const, ...Object.entries(requestStatuses).map(([k, label]) => [k, label, counts[k] ?? 0] as const)].map(
            ([key, label, n]) => (
              <Link
                key={key}
                href={link({ status: key || undefined, page: undefined })}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold",
                  (status ?? "") === key ? "bg-navy text-white" : "text-muted hover:text-navy",
                )}
              >
                {label} <span className="text-xs opacity-70">{n}</span>
              </Link>
            ),
          )}
        </div>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <select name="type" defaultValue={type ?? ""} className="field w-auto py-2.5">
            <option value="">All types</option>
            {Object.entries(requestTypes).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-dark rounded-lg bg-navy px-4 py-2.5">Filter</button>
        </form>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No requests here yet.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line bg-steel text-start text-xs font-bold text-muted uppercase">
              <tr>
                <th className="p-3 text-start">Ref</th>
                <th className="p-3 text-start">Received</th>
                <th className="p-3 text-start">Type</th>
                <th className="p-3 text-start">Customer</th>
                <th className="p-3 text-end">Total</th>
                <th className="p-3 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-steel/60">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono font-bold text-navy hover:text-gold-dark">{o.ref}</Link>
                  </td>
                  <td className="p-3 whitespace-nowrap text-muted">{formatDateTime(o.created_at)}</td>
                  <td className="p-3"><TypeBadge type={o.type} /></td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="block font-semibold hover:text-gold-dark">{o.name || "—"}</Link>
                    <span className="text-xs text-muted" dir="ltr">{o.phone}</span>
                  </td>
                  <td className="p-3 text-end whitespace-nowrap">{sar(o.total)}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold">
          {page > 1 && <Link href={link({ page: String(page - 1) })} className="btn btn-outline rounded-lg bg-white px-3 py-2"><ChevronLeft className="size-4" /> Newer</Link>}
          <span className="px-3 text-muted">Page {page} of {pages}</span>
          {page < pages && <Link href={link({ page: String(page + 1) })} className="btn btn-outline rounded-lg bg-white px-3 py-2">Older <ChevronRight className="size-4" /></Link>}
        </div>
      )}
    </>
  );
}
