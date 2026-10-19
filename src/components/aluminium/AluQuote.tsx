"use client";

import { createContext, useContext, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Field } from "@/components/ui/Fields";
import { CloseButton, Modal } from "@/components/ui/Modal";
import { aluServices } from "@/data/aluminium";
import { siteConfig } from "@/lib/config";
import { tr, type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { submitRequest } from "@/lib/requests";

type FormCopy = Dictionary["aluminium"]["form"];
const QuoteContext = createContext<(service?: string) => void>(() => {});

/** Wraps the aluminium page; any child can open the quote form with `useAluQuote()`. */
export function AluQuoteProvider({ copy, children }: { copy: FormCopy; children: React.ReactNode }) {
  const { lang, t } = useI18n();
  const { toast } = useStore();
  const [service, setService] = useState<string | null>(null);
  const close = () => setService(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const s = aluServices.find((x) => x.key === d.get("service"));
    submitRequest({ type: "aluminium", lang, name: d.get("name"), phone: d.get("phone"), location: d.get("location"), lines: [
      `*${copy.message} — ${siteConfig.name}*`,
      `${copy.service}: ${s ? tr(s.title, lang) : "—"}`,
      `${copy.projectType}: ${d.get("type")}`,
      `${copy.location}: ${d.get("location")}`,
      d.get("size") && `${copy.size}: ${d.get("size")}`,
      d.get("notes") && `${copy.notes}: ${d.get("notes")}`,
      d.get("visit") && `${copy.siteVisit}: ${copy.yes}`,
      "",
      `${copy.name}: ${d.get("name")}`,
      `${copy.phone}: ${d.get("phone")}`,
    ] });
    toast(t.sentWhatsApp);
    close();
  }

  return (
    <QuoteContext.Provider value={(s) => setService(s ?? aluServices[0].key)}>
      {children}
      <Modal open={service !== null} onClose={close} label={copy.title} className="max-w-2xl">
        {service !== null && (
          <form onSubmit={submit} className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono-label text-gold-dark">{copy.service}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">{copy.title}</h2>
                <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
              </div>
              <CloseButton onClick={close} label={t.close} className="shrink-0" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label={copy.service}>
                <select name="service" defaultValue={service} className="field">
                  {aluServices.map((s) => (
                    <option key={s.key} value={s.key}>
                      {tr(s.title, lang)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={copy.projectType}>
                <select name="type" className="field">
                  {copy.types.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label={copy.location} required>
                <input name="location" required className="field" />
              </Field>
              <Field label={copy.size}>
                <input name="size" className="field" />
              </Field>
              <Field label={copy.notes} className="sm:col-span-2">
                <textarea name="notes" rows={3} className="field resize-none" />
              </Field>
              <label className="flex items-center gap-3 text-sm font-semibold sm:col-span-2">
                <input type="checkbox" name="visit" defaultChecked className="size-4 accent-[#b08a4e]" />
                {copy.siteVisit}
              </label>
              <Field label={copy.name} required>
                <input name="name" required className="field" autoComplete="name" />
              </Field>
              <Field label={copy.phone} required>
                <input name="phone" type="tel" required dir="ltr" className="field" autoComplete="tel" />
              </Field>
            </div>
            <button type="submit" className={cn("btn btn-gold mt-6 h-12 w-full")}>
              {copy.submit}
            </button>
          </form>
        )}
      </Modal>
    </QuoteContext.Provider>
  );
}

export const useAluQuote = () => useContext(QuoteContext);

export function QuoteButton({ label, service, className }: { label: string; service?: string; className?: string }) {
  const open = useAluQuote();
  return (
    <button type="button" onClick={() => open(service)} className={className}>
      {label}
    </button>
  );
}
