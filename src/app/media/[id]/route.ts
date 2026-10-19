import type { RowDataPacket } from "mysql2/promise";
import { isDbConfigured, query } from "@/lib/db";

// Serves photos uploaded in the admin panel. An id never changes content, so it can be cached forever.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isDbConfigured() || !/^\d+$/.test(id)) return new Response("Not found", { status: 404 });

  const rows = await query<RowDataPacket & { mime: string; data: Buffer }>("SELECT mime, data FROM media WHERE id = ?", [Number(id)]);
  const media = rows[0];
  if (!media) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
