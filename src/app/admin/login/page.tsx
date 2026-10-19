import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getAdmin } from "@/lib/auth";
import { checkDatabase, isDbConfigured, missingSetupVars } from "@/lib/db";

export const metadata: Metadata = { title: "Login" };

// Plain-language help for the database errors people hit during setup.
const errorHelp: Record<string, string> = {
  ER_ACCESS_DENIED_ERROR:
    "The database user name or password is wrong. Check DB_USER and DB_PASSWORD — on Hostinger the user name starts with a prefix like u123456789_.",
  ER_BAD_DB_ERROR:
    "The database name is wrong. Copy the full name from hPanel → Databases into DB_NAME (it starts with a prefix like u123456789_).",
  ER_DBACCESS_DENIED_ERROR:
    "This user cannot open the database. Check that DB_NAME is the full name from hPanel → Databases (with the u123456789_ prefix) and that DB_USER belongs to that database.",
  ECONNREFUSED: "The database server refused the connection. Check DB_HOST (use localhost on Hostinger) and DB_PORT (3306).",
  ENOTFOUND: "The database server address was not found. Check DB_HOST (use localhost on Hostinger).",
  ETIMEDOUT: "The database server did not answer. Check DB_HOST (use localhost on Hostinger) and DB_PORT (3306).",
};

function SetupNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <p className="font-bold">{title}</p>
      <div className="mt-1">{children}</div>
      <p className="mt-2 text-xs text-amber-800">After changing variables in Hostinger, press Redeploy.</p>
    </div>
  );
}

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  let notice: React.ReactNode = null;
  const missing = missingSetupVars();
  if (!isDbConfigured()) {
    notice = (
      <SetupNotice title="The database is not connected yet.">
        Add these environment variables in Hostinger:{" "}
        {missing.map((key, i) => (
          <span key={key}>
            {i > 0 && ", "}
            <code className="font-bold">{key}</code>
          </span>
        ))}
        .
      </SetupNotice>
    );
  } else {
    const status = await checkDatabase();
    if (!status.ok && status.accessible) {
      // Logged in to MySQL fine, but DB_NAME is not a database this user can open: show the right name.
      notice = (
        <SetupNotice title="Wrong database name (DB_NAME).">
          <p>
            <code className="font-bold">DB_NAME</code> is set to <code className="rounded bg-white px-1 font-bold">{status.configured}</code>, but
            the database user <code className="rounded bg-white px-1 font-bold">{status.user}</code> cannot open it.
          </p>
          {status.accessible.length > 0 ? (
            <p className="mt-2">
              This user can open:{" "}
              {status.accessible.map((name, i) => (
                <span key={name}>
                  {i > 0 && ", "}
                  <code className="rounded bg-white px-1 font-bold">{name}</code>
                </span>
              ))}
              . Put that exact name in <code className="font-bold">DB_NAME</code>.
            </p>
          ) : (
            <p className="mt-2">
              This user is not linked to any database. In hPanel → Databases → MySQL Databases, use the database name and user name that
              are listed together on the same row (create a new one if needed), and put them in <code className="font-bold">DB_NAME</code> and{" "}
              <code className="font-bold">DB_USER</code>.
            </p>
          )}
        </SetupNotice>
      );
    } else if (!status.ok) {
      notice = (
        <SetupNotice title="Cannot connect to the database.">
          {errorHelp[status.code] ?? "Check the DB_ variables in Hostinger."} <span className="text-xs">(code {status.code})</span>
        </SetupNotice>
      );
    } else if (status.admins === 0) {
      notice = (
        <SetupNotice title="Database connected — no admin account yet.">
          Add <code className="font-bold">ADMIN_EMAIL</code> and <code className="font-bold">ADMIN_PASSWORD</code> in Hostinger.
        </SetupNotice>
      );
    }
  }

  return (
    <main className="blueprint grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <Logo className="mx-auto h-14" />
        <h1 className="mt-8 text-center text-2xl font-extrabold tracking-tight">Admin login</h1>
        <p className="mt-1 text-center text-sm text-muted">Manage products, prices, aluminium works and orders.</p>
        {notice ?? <LoginForm />}
      </div>
    </main>
  );
}
