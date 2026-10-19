"use client";

import { Mail } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { BrandIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";
import { saveRequest, submitRequest } from "@/lib/requests";

export function ContactForm({ copy }: { copy: Dictionary["contact"] }) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const f = copy.form;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const via = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value");
    const lines = [
      `${f.name}: ${data.get("name")}`,
      `${f.phone}: ${data.get("phone")}`,
      `${f.email}: ${data.get("email")}`,
      "",
      `${data.get("message")}`,
    ];
    const request = {
      type: "message" as const,
      lang,
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      lines: [`*${copy.message} — ${data.get("subject")}*`, ...lines],
    };
    if (via === "email") {
      const ref = saveRequest(request);
      const subject = encodeURIComponent(`${copy.message} ${ref}: ${data.get("subject")}`);
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
      return;
    }
    submitRequest(request);
    toast(t.sentWhatsApp);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.name} required>
          <input name="name" required className="field" autoComplete="name" />
        </Field>
        <Field label={f.phone} required>
          <input name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.email}>
          <input name="email" type="email" className="field" autoComplete="email" />
        </Field>
        <Field label={f.subject} required>
          <input name="subject" required className="field" />
        </Field>
      </div>
      <Field label={f.message} required>
        <textarea name="message" required rows={5} className="field resize-none" />
      </Field>
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" value="whatsapp" className="btn bg-[#25d366] text-white hover:brightness-95">
          <BrandIcon name="whatsapp" /> {f.whatsapp}
        </button>
        <button type="submit" value="email" className="btn btn-outline">
          <Mail className="size-4" /> {f.sendEmail}
        </button>
      </div>
    </form>
  );
}
