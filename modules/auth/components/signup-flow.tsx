"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
    <div className="flex w-full flex-col gap-6 rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="grid grid-cols-4 gap-2 mb-2 w-full">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`h-1.5 rounded-full transition-colors ${item <= step
              ? "bg-[#2563EB]"
              : "bg-slate-100"
              }`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-6">
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
              await sendSignupOtp(employee!);
              setTimer(30);
              setMessage(`OTP sent to ${employee!.officialEmail}`);
              setStep(3);
            }}
          />
        ) : null}
        {step === 3 && employee ? (
          <OtpStep
            timer={timer}
            email={employee.officialEmail}
            onResend={async () => {
              await sendSignupOtp(employee!);
              setTimer(30);
            }}
            onComplete={() => setStep(4)}
          />
        ) : null}
        {step === 4 && employee ? <SuccessStep employee={employee!} /> : null}
      </div>
      <div className="mt-2 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
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
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onComplete)}>
      <StepHeading title="Employee information" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Employee ID" registration={register("employeeId")} error={errors.employeeId?.message} />
        <Field label="Full name" registration={register("fullName")} error={errors.fullName?.message} />
        <SelectField label="Designation" registration={register("designation")} error={errors.designation?.message} options={["Operations Associate", "Software Engineer", "Manager", "Analyst", "Intern", "Other"]} />
        <SelectField label="Department" registration={register("department")} error={errors.department?.message} options={["Operations", "Technology", "Marketing", "Sales", "HR", "Finance", "Other"]} />
        <div className="col-span-full md:col-span-1">
          <SelectField label="Reporting manager" registration={register("reportingManager")} error={errors.reportingManager?.message} options={["Saurabh Yadav", "Priya Menon", "Vikram Singh", "Other"]} />
        </div>
        <div className="col-span-full md:col-span-1">
          <Field label="Official GTF email" registration={register("officialEmail")} error={errors.officialEmail?.message} />
        </div>
        <div className="col-span-full md:col-span-1">
          <Field label="Mobile number" registration={register("mobileNumber")} error={errors.mobileNumber?.message} />
        </div>
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

function OtpStep({
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
    register,
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

function SuccessStep({ employee }: { employee: SignupEmployeeInfo }) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title="Registration successful" />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">{employee.fullName}</p>
        <p className="mt-1 text-[15px] font-medium text-slate-500">
          {employee.employeeId} • {employee.designation} • {employee.department}
        </p>
        <p className="mt-2 text-[15px] font-medium text-slate-600 border-t border-slate-200 pt-3">
          Reporting manager: <span className="font-bold text-slate-900">{employee.reportingManager}</span>
        </p>
      </div>
      <Link
        href="/login"
        className="mt-2 flex h-[52px] w-full items-center justify-center rounded-xl bg-[#2563EB] text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
      >
        Continue to login
      </Link>
    </div>
  );
}

function StepHeading({ title }: { title: string }) {
  return (
    <div className="flex flex-col mb-1">
      <h2 className="text-[28px] font-bold leading-tight text-slate-900">{title}</h2>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-slate-500">
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
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-slate-800">{label}</span>
      <input
        type={type}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 focus:bg-white"
        {...registration}
      />
      {error ? <span className="text-sm font-medium text-red-500">{error}</span> : null}
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
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-slate-800">{label}</span>
      <select
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 focus:bg-white"
        {...registration}
      >
        <option value="" disabled hidden>Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-sm font-medium text-red-500">{error}</span> : null}
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
      className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
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
      className="flex h-[52px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-[15px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
    >
      {children}
    </button>
  );
}
