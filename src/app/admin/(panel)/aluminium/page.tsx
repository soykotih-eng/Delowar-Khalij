import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import { deleteWorkAction } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/parts";
import { ConfirmButton, Notice } from "@/components/admin/ui";
import { WorkForm } from "@/components/admin/WorkForm";
import { aluCategories } from "@/data/aluminium";
import { listWorks } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Aluminium works" };

type Props = { searchParams: Promise<{ added?: string; saved?: string; deleted?: string }> };

export default async function AluminiumAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const works = await listWorks();

  return (
    <>
      <PageHeader title="Aluminium works" text="Upload photos of completed work — they appear on the Aluminium & Glass page and the home page.">
        <a href="/en/aluminium#works" target="_blank" className="btn btn-outline rounded-lg bg-white px-4 py-2.5">View on website</a>
      </PageHeader>

      <div className="mb-4 space-y-2">
        {sp.added && <Notice>{sp.added} photo(s) uploaded and live on the website.</Notice>}
        {sp.saved && <Notice>Changes saved.</Notice>}
        {sp.deleted && <Notice>Work deleted.</Notice>}
      </div>

      <WorkForm />

      <h2 className="mt-10 mb-4 text-lg font-extrabold text-navy">
        On the website <span className="text-sm font-semibold text-muted">({works.length})</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {works.map((w) => (
          <article key={w.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-square bg-steel">
              <Image src={w.image} alt={w.title.en} fill sizes="(min-width: 1280px) 220px, 45vw" className="object-cover" />
              {w.featured && (
                <span className="absolute start-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-white">
                  <Star className="size-3 fill-current" /> Selected
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-bold text-navy">{w.title.en}</p>
              <p className="truncate text-xs text-muted">{aluCategories[w.category].en}</p>
              <div className="mt-2 flex gap-1">
                <Link href={`/admin/aluminium/${w.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-steel hover:text-navy" aria-label="Edit">
                  <Pencil className="size-4" />
                </Link>
                <form action={deleteWorkAction}>
                  <input type="hidden" name="id" value={w.id} />
                  <ConfirmButton message={`Delete “${w.title.en}”?`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
