import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "@/lib/security/cookie-signer";

describe("Cryptographic Session Signer", () => {
  it("should successfully sign and verify a token", async () => {
    const employeeId = "GTF-1042";
    const signedToken = await signToken(employeeId);
    
    expect(signedToken).toContain(employeeId);
    expect(signedToken.split(".")).toHaveLength(2);

    const verified = await verifyToken(signedToken);
    expect(verified).toBe(employeeId);
  });

  it("should reject tampered tokens", async () => {
    const employeeId = "GTF-1042";
    const signedToken = await signToken(employeeId);
    
    // Attempt tampering with the payload
    const tamperedToken = signedToken.replace("GTF-1042", "GTF-1005");
    const verified = await verifyToken(tamperedToken);
    
    expect(verified).toBeNull();
  });

  it("should reject invalid token formats", async () => {
    const verified1 = await verifyToken("invalid-format-no-dots");
    const verified2 = await verifyToken("too.many.dots.in.token");
    const verified3 = await verifyToken("");
    
    expect(verified1).toBeNull();
    expect(verified2).toBeNull();
    expect(verified3).toBeNull();
  });
});
