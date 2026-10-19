"use client";

import { saveProductAction } from "@/app/admin/actions";
import { colors, finishes, origins, units, usages } from "@/data/attributes";
import { categoryGroups, childCategories } from "@/data/categories";
import type { Product } from "@/data/products";
import { ImageInput, Notice, SubmitButton, useFormAction } from "./ui";

type Initial = (Product & { id: number }) | undefined;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
    <h2 className="mb-4 font-extrabold text-navy">{title}</h2>
    {children}
  </section>
);

const Field = ({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) => (
  <label className={`block ${className ?? ""}`}>
    <span className="label">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
  </label>
);

export function ProductForm({ product }: { product?: Initial }) {
  const { state, pending, onSubmit } = useFormAction(saveProductAction, undefined);
  const p = product;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="space-y-6">
        {state?.error && <Notice tone="error">{state.error}</Notice>}

        <Section title="Name & description">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name (English) *">
              <input name="name_en" required defaultValue={p?.name.en} className="field" />
            </Field>
            <Field label="Name (Arabic)" hint="Optional — English is shown if empty.">
              <input name="name_ar" dir="rtl" defaultValue={p?.name.ar} className="field" />
            </Field>
            <Field label="Short description (English)">
              <textarea name="short_en" rows={3} defaultValue={p?.short.en} className="field resize-y" />
            </Field>
            <Field label="Short description (Arabic)">
              <textarea name="short_ar" rows={3} dir="rtl" defaultValue={p?.short.ar} className="field resize-y" />
            </Field>
          </div>
        </Section>

        <Section title="Price & availability">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (SAR)" hint="Leave empty for “On request”.">
              <input name="price" type="number" min={0} step="0.01" defaultValue={p?.price ?? ""} className="field" />
            </Field>
            <Field label="Unit">
              <select name="unit" defaultValue={p?.unit ?? "m2"} className="field">
                {Object.entries(units).map(([k, v]) => (
                  <option key={k} value={k}>per {v.en}</option>
                ))}
              </select>
            </Field>
            <Field label="SKU / item code" hint={p ? undefined : "Created automatically if empty."}>
              <input name="sku" defaultValue={p?.sku} className="field" />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm font-semibold">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="in_stock" defaultChecked={p ? p.inStock : true} className="size-4 accent-[#b08a4e]" />
              Available now (unchecked = “On request”)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={p?.featured} className="size-4 accent-[#b08a4e]" />
              Featured on the home page
            </label>
          </div>
        </Section>

        <Section title="Category & details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category *">
              <select name="category" required defaultValue={p?.category ?? ""} className="field">
                <option value="" disabled>Choose…</option>
                {categoryGroups.map((g) => (
                  <optgroup key={g.slug} label={g.name.en}>
                    {childCategories(g.slug).map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name.en}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Origin">
              <select name="origin" defaultValue={p?.origin ?? "local"} className="field">
                {Object.entries(origins).map(([k, v]) => (
                  <option key={k} value={k}>{v.en}</option>
                ))}
              </select>
            </Field>
            <Field label="Colour">
              <select name="color" defaultValue={p?.color ?? "white"} className="field">
                {Object.entries(colors).map(([k, v]) => (
                  <option key={k} value={k}>{v.en}</option>
                ))}
              </select>
            </Field>
            <Field label="Finish">
              <select name="finish" defaultValue={p?.finish ?? "polished"} className="field">
                {Object.entries(finishes).map(([k, v]) => (
                  <option key={k} value={k}>{v.en}</option>
                ))}
              </select>
            </Field>
            <Field label="Thickness (cm)" hint="Leave empty for custom thickness.">
              <input name="thickness" type="number" min={0} step="0.1" defaultValue={p?.thickness ?? ""} className="field" />
            </Field>
          </div>
          <fieldset className="mt-5">
            <legend className="label">Suitable for</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(usages).map(([k, v]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold has-checked:border-gold has-checked:bg-gold-light/50">
                  <input type="checkbox" name="usage" value={k} defaultChecked={p?.usage.includes(k as never)} className="size-4 accent-[#b08a4e]" />
                  {v.en}
                </label>
              ))}
            </div>
          </fieldset>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Photo">
          <ImageInput name="image" current={p?.image} required={!p} label={p ? "Replace photo" : "Choose photo *"} />
        </Section>
        <SubmitButton pending={pending} className="btn-gold h-12 w-full" pendingText="Saving…">
          {p ? "Save changes" : "Add product"}
        </SubmitButton>
      </div>
    </form>
  );
}
