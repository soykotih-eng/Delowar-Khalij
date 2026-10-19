import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/admin/parts";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { QrCard } from "@/components/admin/QrCard";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  return (
    <>
      <PageHeader title="Settings" text={`Signed in as ${admin.email}`} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-1 font-extrabold text-navy">Change password</h2>
            <p className="mb-5 text-sm text-muted">Choose a strong password and do not share it.</p>
            <div className="max-w-md">
              <PasswordForm />
            </div>
          </Card>
          <Card>
            <h2 className="font-extrabold text-navy">Design, features & technical changes</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Page design, new features, texts on the fixed pages and contact details are managed by your website developer.
              Contact them for any change that is not available in this panel.
            </p>
          </Card>
        </div>
        <QrCard />
      </div>
    </>
  );
}
