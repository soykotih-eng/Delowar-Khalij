import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getAdmin } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  const configured = isDbConfigured();

  return (
    <main className="blueprint grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <Logo className="mx-auto h-14" />
        <h1 className="mt-8 text-center text-2xl font-extrabold tracking-tight">Admin login</h1>
        <p className="mt-1 text-center text-sm text-muted">Manage products, prices, aluminium works and orders.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            The database is not connected yet. Your developer needs to add the database settings
            (<code>DB_HOST</code>, <code>DB_USER</code>, <code>DB_PASSWORD</code>, <code>DB_NAME</code>,{" "}
            <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>) in Hostinger and redeploy.
          </p>
        )}
      </div>
    </main>
  );
}
