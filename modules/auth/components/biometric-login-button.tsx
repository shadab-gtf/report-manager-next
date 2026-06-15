"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getWebAuthnCapability,
  authenticateWithPasskey,
  registerPasskey,
  type WebAuthnCapability,
} from "@/modules/auth/services/webauthn-service";
import { persistSession } from "@/modules/auth/services/session-client";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/store";

/* ─── Types ──────────────────────────────────────────────────── */

type BiometricState =
  | "idle"
  | "authenticating"
  | "registering"
  | "success"
  | "error";

interface BiometricLoginButtonProps {
  /** Current identifier value from the login form */
  identifier: string;
  /** Current role value from the login form */
  role: "Employee" | "Manager";
}

/* ─── Icons (inline SVG to avoid extra dependencies) ─────────── */

function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}

function FaceIdIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 7V2h5" />
      <path d="M17 2h5v5" />
      <path d="M22 17v5h-5" />
      <path d="M7 22H2v-5" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" />
      <path d="M12 13v2" />
      <path d="M8 16.5c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */

const BUTTON_BASE =
  "relative flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const BUTTON_VARIANT: Record<BiometricState, string> = {
  idle: "border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/[0.12] hover:border-primary/30 active:scale-[0.98]",
  authenticating:
    "border-primary/30 bg-primary/[0.08] text-primary cursor-wait",
  registering:
    "border-primary/30 bg-primary/[0.08] text-primary cursor-wait",
  success:
    "border-success/30 bg-success/[0.08] text-success cursor-default",
  error:
    "border-danger/20 bg-danger/[0.06] text-danger hover:bg-danger/[0.10] active:scale-[0.98]",
};

/* ─── Component ──────────────────────────────────────────────── */

export function BiometricLoginButton({
  identifier,
  role,
}: BiometricLoginButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [capability, setCapability] = useState<WebAuthnCapability>({
    supported: false,
    hasCredential: false,
  });
  const [state, setState] = useState<BiometricState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* Check capability on mount (client-only) */
  useEffect(() => {
    setCapability(getWebAuthnCapability());
  }, []);

  /* ─── Authenticate with stored passkey ──────────────────── */
  const handleAuthenticate = useCallback(async () => {
    setState("authenticating");
    setErrorMessage(null);

    try {
      const { session } = await authenticateWithPasskey();
      dispatch(setSession(session));
      persistSession(session, true);
      setState("success");
      router.push(session.role === "Manager" ? "/team" : "/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Biometric authentication failed.";
      setErrorMessage(message);
      setState("error");
    }
  }, [dispatch, router]);

  /* ─── Register a new passkey ────────────────────────────── */
  const handleRegister = useCallback(async () => {
    if (!identifier || identifier.length < 3) {
      setErrorMessage("Enter your Employee ID first, then set up biometrics.");
      setState("error");
      return;
    }

    setState("registering");
    setErrorMessage(null);

    try {
      await registerPasskey(identifier, role);
      setCapability(getWebAuthnCapability());
      setState("idle");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Biometric setup failed.";
      setErrorMessage(message);
      setState("error");
    }
  }, [identifier, role]);

  /* ─── Don't render when WebAuthn is unsupported ─────────── */
  if (!capability.supported) {
    return null;
  }

  const isProcessing = state === "authenticating" || state === "registering";
  const hasCredential = capability.hasCredential;

  /* ─── Choose icon based on platform ─────────────────────── */
  const isApple =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod|macintosh/i.test(navigator.userAgent) &&
    "ontouchend" in document;

  const BiometricIcon = isApple ? FaceIdIcon : FingerprintIcon;

  return (
    <div className="grid gap-2">
      {/* ── Divider ── */}
      <div className="flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          {hasCredential ? "Quick sign in" : "Or use biometrics"}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* ── Action button ── */}
      <button
        type="button"
        disabled={isProcessing}
        aria-label={
          hasCredential
            ? "Sign in with biometrics"
            : "Set up biometric login"
        }
        className={`${BUTTON_BASE} ${BUTTON_VARIANT[state]}`}
        onClick={hasCredential ? handleAuthenticate : handleRegister}
      >
        {state === "success" ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <BiometricIcon className="h-5 w-5" />
        )}

        {/* ── Spinner overlay ── */}
        {isProcessing && (
          <span className="absolute right-4">
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}

        <span>
          {state === "authenticating" && "Verifying..."}
          {state === "registering" && "Setting up..."}
          {state === "success" && "Authenticated"}
          {state === "idle" &&
            (hasCredential
              ? "Sign in with Face ID / Fingerprint"
              : "Enable biometric login")}
          {state === "error" &&
            (hasCredential ? "Retry biometric login" : "Retry setup")}
        </span>
      </button>

      {/* ── Error feedback ── */}
      {errorMessage && (
        <p className="text-center text-xs text-danger" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
