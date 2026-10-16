"use client";

import Link from "next/link";
import { useState } from "react";
import { Info, UserPlus } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { siteConfig } from "@/lib/config";
import { href, type Dictionary } from "@/lib/i18n";
import { sendWhatsApp } from "@/lib/utils";

export function SupplierForm({ copy }: { copy: Dictionary["join"]["form"] }) {
  const { t } = useI18n();
  const { toast } = useStore();

  return (
    <form
      id="register"
      className="scroll-mt-40 space-y-4 rounded-3xl border border-line bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        sendWhatsApp([
          `*${copy.message} — ${siteConfig.name}*`,
          `${copy.company}: ${data.get("company")}`,
          `${copy.contact}: ${data.get("contact")}`,
          `${copy.phone}: ${data.get("phone")}`,
          `${copy.email}: ${data.get("email")}`,
          `${copy.city}: ${data.get("city")}`,
          `${copy.activity}: ${data.get("activity")}`,
          `${copy.materials}: ${data.get("materials")}`,
          data.get("cr") && `${copy.cr}: ${data.get("cr")}`,
        ]);
        toast(t.sentWhatsApp);
      }}
    >
      <h2 className="text-2xl font-extrabold">{copy.title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={copy.company} required>
          <input name="company" required className="field" autoComplete="organization" />
        </Field>
        <Field label={copy.contact} required>
          <input name="contact" required className="field" autoComplete="name" />
        </Field>
        <Field label={copy.phone} required>
          <input name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
        </Field>
        <Field label={copy.email} required>
          <input name="email" type="email" required className="field" autoComplete="email" />
        </Field>
        <Field label={copy.city} required>
          <input name="city" required className="field" />
        </Field>
        <Field label={copy.activity} required>
          <select name="activity" required className="field">
            {copy.activities.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={copy.materials} required>
        <textarea name="materials" rows={3} required className="field resize-none" />
      </Field>
      <Field label={copy.cr}>
        <input name="cr" className="field" />
      </Field>
      <button type="submit" className="btn btn-gold h-12 w-full">
        {copy.submit}
      </button>
    </form>
  );
}

export function AccountForms({ copy }: { copy: Dictionary["account"] }) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const [notice, setNotice] = useState(false);

  return (
    <div className="space-y-8">
      {notice && (
        <p className="flex gap-3 rounded-2xl border border-gold/40 bg-gold-light/50 p-5 text-sm leading-6">
          <Info className="mt-0.5 size-5 shrink-0 text-gold-dark" />
          {copy.notice}
        </p>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="space-y-4 rounded-3xl border border-line p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(true);
          }}
        >
          <h2 className="text-2xl font-extrabold">{copy.login.title}</h2>
          <Field label={copy.login.email} required>
            <input name="email" required className="field" autoComplete="username" />
          </Field>
          <Field label={copy.login.password} required>
            <input name="password" type="password" required className="field" autoComplete="current-password" />
          </Field>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#b08a4e]" /> {copy.login.remember}
            </label>
            <button type="button" onClick={() => setNotice(true)} className="font-semibold text-gold-dark hover:text-ink">
              {copy.login.forgot}
            </button>
          </div>
          <button type="submit" className="btn btn-dark h-12 w-full">
            {copy.login.submit}
          </button>
        </form>

        <form
          id="register"
          className="scroll-mt-40 space-y-4 rounded-3xl bg-cream p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            sendWhatsApp([
              `*${copy.register.message} — ${siteConfig.name}*`,
              `${copy.register.name}: ${data.get("name")}`,
              `${copy.register.phone}: ${data.get("phone")}`,
              `${copy.register.email}: ${data.get("email")}`,
            ]);
            toast(t.sentWhatsApp);
          }}
        >
          <h2 className="text-2xl font-extrabold">{copy.register.title}</h2>
          <Field label={copy.register.name} required>
            <input name="name" required className="field" autoComplete="name" />
          </Field>
          <Field label={copy.register.phone} required>
            <input name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
          </Field>
          <Field label={copy.register.email} required>
            <input name="email" type="email" required className="field" autoComplete="email" />
          </Field>
          <button type="submit" className="btn btn-gold h-12 w-full">
            <UserPlus className="size-4" /> {copy.register.submit}
          </button>
          <p className="pt-2 text-center text-sm">
            {copy.supplier}{" "}
            <Link href={href(lang, "/join")} className="font-bold text-gold-dark hover:text-ink">
              {copy.supplierCta}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
