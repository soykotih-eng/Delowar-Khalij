"use client";

import { changePasswordAction } from "@/app/admin/actions";
import { Notice, SubmitButton, useFormAction } from "./ui";

export function PasswordForm() {
  const { state, pending, onSubmit } = useFormAction(changePasswordAction, undefined);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.ok && <Notice>{state.ok}</Notice>}
      <label className="block">
        <span className="label">Current password</span>
        <input name="current" type="password" required autoComplete="current-password" className="field" />
      </label>
      <label className="block">
        <span className="label">New password (min. 8 characters)</span>
        <input name="next" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </label>
      <label className="block">
        <span className="label">Repeat new password</span>
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </label>
      <SubmitButton pending={pending} className="btn-dark bg-navy px-6 py-3" pendingText="Saving…">
        Change password
      </SubmitButton>
    </form>
  );
}
