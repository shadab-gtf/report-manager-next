"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Lock, Check } from "lucide-react";
import { loginWithMockApi } from "@/modules/auth/services/auth-service";
import { persistSession } from "@/modules/auth/services/session-client";
import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/schemas/auth-schemas";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/store";
import { BiometricLoginButton } from "@/modules/auth/components/biometric-login-button";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: isDev ? "GTF-1042" : "",
      password: isDev ? "password123" : "",
      rememberMe: true,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerMessage(null);
    try {
      const session = await loginWithMockApi(values.identifier, values.password, values.rememberMe);
      dispatch(setSession(session));
      persistSession(session, values.rememberMe);
      setServerMessage("Session created. Redirecting to dashboard.");
      if (session.role === "manager") {
        router.push("/dashboard/manager");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setServerMessage(err.message || "Invalid credentials. Try 'password123'.");
    }
  }

  return (
    <form className="flex w-full flex-col gap-6 rounded-[24px] bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
          Secure workspace
        </p>
        <h2 className="text-[28px] font-normal leading-tight text-slate-900">
          Sign in to Report Manager
        </h2>
        <p className="mt-3 text-sm font-normal leading-relaxed text-slate-500">
          Secure access for employee reports and<br />offline-ready daily submissions.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-bold text-primary">Quick Login (Demo):</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue("identifier", "MGR-1001");
              setValue("password", "password123");
            }}
            className="flex flex-col cursor-pointer items-start rounded-lg border border-primary/20 bg-white p-3 text-left transition-colors hover:bg-primary/5 shadow-sm"
          >
            <span className="text-sm font-bold text-slate-900">Manager Role</span>
            <span className="mt-1   text-xs text-slate-500">MGR-1001</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("identifier", "GTF-1042");
              setValue("password", "password123");
            }}
            className="flex flex-col cursor-pointer items-start rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:bg-slate-50 shadow-sm"
          >
            <span className="text-sm font-bold text-slate-900">Employee Role</span>
            <span className="mt-1   text-xs text-slate-500">GTF-1042</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-bold text-slate-900" htmlFor="identifier">
            Employee ID or email
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="h-5 w-5 stroke-[1.5]" />
            </div>
            <input
              id="identifier"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              {...register("identifier")}
            />
          </div>
          {errors.identifier ? (
            <p className="mt-1 text-sm font-medium text-red-500">{errors.identifier.message}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900" htmlFor="password">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-11 text-sm font-medium text-slate-900 outline-none transition-colors tracking-widest placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 stroke-[1.5]" />
              ) : (
                <Eye className="h-5 w-5 stroke-[1.5]" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-sm font-medium text-red-500">{errors.password.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center gap-2.5">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <input type="checkbox" className="peer sr-only" {...register("rememberMe")} />
            <div className="h-5 w-5 rounded-md border-2 border-slate-300 bg-white transition-colors group-hover:border-[#2563EB] peer-checked:border-[#2563EB] peer-checked:bg-[#2563EB]"></div>
            <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity stroke-[3] peer-checked:opacity-100" />
          </div>
          <span className="text-sm font-medium text-slate-500">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-sm font-bold text-[#2563EB] transition-colors hover:text-blue-700">
          Forgot password?
        </Link>
      </div>

      {serverMessage ? (
        <p className={`rounded-md px-3 py-2 text-sm font-semibold ${serverMessage.includes("Invalid") || serverMessage.includes("failed") || serverMessage.includes("required") || serverMessage.includes("least")
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
          }`}>
          {serverMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0D6EFD] text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
      >
        <Lock className="h-4 w-4 stroke-[2.5]" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <BiometricLoginButton />

      <div className="text-center text-sm font-medium text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-[#2563EB] hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
