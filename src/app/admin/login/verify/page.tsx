import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MailCheck } from "lucide-react";
import { VerifyForm } from "@/components/admin/VerifyForm";
import { Logo } from "@/components/ui/Logo";
import { getAdmin, getPendingLogin } from "@/lib/auth";
import { maskEmail } from "@/lib/login-code";

export const metadata: Metadata = { title: "Verify login" };

export default async function VerifyLoginPage() {
  if (await getAdmin()) redirect("/admin");
  const pending = await getPendingLogin();
  if (!pending) redirect("/admin/login");

  return (
    <main className="blueprint grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <Logo className="mx-auto h-14" />
        <span className="mx-auto mt-8 grid size-14 place-items-center rounded-full bg-gold-light text-gold-dark">
          <MailCheck className="size-7" />
        </span>
        <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight">Check your email</h1>
        <VerifyForm maskedEmail={maskEmail(pending.email)} />
      </div>
    </main>
  );
}
