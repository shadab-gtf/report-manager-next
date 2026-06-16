const encoder = new TextEncoder();
const SECRET_KEY = process.env.SESSION_SECRET || "default_secret_key_change_me_in_production_at_least_32_bytes";

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Sign a data string and return "data.signature"
 */
export async function signToken(data: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  
  // Base64URL encoding
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
    
  return `${data}.${signatureBase64}`;
}

/**
 * Verify token "data.signature" and return data if valid, or null if invalid
 */
export async function verifyToken(token: string): Promise<string | null> {
  if (!token) {
    return null;
  }
  
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  
  const [data, signatureBase64] = parts;
  const key = await getHmacKey();
  
  try {
    // Reconstruct Uint8Array from base64url
    const binarySignature = atob(signatureBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const signatureBytes = new Uint8Array(binarySignature.length);
    for (let i = 0; i < binarySignature.length; i++) {
      signatureBytes[i] = binarySignature.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(data)
    );
    
    return isValid ? data : null;
  } catch (error) {
    return null;
  }
}
