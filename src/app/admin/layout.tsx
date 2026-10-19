import type { Metadata } from "next";
import "../globals.css";
import { cairo, jakarta } from "@/lib/fonts";

// Admin pages always render on request (they depend on the login cookie and live data).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · DELOWAR AL KHALIJ CO." },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cairo.variable}`}>
      <body className="min-h-dvh bg-steel">{children}</body>
    </html>
  );
}
