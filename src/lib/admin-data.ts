import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { rowToProduct, rowToWork, type ProductRow, type WorkRow } from "./catalog";
import { query } from "./db";
import type { RequestStatus, RequestType } from "./requests";

export type OrderRow = RowDataPacket & {
  id: number;
  ref: string;
  type: RequestType;
  status: RequestStatus;
  lang: "en" | "ar";
  name: string;
  phone: string;
  email: string;
  location: string;
  total: number | null;
  summary: string;
  admin_note: string | null;
  created_at: Date;
  updated_at: Date;
};

export const PAGE_SIZE = 30;

export async function listOrders({ status, type, page }: { status?: string; type?: string; page: number }) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (status) (where.push("status = ?"), params.push(status));
  if (type) (where.push("type = ?"), params.push(type));
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows, [count]] = await Promise.all([
    query<OrderRow>(`SELECT * FROM orders ${clause} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, PAGE_SIZE, (page - 1) * PAGE_SIZE]),
    query<RowDataPacket & { n: number }>(`SELECT COUNT(*) AS n FROM orders ${clause}`, params),
  ]);
  return { rows, total: count.n };
}

export async function getOrder(id: number) {
  return (await query<OrderRow>("SELECT * FROM orders WHERE id = ?", [id]))[0];
}

export async function orderCounts() {
  const rows = await query<RowDataPacket & { status: string; n: number }>("SELECT status, COUNT(*) AS n FROM orders GROUP BY status");
  const counts: Record<string, number> = { new: 0, accepted: 0, completed: 0, rejected: 0 };
  for (const r of rows) counts[r.status] = r.n;
  return counts;
}

export async function listProducts({ q, category }: { q?: string; category?: string }) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (q) (where.push("(name_en LIKE ? OR name_ar LIKE ? OR sku LIKE ?)"), params.push(`%${q}%`, `%${q}%`, `%${q}%`));
  if (category) (where.push("category = ?"), params.push(category));
  const rows = await query<ProductRow>(
    `SELECT * FROM products ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY sort DESC, id DESC`,
    params,
  );
  return rows.map((r) => ({ id: r.id, ...rowToProduct(r) }));
}

export async function getProductById(id: number) {
  const row = (await query<ProductRow>("SELECT * FROM products WHERE id = ?", [id]))[0];
  return row ? { id: row.id, ...rowToProduct(row) } : undefined;
}

export async function listWorks() {
  const rows = await query<WorkRow>("SELECT * FROM alu_works ORDER BY sort DESC, id DESC");
  return rows.map((r) => ({ id: r.id, ...rowToWork(r) }));
}

export async function getWorkById(id: number) {
  const row = (await query<WorkRow>("SELECT * FROM alu_works WHERE id = ?", [id]))[0];
  return row ? { id: row.id, ...rowToWork(row) } : undefined;
}

export async function catalogCounts() {
  const [[p], [w]] = await Promise.all([
    query<RowDataPacket & { n: number }>("SELECT COUNT(*) AS n FROM products"),
    query<RowDataPacket & { n: number }>("SELECT COUNT(*) AS n FROM alu_works"),
  ]);
  return { products: p.n, works: w.n };
}
