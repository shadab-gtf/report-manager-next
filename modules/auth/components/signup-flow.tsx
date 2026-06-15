"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type UseFormRegisterReturn, useForm, useWatch } from "react-hook-form";
import {
  employeeInfoSchema,
  otpSchema,
  securitySchema,
  type EmployeeInfoValues,
  type OtpValues,
  type SecurityValues,
} from "@/modules/auth/schemas/auth-schemas";
import {
  sendSignupOtp,
  verifySignupOtp,
} from "@/modules/auth/services/auth-service";
import type { SignupEmployeeInfo } from "@/types/auth";

type SignupStep = 1 | 2 | 3 | 4;

export function SignupFlow() {
  const [step, setStep] = useState<SignupStep>(1);
  const [employee, setEmployee] = useState<SignupEmployeeInfo | null>(null);
  const [timer, setTimer] = useState(30);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 3 || timer === 0) {
      return;
    }
    const timeout = window.setTimeout(() => setTimer((value) => value - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [step, timer]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={
              item <= step
                ? "h-2 rounded-full bg-primary"
                : "h-2 rounded-full bg-muted"
            }
          />
        ))}
      </div>
      <div className="mt-6">
        {step === 1 ? (
          <EmployeeInfoStep
            onComplete={(values) => {
              setEmployee(values);
              setStep(2);
            }}
          />
        ) : null}
        {step === 2 && employee ? (
          <SecurityStep
            onBack={() => setStep(1)}
            onComplete={async () => {
              await sendSignupOtp(employee);
              setTimer(30);
              setMessage(`OTP sent to ${employee.officialEmail}`);
              setStep(3);
            }}
          />
        ) : null}
        {step === 3 && employee ? (
          <OtpStep
            timer={timer}
            message={message}
            onResend={async () => {
              await sendSignupOtp(employee);
              setTimer(30);
              setMessage(`OTP resent to ${employee.officialEmail}`);
            }}
            onComplete={() => setStep(4)}
          />
        ) : null}
        {step === 4 && employee ? <SuccessStep employee={employee} /> : null}
      </div>
    </div>
  );
}

function EmployeeInfoStep({
  onComplete,
}: {
  onComplete: (values: EmployeeInfoValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeInfoValues>({
    resolver: zodResolver(employeeInfoSchema),
    defaultValues: {
      employeeId: "GTF-1042",
      fullName: "Aarav Sharma",
      designation: "Operations Associate",
      department: "Operations",
      reportingManager: "Priya Menon",
      officialEmail: "aarav.sharma@gtf.example",
      mobileNumber: "9876543210",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onComplete)}>
      <StepHeading title="Employee information" />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["employeeId", "Employee ID"],
          ["fullName", "Full name"],
          ["designation", "Designation"],
          ["department", "Department"],
          ["reportingManager", "Reporting manager"],
          ["officialEmail", "Official GTF email"],
          ["mobileNumber", "Mobile number"],
        ].map(([name, label]) => (
          <Field
            key={name}
            label={label}
            registration={register(name as keyof EmployeeInfoValues)}
            error={errors[name as keyof EmployeeInfoValues]?.message}
          />
        ))}
      </div>
      <PrimaryButton>Continue</PrimaryButton>
    </form>
  );
}

function SecurityStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => Promise<void>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: { password: "password123", confirmPassword: "password123" },
  });
  const password = useWatch({ control, name: "password" });
  const strength = useMemo(() => Math.min(100, password.length * 10), [password]);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onComplete)}>
      <StepHeading title="Account security" />
      <Field
        label="Password"
        type={isVisible ? "text" : "password"}
        registration={register("password")}
        error={errors.password?.message}
      />
      <div className="h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${strength}%` }} />
      </div>
      <Field
        label="Confirm password"
        type={isVisible ? "text" : "password"}
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <button
        type="button"
        onClick={() => setIsVisible((value) => !value)}
        className="justify-self-start text-sm font-semibold text-primary"
      >
        {isVisible ? "Hide password" : "Show password"}
      </button>
      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton disabled={isSubmitting}>
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function OtpStep({
  timer,
  message,
  onResend,
  onComplete,
}: {
  timer: number;
  message: string | null;
  onResend: () => Promise<void>;
  onComplete: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "123456" },
  });

  async function submit(values: OtpValues) {
    const isValid = await verifySignupOtp(values.otp);
    if (!isValid) {
      setError("Invalid OTP. Use 123456 for this frontend demo.");
      return;
    }
    onComplete();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
      <StepHeading title="Email verification" />
      {message ? (
        <p className="rounded-md bg-info-light px-3 py-2 text-sm font-semibold text-info">
          {message}
        </p>
      ) : null}
      <Field label="6 digit OTP" registration={register("otp")} error={errors.otp?.message} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={timer > 0}
          onClick={onResend}
          className="text-sm font-semibold text-primary disabled:text-muted-foreground"
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </button>
        <PrimaryButton disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify email"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function SuccessStep({ employee }: { employee: SignupEmployeeInfo }) {
  return (
    <div className="grid gap-5">
      <StepHeading title="Registration successful" />
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="font-semibold text-foreground">{employee.fullName}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {employee.employeeId} · {employee.designation} · {employee.department}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Reporting manager: {employee.reportingManager}
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Continue to login
      </Link>
    </div>
  );
}

function StepHeading({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fields validate instantly and preserve progress during onboarding.
      </p>
    </div>
  );
}

function Field({
  label,
  registration,
  error,
  type = "text",
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        type={type}
        className="h-11 rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        {...registration}
      />
      {error ? <span className="font-normal text-danger">{error}</span> : null}
    </label>
  );
}

function PrimaryButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}
