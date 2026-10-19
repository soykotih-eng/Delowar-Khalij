import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/parts";
import { WorkForm } from "@/components/admin/WorkForm";
import { getWorkById } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit work" };

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const work = await getWorkById(Number((await params).id));
  if (!work) notFound();

  return (
    <>
      <Link href="/admin/aluminium" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-navy">
        <ArrowLeft className="size-4" /> Aluminium works
      </Link>
      <PageHeader title={work.title.en} text="Edit the texts, category or replace the photo." />
      <div className="max-w-3xl">
        <WorkForm work={work} />
      </div>
    </>
  );
}
