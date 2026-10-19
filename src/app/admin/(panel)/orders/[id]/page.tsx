import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CheckCheck, Mail, MapPin, Phone, RotateCcw, Trash2, X } from "lucide-react";
import { deleteOrderAction, saveOrderNoteAction, setOrderStatusAction } from "@/app/admin/actions";
import { Card, PageHeader, StatusBadge, TypeBadge, formatDateTime, sar } from "@/components/admin/parts";
import { ConfirmButton, Notice, SubmitButton } from "@/components/admin/ui";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { getOrder } from "@/lib/admin-data";
import { siteConfig } from "@/lib/config";
import { requestStatuses, type RequestStatus } from "@/lib/requests";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Request" };

/** Saudi numbers like 05XXXXXXXX become 9665XXXXXXXX for wa.me links. */
function waNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^05\d{8}$/.test(digits)) digits = `966${digits.slice(1)}`;
  return digits;
}

const replies = {
  accepted: {
    en: (name: string, ref: string) => `Hello ${name}, your request ${ref} has been accepted by ${siteConfig.name}. Our team will contact you shortly with the next steps.`,
    ar: (name: string, ref: string) => `مرحبًا ${name}، تم قبول طلبك ${ref} لدى ${siteConfig.nameAr}. سيتواصل معك فريقنا قريبًا لإكمال الخطوات.`,
  },
  completed: {
    en: (name: string, ref: string) => `Hello ${name}, your order ${ref} is completed. Thank you for choosing ${siteConfig.name}!`,
    ar: (name: string, ref: string) => `مرحبًا ${name}، تم إنجاز طلبك ${ref}. شكرًا لاختيارك ${siteConfig.nameAr}!`,
  },
  rejected: {
    en: (name: string, ref: string) => `Hello ${name}, unfortunately we cannot accept request ${ref} at the moment. Please contact us for alternatives.`,
    ar: (name: string, ref: string) => `مرحبًا ${name}، نعتذر لعدم إمكانية قبول طلبك ${ref} حاليًا. يرجى التواصل معنا لبدائل أخرى.`,
  },
};

const actions: { status: RequestStatus; label: string; icon: typeof Check; className: string }[] = [
  { status: "accepted", label: "Accept", icon: Check, className: "bg-emerald-600 text-white hover:bg-emerald-700" },
  { status: "completed", label: "Mark completed", icon: CheckCheck, className: "bg-navy text-white hover:bg-navy-3" },
  { status: "rejected", label: "Reject", icon: X, className: "bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50" },
  { status: "new", label: "Back to new", icon: RotateCcw, className: "bg-white text-muted ring-1 ring-line hover:text-navy" },
];

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ status?: string; note?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const order = await getOrder(Number(id));
  if (!order) notFound();

  const phone = waNumber(order.phone);
  const reply = order.status !== "new" ? replies[order.status as keyof typeof replies] : undefined;
  const replyText = reply?.[order.lang]?.(order.name || "", order.ref);

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-navy">
        <ArrowLeft className="size-4" /> All requests
      </Link>
      <PageHeader title={`Request ${order.ref}`} text={`Received ${formatDateTime(order.created_at)} · ${order.lang === "ar" ? "Arabic" : "English"} website`}>
        <TypeBadge type={order.type} />
        <StatusBadge status={order.status} />
      </PageHeader>

      {sp.status && sp.status in requestStatuses && (
        <div className="mb-5">
          <Notice>Status changed to “{requestStatuses[sp.status as RequestStatus]}”.{replyText && phone ? " You can now notify the customer on WhatsApp." : ""}</Notice>
        </div>
      )}
      {sp.note && <div className="mb-5"><Notice>Note saved.</Notice></div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-extrabold text-navy">Request details</h2>
            <pre className="mt-4 rounded-xl bg-steel p-4 font-sans text-sm leading-7 whitespace-pre-wrap" dir="auto">{order.summary}</pre>
            {order.total !== null && <p className="mt-4 text-lg font-extrabold text-navy">Estimated total: {sar(order.total)}</p>}
          </Card>

          <Card>
            <h2 className="font-extrabold text-navy">Update status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {actions.filter((a) => a.status !== order.status).map(({ status, label, icon: Icon, className }) => (
                <form key={status} action={setOrderStatusAction}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="status" value={status} />
                  <SubmitButton className={`px-4 py-2.5 ${className}`}>
                    <Icon className="size-4" /> {label}
                  </SubmitButton>
                </form>
              ))}
            </div>
            {replyText && phone && (
              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(replyText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-4 w-full rounded-lg bg-[#25d366] text-white sm:w-auto"
              >
                <BrandIcon name="whatsapp" /> Notify customer on WhatsApp ({requestStatuses[order.status]})
              </a>
            )}
          </Card>

          <Card>
            <h2 className="font-extrabold text-navy">Internal note</h2>
            <p className="text-sm text-muted">Only visible in the admin panel (delivery date, agreed price, etc.).</p>
            <form action={saveOrderNoteAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <textarea name="note" rows={4} defaultValue={order.admin_note ?? ""} className="field resize-y" />
              <SubmitButton className="btn-dark bg-navy px-5 py-2.5">Save note</SubmitButton>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-extrabold text-navy">Customer</h2>
            <p className="mt-3 text-lg font-bold">{order.name || "—"}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {order.phone && (
                <li className="flex items-center gap-2" dir="ltr"><Phone className="size-4 text-gold" /> {order.phone}</li>
              )}
              {order.email && <li className="flex items-center gap-2"><Mail className="size-4 text-gold" /> {order.email}</li>}
              {order.location && <li className="flex items-center gap-2"><MapPin className="size-4 text-gold" /> {order.location}</li>}
            </ul>
            {phone && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="btn rounded-lg bg-[#25d366] px-3 py-2.5 text-white">
                  <BrandIcon name="whatsapp" /> WhatsApp
                </a>
                <a href={`tel:+${phone}`} className="btn btn-outline rounded-lg px-3 py-2.5">
                  <Phone className="size-4" /> Call
                </a>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-extrabold text-navy">Delete request</h2>
            <p className="mt-1 text-sm text-muted">Use for spam or test messages. This cannot be undone.</p>
            <form action={deleteOrderAction} className="mt-4">
              <input type="hidden" name="id" value={order.id} />
              <ConfirmButton message={`Delete request ${order.ref}?`} className="btn w-full rounded-lg bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50">
                <Trash2 className="size-4" /> Delete
              </ConfirmButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
