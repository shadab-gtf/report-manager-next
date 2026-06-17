"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpValues } from "@/modules/auth/schemas/auth-schemas";
import { StepHeading, PrimaryButton } from "./signup-components";
import { verifySignupOtp } from "@/modules/auth/services/auth-service";

export function OtpStep({
  timer,
  email,
  onResend,
  onComplete,
}: {
  timer: number;
  email: string;
  onResend: () => Promise<void>;
  onComplete: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: isDev ? { otp: "123456" } : { otp: "" },
  });

  const otpValue = watch("otp") || "";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpValue[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = otpValue.split("");
        newOtp[index - 1] = "";
        setValue("otp", newOtp.join(""), { shouldValidate: true });
      } else if (otpValue[index]) {
        // Allow default backspace behavior to clear current box, but trigger validation update
        const newOtp = otpValue.split("");
        newOtp[index] = "";
        setValue("otp", newOtp.join(""), { shouldValidate: true });
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let val = e.target.value;
    if (val.length > 1) {
      if (val.length === 2 && otpValue[index] && val.includes(otpValue[index])) {
        val = val.replace(otpValue[index], "")[0] || val[1];
      } else {
        const pasted = val.replace(/\D/g, "").slice(0, 6);
        setValue("otp", pasted, { shouldValidate: true });
        if (pasted.length === 6) {
          inputRefs.current[5]?.focus();
        } else {
          inputRefs.current[pasted.length]?.focus();
        }
        return;
      }
    }

    const digit = val.replace(/\D/g, "");
    if (!digit && val !== "") return;

    const newOtp = otpValue.split("");
    newOtp[index] = digit;
    setValue("otp", newOtp.join("").slice(0, 6), { shouldValidate: true });

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  async function submit(values: OtpValues) {
    const isValid = await verifySignupOtp(values.otp);
    if (!isValid) {
      setError("Invalid OTP. Use 123456 for this frontend demo.");
      return;
    }
    onComplete();
  }

  const maskEmail = (emailStr: string) => {
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const name = parts[0];
    const visible = name.length > 10 ? name.slice(0, 10) : name.slice(0, Math.ceil(name.length / 2));
    return `${visible}${"*".repeat(12)}`;
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(submit)}>
      <StepHeading title="Email verification" />
      <div className="rounded-xl bg-[#ecfdf5] px-4 py-4 text-[15px] font-medium text-[#059669] border border-[#d1fae5]">
        <span className="block mb-1 font-semibold">OTP sent to</span>
        <span className="opacity-90">{maskEmail(email)}</span>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-[15px] font-medium text-slate-800">6 digit OTP</label>
        <div className="flex gap-3 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={otpValue[i] || ""}
              onChange={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition-colors focus:ring-4 focus:bg-white ${error
                ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                }`}
            />
          ))}
        </div>
        {errors.otp?.message ? <span className="text-sm font-medium text-red-500 mt-1">{errors.otp.message}</span> : null}
        {error ? <span className="text-sm font-medium text-red-500 mt-1">{error}</span> : null}
      </div>

      <div className="flex justify-end -mt-3">
        <button
          type="button"
          disabled={timer > 0}
          onClick={onResend}
          className="text-[13px] font-bold text-[#2563EB] hover:text-blue-700 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </div>

      <div className="mt-2">
        <PrimaryButton disabled={isSubmitting || otpValue.length !== 6}>
          {isSubmitting ? "Verifying..." : "Verify email"}
        </PrimaryButton>
      </div>
    </form>
  );
}
