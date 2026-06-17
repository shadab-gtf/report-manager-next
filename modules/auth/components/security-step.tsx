"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { securitySchema, type SecurityValues } from "@/modules/auth/schemas/auth-schemas";
import { StepHeading, Field, PrimaryButton } from "./signup-components";

export function SecurityStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => Promise<void>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: isDev
      ? { password: "password123", confirmPassword: "password123" }
      : { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const isMatch = password && confirmPassword && password === confirmPassword;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onComplete)}>
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex w-fit items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back
        </button>
        <StepHeading title="Account security" />
      </div>
      <Field
        label="Password"
        type={isVisible ? "text" : "password"}
        registration={register("password")}
        error={errors.password?.message}
      />
      <Field
        label="Confirm password"
        type={isVisible ? "text" : "password"}
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <button
        type="button"
        onClick={() => setIsVisible((value) => !value)}
        className="self-start text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors"
      >
        {isVisible ? "Hide password" : "Show password"}
      </button>
      <div className="mt-2">
        <PrimaryButton disabled={isSubmitting || !isMatch}>
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </PrimaryButton>
      </div>
    </form>
  );
}
