"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getWebAuthnCapability,
  registerPasskey,
  removeStoredPasskey,
  type WebAuthnCapability,
} from "@/modules/auth/services/webauthn-service";
import {
  isBiometricEnabled,
  enableBiometric,
  disableBiometric,
} from "@/modules/auth/services/biometric-preferences";

/* ─── Types ──────────────────────────────────────────────────── */

type ToggleState = "idle" | "registering" | "disabling" | "error";

interface BiometricToggleProps {
  /** The employee ID of the currently authenticated user */
  employeeId: string;
}

/* ─── Icons ──────────────────────────────────────────────────── */

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

function ShieldCheckIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export function BiometricToggle({ employeeId }: BiometricToggleProps) {
  const [capability, setCapability] = useState<WebAuthnCapability>({
    supported: false,
    hasCredential: false,
  });
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<ToggleState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* Check capability and saved preference on mount */
  useEffect(() => {
    setCapability(getWebAuthnCapability());
    setEnabled(isBiometricEnabled());
  }, []);

  /* ─── Enable biometric: register passkey + save preference ── */
  const handleEnable = useCallback(async () => {
    setState("registering");
    setErrorMessage(null);

    try {
      await registerPasskey(employeeId);
      enableBiometric(employeeId);
      setEnabled(true);
      setCapability(getWebAuthnCapability());
      setState("idle");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to set up biometric login.";
      setErrorMessage(message);
      setState("error");
    }
  }, [employeeId]);

  /* ─── Disable biometric: remove passkey + clear preference ── */
  const handleDisable = useCallback(() => {
    setState("disabling");
    setErrorMessage(null);

    try {
      removeStoredPasskey();
      disableBiometric();
      setEnabled(false);
      setCapability(getWebAuthnCapability());
      setState("idle");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to disable biometric login.";
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (enabled) {
      handleDisable();
    } else {
      handleEnable();
    }
  }, [enabled, handleDisable, handleEnable]);

  /* Don't render if browser doesn't support WebAuthn */
  if (!capability.supported) {
    return null;
  }

  const isProcessing = state === "registering" || state === "disabling";

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
            enabled
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {enabled ? (
            <ShieldCheckIcon className="h-6 w-6" />
          ) : (
            <FingerprintIcon className="h-6 w-6" />
          )}
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Biometric Login
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {enabled
                  ? "Sign in using Face ID or fingerprint on this device."
                  : "Enable quick sign-in with Face ID or fingerprint."}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Toggle biometric login"
              disabled={isProcessing}
              onClick={handleToggle}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                enabled ? "bg-primary" : "bg-muted-foreground/25"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Processing state */}
          {isProcessing ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-primary">
              <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>
                {state === "registering"
                  ? "Setting up biometric..."
                  : "Removing biometric..."}
              </span>
            </div>
          ) : null}

          {/* Error */}
          {errorMessage ? (
            <p className="mt-3 text-xs text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
