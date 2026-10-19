import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSetting, isDbConfigured, query } from "./db";

const COOKIE = "dak_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Admin = { id: number; email: string };

async function sign(payload: string) {
  const secret = await getSetting("session_secret");
  if (!secret) throw new Error("Session secret missing");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createSession(adminId: number) {
  const payload = `${adminId}.${Date.now() + MAX_AGE * 1000}`;
  (await cookies()).set(COOKIE, `${payload}.${await sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function getAdmin(): Promise<Admin | null> {
  const raw = (await cookies()).get(COOKIE)?.value; // read first: marks the route as dynamic
  if (!raw || !isDbConfigured()) return null;
  const [id, expires, signature] = raw.split(".");
  if (!id || !expires || !signature || Number(expires) < Date.now()) return null;
  try {
    const expected = Buffer.from(await sign(`${id}.${expires}`));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const rows = await query<RowDataPacket & Admin>("SELECT id, email FROM admins WHERE id = ?", [Number(id)]);
    return rows[0] ? { id: rows[0].id, email: rows[0].email } : null;
  } catch {
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// Simple in-memory throttle against password guessing: 5 failed attempts per 15 minutes per IP.
const attempts = new Map<string, { count: number; until: number }>();

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "local").trim();
}

export function isThrottled(ip: string) {
  const entry = attempts.get(ip);
  return Boolean(entry && entry.count >= 5 && entry.until > Date.now());
}

export function recordFailure(ip: string) {
  const entry = attempts.get(ip);
  const fresh = !entry || entry.until < Date.now();
  attempts.set(ip, { count: fresh ? 1 : entry.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}
