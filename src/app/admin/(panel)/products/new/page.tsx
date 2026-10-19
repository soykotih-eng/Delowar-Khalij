import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/parts";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-navy">
        <ArrowLeft className="size-4" /> Products
      </Link>
      <PageHeader title="Add product" text="The new product appears on the website as soon as you save." />
      <ProductForm />
    </>
  );
}
