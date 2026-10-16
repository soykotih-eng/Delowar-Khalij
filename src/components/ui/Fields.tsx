"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function QtyStepper({
  value,
  onChange,
  step = 1,
  min = 0,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  className?: string;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.round(v * 100) / 100));
  return (
    <div className={cn("inline-flex h-12 items-center rounded-full border border-line bg-white", className)}>
      <button type="button" onClick={() => set(value - step)} className="grid size-11 place-items-center text-ink/70 hover:text-gold" aria-label="-">
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        step={step}
        onChange={(e) => set(Number(e.target.value) || min)}
        className="w-14 bg-transparent text-center text-sm font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + step)} className="grid size-11 place-items-center text-ink/70 hover:text-gold" aria-label="+">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
