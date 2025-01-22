import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createContext } from "../../src/GraphQL/createContext";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Mock jwks-rsa client
vi.mock("jwks-rsa", () => {
  return {
    __esModule: true,
    default: vi.fn().mockReturnValue({
      getSigningKey: vi.fn(),
    }),
  };
});

// Mock jsonwebtoken
vi.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    decode: vi.fn(),
    verify: vi.fn(),
  },
}));

describe("createContext", () => {
  let req: any;
  let connection: any;
  let mockGetSigningKey: any;

  beforeEach(() => {
    req = { headers: {} };
    connection = null;
    const client = jwksClient({ jwksUri: "http://test.com" });
    mockGetSigningKey = client.getSigningKey;
  });

  it("returns username when valid token is provided", async () => {
    req.headers.authorization = "Bearer valid.token.here";

    // Mock jwt.decode
    (jwt.decode as Mock).mockReturnValue({
      header: { kid: "test-kid" },
    });

    // Mock getSigningKey
    mockGetSigningKey.mockImplementation(
      (kid: string, callback: (err: any, key: any) => void) => {
        callback(null, {
          getPublicKey: () => "publicKey",
        });
      },
    );

    // Mock jwt.verify
    (jwt.verify as Mock).mockReturnValue({
      "invoice-web-app/email": "user@example.com",
    });

    const context = await createContext({ req, connection });

    expect(context.username).toBe("user@example.com");
  });

  it("returns null username when no authorization header is provided", async () => {
    const context = await createContext({ req, connection });
    expect(context.username).toBeNull();
  });

  it("returns null username when token verification fails", async () => {
    req.headers.authorization = "Bearer invalid.token.here";

    // Mock jwt.decode
    (jwt.decode as Mock).mockReturnValue({
      header: { kid: "test-kid" },
    });

    // Mock getSigningKey
    mockGetSigningKey.mockImplementation(
      (kid: string, callback: (err: any, key: any) => void) => {
        callback(null, {
          getPublicKey: () => "publicKey",
        });
      },
    );

    // Mock jwt.verify to throw error
    (jwt.verify as Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const context = await createContext({ req, connection });

    expect(context.username).toBeNull();
  });
});
