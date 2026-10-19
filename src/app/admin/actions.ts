"use server";

import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { colors, finishes, origins, units, usages } from "@/data/attributes";
import { aluCategories } from "@/data/aluminium";
import { categories } from "@/data/categories";
import { clearFailures, clearSession, clientIp, createSession, isThrottled, recordFailure, requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { exec, isDbConfigured, query } from "@/lib/db";
import { deleteImage, storeImage } from "@/lib/media";
import { requestStatuses } from "@/lib/requests";

export type FormState = { error?: string; ok?: string } | undefined;

const text = (form: FormData, key: string, max = 500) => String(form.get(key) ?? "").trim().slice(0, max);
const refreshCatalog = () => revalidateTag(CATALOG_TAG, { expire: 0 });
const leafCategories = categories.filter((c) => c.parent).map((c) => c.slug);

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "item"
  );
}

async function uniqueSlug(table: "products" | "alu_works", base: string) {
  let slug = base;
  for (let n = 2; ; n++) {
    const rows = await query<RowDataPacket>(`SELECT id FROM ${table} WHERE slug = ?`, [slug]);
    if (!rows.length) return slug;
    slug = `${base}-${n}`;
  }
}

async function nextSort(table: "products" | "alu_works") {
  const [row] = await query<RowDataPacket & { m: number | null }>(`SELECT MAX(sort) AS m FROM ${table}`);
  return (row.m ?? 0) + 1;
}

const photoOf = (form: FormData, key = "image") => {
  const file = form.get(key);
  return file instanceof File && file.size > 0 ? file : null;
};

/* ---------------- Auth ---------------- */

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return { error: "The database is not connected yet." };
  const ip = await clientIp();
  if (isThrottled(ip)) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const email = text(form, "email", 190).toLowerCase();
  const password = String(form.get("password") ?? "");
  const [admin] = await query<RowDataPacket & { id: number; password_hash: string }>(
    "SELECT id, password_hash FROM admins WHERE email = ?",
    [email],
  );
  const valid = admin ? await bcrypt.compare(password, admin.password_hash) : false;
  if (!admin || !valid) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Wrong email or password." };
  }
  clearFailures(ip);
  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 8) return { error: "The new password must be at least 8 characters." };
  if (next !== String(form.get("confirm") ?? "")) return { error: "The new passwords do not match." };
  const [row] = await query<RowDataPacket & { password_hash: string }>("SELECT password_hash FROM admins WHERE id = ?", [admin.id]);
  if (!row || !(await bcrypt.compare(current, row.password_hash))) return { error: "Your current password is not correct." };
  await exec("UPDATE admins SET password_hash = ? WHERE id = ?", [await bcrypt.hash(next, 11), admin.id]);
  return { ok: "Password changed." };
}

/* ---------------- Products ---------------- */

