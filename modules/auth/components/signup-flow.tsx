"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sendSignupOtp } from "@/modules/auth/services/auth-service";
import type { SignupEmployeeInfo } from "@/types/auth";
import { StepHeading } from "./signup-steps/signup-components";
import { EmployeeInfoStep } from "./signup-steps/employee-info-step";
import { SecurityStep } from "./signup-steps/security-step";
import { OtpStep } from "./signup-steps/otp-step";

type SignupStep = 1 | 2 | 3 | 4;

export function SignupFlow() {
  const [step, setStep] = useState<SignupStep>(1);
  const [employee, setEmployee] = useState<SignupEmployeeInfo | null>(null);
  const [timer, setTimer] = useState(30);

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
