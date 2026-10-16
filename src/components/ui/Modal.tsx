"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  variant?: "center" | "drawer-start" | "drawer-end" | "top";
  /** Background class of the dialog surface. */
  surface?: string;
  className?: string;
};

const variants = {
  center: "m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[calc(100dvh-2rem)] rounded-2xl",
  "drawer-start": "m-0 inset-y-0 start-0 end-auto h-dvh max-h-none w-[88%] max-w-sm",
  "drawer-end": "m-0 inset-y-0 end-0 start-auto h-dvh max-h-none w-[88%] max-w-md",
  top: "mx-auto mt-0 mb-auto w-full max-w-none rounded-b-2xl",
};

/** Accessible modal built on the native <dialog> element (focus trap, Esc to close). */
export function Modal({ open, onClose, label, children, variant = "center", surface = "bg-white", className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn("p-0 text-ink shadow-2xl", surface, variants[variant], className)}
    >
      {open && (
        <div className={cn("relative overflow-y-auto", variant === "center" ? "max-h-[calc(100dvh-2rem)]" : "h-full")}>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function CloseButton({ onClick, label, className }: { onClick: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-10 place-items-center rounded-full bg-cream text-ink transition hover:bg-ink hover:text-white",
        className,
      )}
    >
      <X className="size-5" />
    </button>
  );
}
