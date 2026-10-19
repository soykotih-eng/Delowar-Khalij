import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/parts";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const product = await getProductById(Number((await params).id));
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-navy">
        <ArrowLeft className="size-4" /> Products
      </Link>
      <PageHeader title={product.name.en} text={`SKU ${product.sku}`}>
        <a href={`/en/product/${product.slug}`} target="_blank" className="btn btn-outline rounded-lg bg-white px-4 py-2.5">
          <ExternalLink className="size-4" /> View on website
        </a>
      </PageHeader>
      <ProductForm product={product} />
    </>
  );
}
