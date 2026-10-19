"use client";

import { loginAction } from "@/app/admin/actions";
import { Notice, SubmitButton, useFormAction } from "./ui";

export function LoginForm() {
  const { state, pending, onSubmit } = useFormAction(loginAction, undefined);
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <label className="block">
        <span className="label">Email</span>
        <input name="email" type="email" required autoComplete="username" className="field" />
      </label>
      <label className="block">
        <span className="label">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      <SubmitButton pending={pending} className="btn-dark h-12 w-full bg-navy" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
