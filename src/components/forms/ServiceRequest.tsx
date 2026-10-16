"use client";

import { useState } from "react";
import { ArrowRight, Container, Hammer, Package, Scale, Search, Sparkles, Stamp, Truck, Users } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { services, type Service } from "@/data/services";
import { siteConfig } from "@/lib/config";
import { tr, type Dictionary } from "@/lib/i18n";
import { sendWhatsApp } from "@/lib/utils";

const icons: Record<Service["icon"], typeof Search> = {
  search: Search, truck: Truck, stamp: Stamp, container: Container, package: Package,
  hammer: Hammer, sparkles: Sparkles, scale: Scale, users: Users,
};

type Copy = Dictionary["services"];

/** Services grid + "other service" band, sharing one request modal. */
export function ServicesGrid({ copy }: { copy: Copy }) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const m = copy.modal;
  const serviceName = (slug: string) => {
    const s = services.find((x) => x.slug === slug);
    return s ? tr(s.title, lang) : m.other;
  };

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <article key={s.slug} className="reveal group flex flex-col rounded-3xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl">
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-cream text-gold transition group-hover:bg-gold group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <span className="text-4xl font-extrabold text-line">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold">{tr(s.title, lang)}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted">{tr(s.text, lang)}</p>
              <button type="button" onClick={() => setSelected(s.slug)} className="mt-6 inline-flex items-center gap-2 self-start text-sm font-extrabold text-gold-dark hover:text-ink">
                {copy.request}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-white sm:p-10 lg:flex-row lg:items-center">
        <div>
          <h3 className="text-2xl font-extrabold">{copy.other.title}</h3>
          <p className="mt-2 text-white/65">{copy.other.text}</p>
        </div>
        <button type="button" onClick={() => setSelected("other")} className="btn btn-gold shrink-0">
          {copy.other.cta}
        </button>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} label={m.title} className="max-w-xl">
        {selected && (
          <form
            className="space-y-4 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              sendWhatsApp([
                `*${m.message} — ${siteConfig.name}*`,
                `${m.service}: ${serviceName(String(data.get("service")))}`,
                `${m.name}: ${data.get("name")}`,
                `${m.phone}: ${data.get("phone")}`,
                `${m.location}: ${data.get("location")}`,
                `${m.details}: ${data.get("details")}`,
              ]);
              toast(t.sentWhatsApp);
              setSelected(null);
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">{m.title}</h2>
              <CloseButton onClick={() => setSelected(null)} label={t.close} />
            </div>
            <Field label={m.service}>
              <select name="service" defaultValue={selected} className="field">
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {tr(s.title, lang)}
                  </option>
                ))}
                <option value="other">{m.other}</option>
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={m.name} required>
                <input name="name" required className="field" autoComplete="name" />
              </Field>
              <Field label={m.phone} required>
                <input name="phone" type="tel" required className="field" dir="ltr" autoComplete="tel" />
              </Field>
            </div>
            <Field label={m.location} required>
              <input name="location" required className="field" />
            </Field>
            <Field label={m.details} required>
              <textarea name="details" rows={4} required className="field resize-none" />
            </Field>
            <button type="submit" className="btn btn-gold h-12 w-full">
              {m.submit}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
