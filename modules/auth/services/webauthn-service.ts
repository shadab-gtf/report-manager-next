import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import type { AuthSession } from "@/types/auth";

/* ─── Storage keys ───────────────────────────────────────────── */

const CREDENTIAL_STORE_KEY = "rm_webauthn_credential_id";
const REGISTERED_USER_KEY = "rm_webauthn_user";

/* ─── Types ──────────────────────────────────────────────────── */

export interface WebAuthnCapability {
  /** Browser supports the WebAuthn API */
  readonly supported: boolean;
  /** A credential was previously registered on this device */
  readonly hasCredential: boolean;
}

interface StoredUserInfo {
  identifier: string;
}

/* ─── Capability Detection ───────────────────────────────────── */

/**
 * Checks whether the current browser/device supports WebAuthn
 * and whether a passkey has already been registered.
 *
 * Safe to call on the server — returns `{ supported: false }`.
 */
export function getWebAuthnCapability(): WebAuthnCapability {
  if (typeof window === "undefined") {
    return { supported: false, hasCredential: false };
  }

  const supported = browserSupportsWebAuthn();
  const hasCredential = window.localStorage.getItem(CREDENTIAL_STORE_KEY) !== null;

  return { supported, hasCredential };
}

/* ─── Mock Relying Party Helpers ─────────────────────────────── */

/**
 * Simulates the backend `POST /api/auth/webauthn/generate-registration-options`
 * endpoint. Replace the body of this function with a real API call when ready.
 */
function generateMockRegistrationOptions(
  identifier: string,
): PublicKeyCredentialCreationOptionsJSON {
  return {
    challenge: btoa(crypto.getRandomValues(new Uint8Array(32)).toString()),
    rp: {
      name: "Report Manager",
      id: window.location.hostname,
    },
    user: {
      id: btoa(identifier),
      name: identifier,
      displayName: identifier,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },   // ES256
      { alg: -257, type: "public-key" }, // RS256
    ],
    timeout: 60_000,
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      requireResidentKey: false,
      userVerification: "required",
    },
    attestation: "none",
  };
}

/**
 * Simulates the backend `POST /api/auth/webauthn/generate-authentication-options`
 * endpoint. Replace the body with a real API call when ready.
 */
function generateMockAuthenticationOptions(
  credentialId: string,
): PublicKeyCredentialRequestOptionsJSON {
  return {
    challenge: btoa(crypto.getRandomValues(new Uint8Array(32)).toString()),
    rpId: window.location.hostname,
    timeout: 60_000,
    userVerification: "required",
    allowCredentials: [
      {
        id: credentialId,
        type: "public-key",
        transports: ["internal"],
      },
    ],
  };
}

/* ─── Public API ── */

/**
 * Registers a new platform authenticator (Face ID / fingerprint / PIN)
 * for the given user. Persists the credential ID to localStorage.
 *
 * Must be called from a direct user gesture (click handler).
 *
 * @throws Error if registration is cancelled or fails.
 */
export async function registerPasskey(
  identifier: string,
): Promise<void> {
  const options = generateMockRegistrationOptions(identifier);

  const registration = await startRegistration({ optionsJSON: options });

  // Persist credential ID and user info for future authentications
  window.localStorage.setItem(CREDENTIAL_STORE_KEY, registration.id);
  window.localStorage.setItem(
    REGISTERED_USER_KEY,
    JSON.stringify({ identifier } satisfies StoredUserInfo),
  );
}

/**
 * Authenticates using a previously-registered platform credential.
 *
 * Returns the stored `AuthSession` on success.
 * Must be called from a direct user gesture (click handler).
 *
 * @throws Error if no credential is stored, or the user cancels.
 */
export async function authenticateWithPasskey(): Promise<{
  session: AuthSession;
}> {
  const credentialId = window.localStorage.getItem(CREDENTIAL_STORE_KEY);
  if (!credentialId) {
    throw new Error("No registered passkey found on this device.");
  }

  const storedUser = window.localStorage.getItem(REGISTERED_USER_KEY);
  if (!storedUser) {
    throw new Error("No registered user data found on this device.");
  }

  const { identifier } = JSON.parse(storedUser) as StoredUserInfo;

  const options = generateMockAuthenticationOptions(credentialId);

  await startAuthentication({ optionsJSON: options });

  const session: AuthSession = {
    employeeId: identifier.includes("@") ? "GTF-1042" : identifier,
    name: "Kuldeep",
    email: identifier.includes("@") ? identifier : "kuldeep.choudhary@gtftechnologies.com",
    reportingManager: "Saurabh Yadav",
    reportingManagerEmail: "saurabh.yadav@gtftechnologies.com",
  };

  return { session };
}

/**
 * Removes the stored passkey credential and associated user info.
 */
export function removeStoredPasskey(): void {
  window.localStorage.removeItem(CREDENTIAL_STORE_KEY);
  window.localStorage.removeItem(REGISTERED_USER_KEY);
}
