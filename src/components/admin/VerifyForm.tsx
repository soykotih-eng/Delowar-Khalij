"use client";

import { cancelLoginAction, resendCodeAction, verifyCodeAction } from "@/app/admin/actions";
import { Notice, SubmitButton, useFormAction } from "./ui";

export function VerifyForm({ maskedEmail }: { maskedEmail: string }) {
  const verify = useFormAction(verifyCodeAction);
  const resend = useFormAction(resendCodeAction);
  return (
    <div className="mt-8 space-y-4">
      <p className="rounded-xl bg-steel p-4 text-center text-sm leading-6">
        We sent a 6-digit code to <b dir="ltr">{maskedEmail}</b>.
        <br />
        <span className="text-muted">Check your inbox (and spam folder). The code is valid for 10 minutes.</span>
      </p>
      {resend.state?.ok && <Notice>{resend.state.ok}</Notice>}
      {resend.state?.error && <Notice tone="error">{resend.state.error}</Notice>}
      {verify.state?.error && <Notice tone="error">{verify.state.error}</Notice>}

      <form onSubmit={verify.onSubmit} className="space-y-4">
        <label className="block">
          <span className="label">Verification code</span>
          <input
            name="code"
            required
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            placeholder="123456"
            dir="ltr"
            className="field text-center font-mono text-2xl tracking-[0.5em]"
          />
        </label>
        <SubmitButton pending={verify.pending} className="btn-dark h-12 w-full bg-navy" pendingText="Checking…">
          Verify and sign in
        </SubmitButton>
      </form>

      <div className="flex items-center justify-between gap-3 pt-1 text-sm">
        <form onSubmit={resend.onSubmit}>
          <button type="submit" disabled={resend.pending} className="font-bold text-gold-dark hover:text-navy disabled:opacity-50">
            {resend.pending ? "Sending…" : "Send a new code"}
          </button>
        </form>
        <form action={cancelLoginAction}>
          <button type="submit" className="font-semibold text-muted hover:text-navy">
            Use another account
          </button>
        </form>
      </div>
    </div>
  );
}