export async function saveProductAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id")) || null;

  const nameEn = text(form, "name_en", 200);
  const category = text(form, "category", 40);
  const origin = text(form, "origin", 20);
  const color = text(form, "color", 20);
  const finish = text(form, "finish", 20);
  const unit = text(form, "unit", 10);
  const priceRaw = text(form, "price", 20);
  const thicknessRaw = text(form, "thickness", 10);
  const usageList = form.getAll("usage").map(String).filter((u) => u in usages);

  if (!nameEn) return { error: "Please enter the product name (English)." };
  if (!leafCategories.includes(category)) return { error: "Please choose a category." };
  if (!(origin in origins) || !(color in colors) || !(finish in finishes) || !(unit in units)) {
    return { error: "Please choose origin, colour, finish and unit." };
  }
  const price = priceRaw === "" ? null : Number(priceRaw);
  if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: "Price must be a positive number (or empty for “On request”)." };
  const thickness = thicknessRaw === "" ? null : Number(thicknessRaw);
  if (thickness !== null && (!Number.isFinite(thickness) || thickness <= 0 || thickness > 50)) return { error: "Thickness must be in cm (e.g. 2), or empty for custom." };

  const photo = photoOf(form);
  if (!id && !photo) return { error: "Please add a product photo." };

  let image: { url: string } | null = null;
  try {
    if (photo) image = await storeImage(photo);
  } catch (error) {
    return { error: (error as Error).message };
  }

  const values = {
    name_en: nameEn,
    name_ar: text(form, "name_ar", 200),
    category,
    origin,
    color,
    finish,
    thickness,
    usage_list: usageList.join(","),
    price,
    unit,
    in_stock: form.get("in_stock") ? 1 : 0,
    featured: form.get("featured") ? 1 : 0,
    short_en: text(form, "short_en", 1000),
    short_ar: text(form, "short_ar", 1000),
  };

  if (id) {
    const [existing] = await query<RowDataPacket & { image: string }>("SELECT image FROM products WHERE id = ?", [id]);
    if (!existing) return { error: "This product no longer exists." };
    await exec(
      `UPDATE products SET ${Object.keys(values).map((k) => `${k} = ?`).join(", ")}, sku = COALESCE(NULLIF(?, ''), sku)${image ? ", image = ?" : ""} WHERE id = ?`,
      [...Object.values(values), text(form, "sku", 40), ...(image ? [image.url] : []), id],
    );
    if (image) await deleteImage(existing.image);
  } else {
    const slug = await uniqueSlug("products", slugify(nameEn));
    const sku = text(form, "sku", 40) || `DK-${category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    await exec(
      `INSERT INTO products (slug, sku, image, sort, ${Object.keys(values).join(", ")}) VALUES (?, ?, ?, ?, ${Object.keys(values).map(() => "?").join(", ")})`,
      [slug, sku, image!.url, await nextSort("products"), ...Object.values(values)],
    );
  }
  refreshCatalog();
  redirect(`/admin/products?saved=${encodeURIComponent(nameEn)}`);
}

export async function deleteProductAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const [row] = await query<RowDataPacket & { image: string }>("SELECT image FROM products WHERE id = ?", [id]);
  if (row) {
    await exec("DELETE FROM products WHERE id = ?", [id]);
    await deleteImage(row.image);
    refreshCatalog();
  }
  redirect("/admin/products?deleted=1");
}

/** Daily rate update: every "price-<id>" field of the price list form. Empty = "On request". */
export async function updatePricesAction(form: FormData) {
  await requireAdmin();
  let changed = 0;
  for (const [key, value] of form.entries()) {
    const match = /^price-(\d+)$/.exec(key);
    if (!match) continue;
    const raw = String(value).trim();
    const price = raw === "" ? null : Number(raw);
    if (price !== null && (!Number.isFinite(price) || price < 0)) continue;
    const result = await exec("UPDATE products SET price = ? WHERE id = ? AND NOT (price <=> ?)", [price, Number(match[1]), price]);
    changed += result.affectedRows;
  }
  if (changed) refreshCatalog();
  redirect(`/admin/products?prices=${changed}`);
}

/* ---------------- Aluminium works ---------------- */

export async function createWorksAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const titleEn = text(form, "title_en", 200);
  const category = text(form, "category", 30);
  if (!files.length) return { error: "Please choose at least one photo." };
  if (files.length > 12) return { error: "Please upload at most 12 photos at a time." };
  if (!titleEn) return { error: "Please enter a title (English)." };
  if (!(category in aluCategories)) return { error: "Please choose a category." };

  let sort = await nextSort("alu_works");
  for (const [i, file] of files.entries()) {
    let image;
    try {
      image = await storeImage(file);
    } catch (error) {
      return { error: `${file.name}: ${(error as Error).message}` };
    }
    const suffix = files.length > 1 ? ` ${i + 1}` : "";
    await exec(
      `INSERT INTO alu_works (slug, category, title_en, title_ar, system_en, system_ar, image, w, h, featured, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        await uniqueSlug("alu_works", slugify(titleEn + suffix)),
        category,
        titleEn + suffix,
        text(form, "title_ar", 200) + (text(form, "title_ar") ? suffix : ""),
        text(form, "system_en", 200),
        text(form, "system_ar", 200),
        image.url,
        image.w,
        image.h,
        form.get("featured") ? 1 : 0,
        sort++,
      ],
    );
  }
  refreshCatalog();
  redirect(`/admin/aluminium?added=${files.length}`);
}

export async function updateWorkAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id"));
  const titleEn = text(form, "title_en", 200);
  const category = text(form, "category", 30);
  if (!titleEn) return { error: "Please enter a title (English)." };
  if (!(category in aluCategories)) return { error: "Please choose a category." };

  const [existing] = await query<RowDataPacket & { image: string }>("SELECT image FROM alu_works WHERE id = ?", [id]);
  if (!existing) return { error: "This work no longer exists." };
  const photo = photoOf(form);
  let image: Awaited<ReturnType<typeof storeImage>> | null = null;
  try {
    if (photo) image = await storeImage(photo);
  } catch (error) {
    return { error: (error as Error).message };
  }
  await exec(
    `UPDATE alu_works SET title_en = ?, title_ar = ?, system_en = ?, system_ar = ?, category = ?, featured = ?
     ${image ? ", image = ?, w = ?, h = ?" : ""} WHERE id = ?`,
    [
      titleEn,
      text(form, "title_ar", 200),
      text(form, "system_en", 200),
      text(form, "system_ar", 200),
      category,
      form.get("featured") ? 1 : 0,
      ...(image ? [image.url, image.w, image.h] : []),
      id,
    ],
  );
  if (image) await deleteImage(existing.image);
  refreshCatalog();
  redirect(`/admin/aluminium?saved=1`);
}

export async function deleteWorkAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const [row] = await query<RowDataPacket & { image: string }>("SELECT image FROM alu_works WHERE id = ?", [id]);
  if (row) {
    await exec("DELETE FROM alu_works WHERE id = ?", [id]);
    await deleteImage(row.image);
    refreshCatalog();
  }
  redirect("/admin/aluminium?deleted=1");
}

/* ---------------- Orders & requests ---------------- */

export async function setOrderStatusAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  if (status in requestStatuses) await exec("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  redirect(`/admin/orders/${id}?status=${status}`);
}

export async function saveOrderNoteAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  await exec("UPDATE orders SET admin_note = ? WHERE id = ?", [text(form, "note", 5000), id]);
  redirect(`/admin/orders/${id}?note=1`);
}

export async function deleteOrderAction(form: FormData) {
  await requireAdmin();
  await exec("DELETE FROM orders WHERE id = ?", [Number(form.get("id"))]);
  redirect("/admin/orders?deleted=1");
}
