"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-xl border border-border bg-muted/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Secure workspace
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-card-foreground">
          Sign in to Report Manager
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Secure access for employee reports and offline-ready daily submissions.
        </p>
        <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <p className="mb-2 font-semibold text-primary">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-foreground">Manager</span><br />
              ID: <span className="font-mono text-foreground">MGR-1001</span><br />
              Pass: <span className="font-mono text-foreground">password123</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Employee</span><br />
              ID: <span className="font-mono text-foreground">GTF-1042</span><br />
              Pass: <span className="font-mono text-foreground">password123</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="identifier">
          Employee ID or email
        </label>
        <input
          id="identifier"
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          {...register("identifier")}
        />
        {errors.identifier ? (
          <p className="mt-1 text-sm text-danger">{errors.identifier.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground" htmlFor="password">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="h-11 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="h-4 w-4" {...register("rememberMe")} />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-semibold text-primary">
          Forgot password?
        </Link>
      </div>
      {serverMessage ? (
        <p className={`rounded-md px-3 py-2 text-sm font-semibold ${serverMessage.includes("Invalid") || serverMessage.includes("failed") || serverMessage.includes("required") || serverMessage.includes("least")
          ? "bg-red-100 text-red-700"
          : "bg-success-light text-success"
          }`}>
          {serverMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <BiometricLoginButton />

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
