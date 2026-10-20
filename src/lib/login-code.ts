import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { siteConfig } from "./config";
import { exec, getSetting, query } from "./db";
import { sendMail } from "./mailer";

// Email verification for admin login: a 6-digit code, valid 10 minutes, 5 tries, one email per minute.
const VALID_MINUTES = 10;
const MAX_TRIES = 5;
const RESEND_SECONDS = 60;

async function hashCode(adminId: number, code: string) {
  const secret = await getSetting("session_secret");
  return createHmac("sha256", `${secret}:login-code`).update(`${adminId}:${code}`).digest("hex");
}

/** "o***r@example.com" — shown on the verify page. */
export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  const visible = name.length <= 2 ? name[0] : `${name[0]}***${name.at(-1)}`;
  return `${visible}@${domain}`;
}

/**
 * Creates a code and emails it. Returns "recent" (nothing sent) when a code was already sent less
 * than a minute ago — that code is still valid. Throws if the email cannot be sent.
 */
export async function issueLoginCode(admin: { id: number; email: string }, ip: string): Promise<"sent" | "recent"> {
  const recent = await query<RowDataPacket>(
    `SELECT id FROM login_codes WHERE admin_id = ? AND used = 0 AND created_at > NOW() - INTERVAL ${RESEND_SECONDS} SECOND LIMIT 1`,
    [admin.id],
  );
  if (recent.length) return "recent";

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await exec("UPDATE login_codes SET used = 1 WHERE admin_id = ? AND used = 0", [admin.id]); // older codes stop working
  const { insertId } = await exec(
    `INSERT INTO login_codes (admin_id, code_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL ${VALID_MINUTES} MINUTE)`,
    [admin.id, await hashCode(admin.id, code)],
  );

  try {
    await sendMail({ to: admin.email, ...codeEmail(code, ip) });
  } catch (error) {
    await exec("DELETE FROM login_codes WHERE id = ?", [insertId]); // allow an immediate retry
    throw error;
  }
  return "sent";
}

export async function checkLoginCode(adminId: number, code: string): Promise<"ok" | "invalid" | "expired" | "locked"> {
  const [row] = await query<RowDataPacket & { id: number; code_hash: string; attempts: number; live: number }>(
    "SELECT id, code_hash, attempts, expires_at > NOW() AS live FROM login_codes WHERE admin_id = ? AND used = 0 ORDER BY id DESC LIMIT 1",
    [adminId],
  );
  if (!row || !row.live) return "expired";
  if (row.attempts >= MAX_TRIES) return "locked";

  const expected = Buffer.from(row.code_hash);
  const given = Buffer.from(await hashCode(adminId, code));
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    await exec("UPDATE login_codes SET attempts = attempts + 1 WHERE id = ?", [row.id]);
    return row.attempts + 1 >= MAX_TRIES ? "locked" : "invalid";
  }
  await exec("UPDATE login_codes SET used = 1 WHERE id = ?", [row.id]);
  return "ok";
}

function codeEmail(code: string, ip: string) {
  const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" }).format(new Date());
  const subject = `Your admin login code — ${siteConfig.name}`;
  const text = [
    `Your login code is: ${code}`,
    `رمز الدخول: ${code}`,
    "",
    `It is valid for ${VALID_MINUTES} minutes. Do not share it with anyone.`,
    `Login attempt: ${when} (Riyadh time), IP ${ip}`,
    "",
    "If this was not you, someone knows your password — log in and change it in Settings.",
  ].join("\n");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#f3f5f9;font-family:Arial,Helvetica,sans-serif;color:#0b1a35">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#0b1a35;padding:22px 28px;color:#ffffff;font-size:16px;font-weight:bold;letter-spacing:.5px">
        ${siteConfig.name}<div style="color:#b08a4e;font-size:12px;font-weight:normal;margin-top:4px">Admin panel · ${siteConfig.url.replace("https://", "")}</div>
      </td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 6px;font-size:15px">Your login code is:</p>
        <p dir="rtl" style="margin:0 0 18px;font-size:14px;color:#6f6a63">رمز الدخول الخاص بك:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;background:#f7f4ef;border:1px solid #e7e1d7;border-radius:12px;padding:16px;text-align:center;color:#0b1a35">${code}</div>
        <p style="margin:18px 0 0;font-size:14px;line-height:22px">Valid for <b>${VALID_MINUTES} minutes</b>. Do not share this code with anyone.</p>
        <p style="margin:14px 0 0;font-size:12px;line-height:19px;color:#6f6a63">Login attempt: ${when} (Riyadh time) · IP ${ip}<br>If this was not you, someone knows your password — log in and change it in Settings.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
  return { subject, text, html };
}
