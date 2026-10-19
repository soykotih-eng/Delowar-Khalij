import { requestStatuses, requestTypes, type RequestStatus, type RequestType } from "@/lib/requests";
import { cn } from "@/lib/utils";

export function PageHeader({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

const statusStyle: Record<RequestStatus, string> = {
  new: "bg-red-50 text-red-700 ring-red-200",
  accepted: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1", statusStyle[status] ?? statusStyle.new)}>
      {requestStatuses[status] ?? status}
    </span>
  );
}

export function TypeBadge({ type }: { type: RequestType }) {
  return <span className="inline-flex rounded-md bg-navy/5 px-2 py-1 text-xs font-semibold text-navy">{requestTypes[type] ?? type}</span>;
}

export const formatDateTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" }).format(new Date(date));

export const sar = (value: number | null) =>
  value === null ? "—" : `SAR ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)}`;

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-line bg-white p-5 sm:p-6", className)}>{children}</section>;
}
