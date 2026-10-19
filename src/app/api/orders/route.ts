import { exec, isDbConfigured } from "@/lib/db";
import { requestTypes } from "@/lib/requests";

// Stores customer requests sent from the website forms (they also go to WhatsApp).
const hits = new Map<string, number[]>();
const LIMIT = 20; // requests per IP per hour

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!isDbConfigured()) return Response.json({ ok: false, reason: "no-database" });

  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= LIMIT) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const raw = await request.text();
  if (raw.length > 30_000) return Response.json({ ok: false }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (str(body.website, 10)) return Response.json({ ok: true }); // honeypot field filled → bot

  const type = str(body.type, 30);
  const summary = str(body.summary, 20_000);
  if (!(type in requestTypes) || !summary) return Response.json({ ok: false }, { status: 400 });

  const total = typeof body.total === "number" && Number.isFinite(body.total) ? body.total : null;
  await exec(
    "INSERT INTO orders (ref, type, lang, name, phone, email, location, total, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      str(body.ref, 20) || "DK",
      type,
      str(body.lang, 5) === "ar" ? "ar" : "en",
      str(body.name, 200),
      str(body.phone, 60),
      str(body.email, 200),
      str(body.location, 300),
      total,
      summary,
    ],
  );
  return Response.json({ ok: true });
}
