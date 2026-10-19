"use client";

import { createWorksAction, updateWorkAction } from "@/app/admin/actions";
import { aluCategories, type AluWork } from "@/data/aluminium";
import { ImageInput, Notice, SubmitButton, useFormAction } from "./ui";

/** Upload new aluminium works (one or many photos), or edit an existing one. */
export function WorkForm({ work }: { work?: AluWork & { id: number } }) {
  const { state, pending, onSubmit } = useFormAction(work ? updateWorkAction : createWorksAction, undefined);

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      {work && <input type="hidden" name="id" value={work.id} />}
      {state?.error && <Notice tone="error">{state.error}</Notice>}

      {work ? (
        <ImageInput name="image" current={work.image} label="Replace photo" />
      ) : (
        <ImageInput name="photos" multiple required label="Choose photo(s) of the work *" />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Title (English) *</span>
          <input name="title_en" required defaultValue={work?.title.en} placeholder="e.g. Villa sliding windows" className="field" />
        </label>
        <label className="block">
          <span className="label">Title (Arabic)</span>
          <input name="title_ar" dir="rtl" defaultValue={work?.title.ar} className="field" />
        </label>
        <label className="block">
          <span className="label">System / details (English)</span>
          <input name="system_en" defaultValue={work?.system.en} placeholder="e.g. Sliding system · reflective glass" className="field" />
        </label>
        <label className="block">
          <span className="label">System / details (Arabic)</span>
          <input name="system_ar" dir="rtl" defaultValue={work?.system.ar} className="field" />
        </label>
        <label className="block">
          <span className="label">Category *</span>
          <select name="category" required defaultValue={work?.category ?? "windows-doors"} className="field">
            {Object.entries(aluCategories).map(([k, v]) => (
              <option key={k} value={k}>{v.en}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold">
          <input type="checkbox" name="featured" defaultChecked={work?.featured} className="size-4 accent-[#b08a4e]" />
          Show in “Selected projects”
        </label>
      </div>
      {!work && <p className="text-xs text-muted">Several photos at once share the same title and category (numbered 1, 2, 3…). Newest uploads appear first on the website.</p>}

      <SubmitButton pending={pending} className="btn-gold h-12 w-full sm:w-auto sm:px-8" pendingText="Uploading…">
        {work ? "Save changes" : "Upload to website"}
      </SubmitButton>
    </form>
  );
}
