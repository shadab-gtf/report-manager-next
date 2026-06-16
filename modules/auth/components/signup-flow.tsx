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
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

function EmployeeInfoStep({
  onComplete,
}: {
  onComplete: (values: EmployeeInfoValues) => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeInfoValues>({
    resolver: zodResolver(employeeInfoSchema),
    defaultValues: isDev ? {
      employeeId: "GTF-1042",
      fullName: "Kuldeep",
      designation: "Operations Associate",
      department: "Operations",
      reportingManager: "Saurabh Yadav",
      officialEmail: "kuldeep.choudhary@gtftechnologies.com",
      mobileNumber: "9876543210",
    } : {
      employeeId: "",
      fullName: "",
      designation: "",
      department: "",
      reportingManager: "",
      officialEmail: "",
      mobileNumber: "",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onComplete)}>
      <StepHeading title="Employee information" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Employee ID" registration={register("employeeId")} error={errors.employeeId?.message} />
        <Field label="Full name" registration={register("fullName")} error={errors.fullName?.message} />
        <SelectField label="Designation" registration={register("designation")} error={errors.designation?.message} options={["Operations Associate", "Software Engineer", "Manager", "Analyst", "Intern", "Other"]} />
        <SelectField label="Department" registration={register("department")} error={errors.department?.message} options={["Operations", "Technology", "Marketing", "Sales", "HR", "Finance", "Other"]} />
        <SelectField label="Reporting manager" registration={register("reportingManager")} error={errors.reportingManager?.message} options={["Saurabh Yadav", "Priya Menon", "Vikram Singh", "Other"]} />
        <Field label="Official GTF email" registration={register("officialEmail")} error={errors.officialEmail?.message} />
        <Field label="Mobile number" registration={register("mobileNumber")} error={errors.mobileNumber?.message} />
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
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    return score;
  }, [password]);

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
  const isDev = process.env.NODE_ENV === "development";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: isDev ? { otp: "123456" } : { otp: "" },
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
  registration: UseFormRegisterReturn<string>;
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

function SelectField({
  label,
  registration,
  error,
  options,
}: {
  label: string;
  registration: UseFormRegisterReturn<string>;
  error?: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <select
        className="h-11 rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        {...registration}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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
