"use client";

import { startTransition, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Loader2 } from "lucide-react";
import type { FormState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/**
 * Runs a server action from onSubmit instead of the `action` prop. React resets forms after an
 * `action` completes — even when it returns a validation error — which would wipe everything typed.
 */
export function useFormAction(action: (state: FormState, form: FormData) => Promise<FormState>, initial?: FormState) {
  const [state, dispatch, pending] = useActionState(action, initial);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => dispatch(form));
  };
  return { state, pending, onSubmit };
}

/** Submit button that shows a spinner while the server action runs. */
export function SubmitButton({
  children,
  className,
  pendingText,
  pending: pendingProp,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={cn("btn rounded-lg", className)}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/** Submit button that asks for confirmation first (used for deletes). */
export function ConfirmButton({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** File input with a live preview of the chosen photo(s). */
export function ImageInput({
  name,
  current,
  multiple,
  required,
  label = "Choose photo",
}: {
  name: string;
  current?: string;
  multiple?: boolean;
  required?: boolean;
  label?: string;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const shown = previews.length ? previews : current ? [current] : [];

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-cream/60 px-4 py-6 text-center text-sm font-semibold text-muted transition hover:border-gold hover:text-ink">
        <ImagePlus className="size-7 text-gold" />
        {label}
        <span className="text-xs font-normal">JPG, PNG or WebP · up to 15 MB{multiple ? " · up to 12 photos" : ""}</span>
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          required={required}
          className="sr-only"
          onChange={(e) => setPreviews([...(e.target.files ?? [])].map((f) => URL.createObjectURL(f)))}
        />
      </label>
      {shown.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {shown.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element -- local blob previews
            <img key={src} src={src} alt="" className="size-24 rounded-lg border border-line object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}

export function Notice({ tone = "ok", children }: { tone?: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-semibold",
        tone === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {children}
    </p>
  );
}
