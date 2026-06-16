"use client";

/* ─── Storage Keys ───────────────────────────────────────────── */

const BIOMETRIC_ENABLED_KEY = "rm_biometric_enabled";

/* ─── Types ──────────────────────────────────────────────────── */

interface BiometricPreference {
  /** Whether the user has explicitly enabled biometric login from their profile */
  readonly enabled: boolean;
  /** The employee ID of the user who enabled biometrics */
  readonly employeeId: string;
}

/* ─── Public API ─────────────────────────────────────────────── */

/**
 * Checks whether biometric login has been explicitly enabled by the user
 * via the profile toggle. This is the gate that decides whether the
 * biometric login button shows on the login screen.
 */
export function isBiometricEnabled(): boolean {
  if (typeof window === "undefined") return false;

  const stored = window.localStorage.getItem(BIOMETRIC_ENABLED_KEY);
  if (!stored) return false;

  try {
    const preference: BiometricPreference = JSON.parse(stored);
    return preference.enabled === true && Boolean(preference.employeeId);
  } catch {
    return false;
  }
}

/**
 * Returns the employee ID that has biometric enabled, or null if none.
 */
export function getBiometricEmployeeId(): string | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(BIOMETRIC_ENABLED_KEY);
  if (!stored) return null;

  try {
    const preference: BiometricPreference = JSON.parse(stored);
    return preference.enabled ? preference.employeeId : null;
  } catch {
    return null;
  }
}

/**
 * Enables biometric login for the given employee.
 * Must only be called from the profile page AFTER the user has
 * already authenticated with username + password.
 */
export function enableBiometric(employeeId: string): void {
  const preference: BiometricPreference = {
    enabled: true,
    employeeId,
  };
  window.localStorage.setItem(BIOMETRIC_ENABLED_KEY, JSON.stringify(preference));
}

/**
 * Disables biometric login and clears all stored passkey data.
 */
export function disableBiometric(): void {
  window.localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
}
