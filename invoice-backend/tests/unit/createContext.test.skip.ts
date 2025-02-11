// // import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
// // import {
// //   createContext,
// //   verifyTokenAndGetEmail,
// // } from "../../src/GraphQL/createContext";
// // import jwt from "jsonwebtoken";
// // import jwksClient from "jwks-rsa";
// // import { IUserRepo } from "@/repositories/userRepo";
// // import { UserService } from "@/services/user.service";
// // import { MockProxy, mock } from "vitest-mock-extended";

// // // Mock jwks-rsa client
// // vi.mock("jwks-rsa", () => {
// //   return {
// //     __esModule: true,
// //     default: vi.fn().mockReturnValue({
// //       getSigningKey: vi.fn(),
// //     }),
// //   };
// // });

// // // Mock jsonwebtoken
// // vi.mock("jsonwebtoken", () => ({
// //   __esModule: true,
// //   default: {
// //     decode: vi.fn(),
// //     verify: vi.fn(),
// //   },
// // }));

// // describe("createContext", () => {
// //   let req: any;
// //   let connection: any;
// //   let mockGetSigningKey: any;

// //   let userRepoMock: MockProxy<IUserRepo>;
// //   let userService: UserService;

// //   beforeEach(() => {
// //     req = { headers: {} };
// //     connection = null;
// //     const client = jwksClient({ jwksUri: "http://test.com" });
// //     mockGetSigningKey = client.getSigningKey;
// //     userRepoMock = mock<IUserRepo>();
// //     userService = new UserService(userRepoMock);

// //     vi.mock("../../src/GraphQL/createContext", () => ({
// //       verifyTokenAndGetEmail: vi.fn(),
// //       createContext: vi.fn(),
// //     }));
// //   });

// //   it("returns username when valid token is provided", async () => {
// //     // req.headers.authorization = "Bearer valid.token.here";

// //     // // Mock jwt.decode
// //     // (jwt.decode as Mock).mockReturnValue({
// //     //   header: { kid: "test-kid" },
// //     // });

// //     // // Mock getSigningKey
// //     // mockGetSigningKey.mockImplementation(
// //     //   (kid: string, callback: (err: any, key: any) => void) => {
// //     //     callback(null, {
// //     //       getPublicKey: () => "publicKey",
// //     //     });
// //     //   },
// //     // );

// //     // // Mock jwt.verify
// //     // (jwt.verify as Mock).mockReturnValue({
// //     //   "invoice-web-app/email": "user@example.com",
// //     //   sub: "user1",
// //     // });

// //     // userRepoMock.createUserWithAuth0.mockResolvedValue({
// //     //   id: "user1",
// //     //   name: "user",
// //     //   username: "user@example.com",
// //     //   role: "USER",
// //     // });

// //     (verifyTokenAndGetEmail as Mock).mockResolvedValue({
// //       email: "user@example.com",
// //       id: "user1",
// //       name: "user",
// //       role: "USER",
// //     });

// //     const context = await createContext({ req, connection });

// //     expect(context.user?.username).toBe("user@example.com");
// //   });

// //   it("returns null user when no authorization header is provided", async () => {
// //     const context = await createContext({ req, connection });
// //     expect(context.user).toBeNull();
// //   });

// //   it("returns null user when token verification fails", async () => {
// //     req.headers.authorization = "Bearer invalid.token.here";

// //     // Mock jwt.decode
// //     (jwt.decode as Mock).mockReturnValue({
// //       header: { kid: "test-kid" },
// //     });

// //     // Mock getSigningKey
// //     mockGetSigningKey.mockImplementation(
// //       (kid: string, callback: (err: any, key: any) => void) => {
// //         callback(null, {
// //           getPublicKey: () => "publicKey",
// //         });
// //       },
// //     );

// //     // Mock jwt.verify to throw error
// //     (jwt.verify as Mock).mockImplementation(() => {
// //       throw new Error("Invalid token");
// //     });

// //     const context = await createContext({ req, connection });

// //     expect(context.user).toBeNull();
// //   });
// // });

// // tests/context.test.ts

// import { describe, it, expect, beforeEach, vi } from "vitest";
// import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
// import jwksClient, { SigningKey } from "jwks-rsa";
// import { PubSub } from "graphql-subscriptions";

// // Import the functions under test.
// import { verifyTokenAndGetEmail, createContext } from "@/GraphQL/createContext";
// // Import the container and TYPES to stub container resolution.
// import container from "@/config/inversify.config";
// import TYPES from "@/constants/identifiers";

// // --- Helper types for dummy services ---
// type DummyUser = {
//   id: string;
//   name: string;
//   username: string;
//   role: "USER" | "ADMIN";
// };

// const dummyUser: DummyUser = {
//   id: "123",
//   name: "Test User",
//   username: "user@example.com",
//   role: "ADMIN",
// };

// // --- Mocks and stubs ---

// // Stub for jwksClient and its getSigningKey method.
// const dummyPublicKey = "dummyPublicKey";

// const getSigningKeyStub = vi.fn(
//   (kid: string, callback: (err: Error | null, key?: SigningKey) => void) => {
//     // For testing purposes, we assume the key is always found.
//     const fakeKey: SigningKey = {
//       getPublicKey: () => dummyPublicKey,
//     } as SigningKey;
//     callback(null, fakeKey);
//   },
// );

// // Override the jwksClient to return an object with our stub.
// vi.mock("jwks-rsa", () => {
//   return {
//     default: (opts: any) => ({
//       getSigningKey: getSigningKeyStub,
//     }),
//   };
// });

// // Mock the jsonwebtoken methods.
// vi.mock("jsonwebtoken", () => {
//   return {
//     // We use vi.fn() so we can change the behavior in individual tests.
//     decode: vi.fn(),
//     verify: vi.fn(),
//   };
// });

// // We also need to stub container.child creation and service resolution.
// const dummyInvoiceService = {
//   /* add dummy methods if needed */
// };
// const dummyUserService = {
//   // Simulate a lookup that returns null so that a new user is created.
//   getUserSafely: vi.fn(async (id: string) => null),
//   createUserWithAuth0: vi.fn(async (userData: any) => {
//     return { ...dummyUser, ...userData };
//   }),
// };
// const dummyPubSub = new PubSub();

// // Create a fake child container that mimics the Inversify container API.
// const fakeChildContainer = {
//   bind: vi.fn().mockReturnThis(),
//   toConstantValue: vi.fn().mockReturnThis(),
//   get: vi.fn((identifier: symbol | string) => {
//     if (identifier === TYPES.InvoiceService) return dummyInvoiceService;
//     if (identifier === TYPES.UserService) return dummyUserService;
//     if (identifier === TYPES.PubSub) return dummyPubSub;
//     if (identifier === TYPES.UserContext) return dummyUser;
//     throw new Error(`Unknown dependency: ${identifier.toString()}`);
//   }),
// };

// // Stub the container.createChild method.
// vi.spyOn(container, "createChild").mockReturnValue(fakeChildContainer as any);

// // Reset mocks before each test.
// beforeEach(() => {
//   vi.clearAllMocks();
//   // Clear jsonwebtoken mocks
//   (jwt.decode as any).mockReset();
//   (jwt.verify as any).mockReset();
//   getSigningKeyStub.mockClear();
//   dummyUserService.getUserSafely.mockClear();
//   dummyUserService.createUserWithAuth0.mockClear();
// });

// describe("verifyTokenAndGetEmail", () => {
//   const options = {
//     audience: "https://invoice-web-app/",
//     issuer: "https://dev-n4e4qk7s3kbzusrs.us.auth0.com/",
//     algorithms: ["RS256"],
//   };

//   it("should verify a valid token and return user info", async () => {
//     const token = "validToken";

//     // Stub jwt.decode to return a header with a kid.
//     (jwt.decode as any).mockReturnValue({
//       header: { kid: "dummyKid" },
//     });

//     // Stub jwt.verify to return a payload with the custom claim.
//     const payload: JwtPayload = {
//       sub: dummyUser.id,
//       name: dummyUser.name,
//       // Custom claim: note the namespace is "invoice-web-app/" as in the implementation.
//       "invoice-web-app/email": dummyUser.username,
//       role: dummyUser.role,
//     };
//     (jwt.verify as any).mockReturnValue(payload);

//     const result = await verifyTokenAndGetEmail(token, options);
//     expect(result).toEqual({
//       id: dummyUser.id,
//       name: dummyUser.name,
//       role: dummyUser.role,
//       username: dummyUser.username,
//     });

//     // Ensure that decode, getSigningKey, and verify were called.
//     expect(jwt.decode).toHaveBeenCalledWith(token, { complete: true });
//     expect(getSigningKeyStub).toHaveBeenCalledWith(
//       "dummyKid",
//       expect.any(Function),
//     );
//     expect(jwt.verify).toHaveBeenCalledWith(token, dummyPublicKey, options);
//   });

//   it("should throw an error if token does not contain a header with kid", async () => {
//     const token = "badToken";

//     // jwt.decode returns an object without a header.
//     (jwt.decode as any).mockReturnValue({});

//     await expect(verifyTokenAndGetEmail(token, options)).rejects.toThrow(
//       "Invalid token",
//     );
//   });

//   it("should throw an error if email claim is missing", async () => {
//     const token = "tokenMissingEmail";

//     (jwt.decode as any).mockReturnValue({
//       header: { kid: "dummyKid" },
//     });

//     const payload: JwtPayload = {
//       sub: dummyUser.id,
//       name: dummyUser.name,
//       // Missing the custom email claim.
//       role: dummyUser.role,
//     };
//     (jwt.verify as any).mockReturnValue(payload);

//     await expect(verifyTokenAndGetEmail(token, options)).rejects.toThrow(
//       "Email claim is missing or invalid",
//     );
//   });
// });

// describe("createContext", () => {
//   it("should return connection for subscription requests", async () => {
//     const fakeConnection = { some: "connectionData" };
//     const context = await createContext({ connection: fakeConnection } as any);
//     expect(context).toEqual({ connection: fakeConnection });
//   });

//   it("should create a context for HTTP requests with valid auth header", async () => {
//     const token = "validToken";
//     const req = { headers: { authorization: `Bearer ${token}` } };

//     // Stub jwt.decode and jwt.verify as before.
//     (jwt.decode as any).mockReturnValue({
//       header: { kid: "dummyKid" },
//     });

//     const payload: JwtPayload = {
//       sub: dummyUser.id,
//       name: dummyUser.name,
//       "invoice-web-app/email": dummyUser.username,
//       role: dummyUser.role,
//     };
//     (jwt.verify as any).mockReturnValue(payload);

//     // Simulate that no user exists initially so that createUserWithAuth0 is called.
//     dummyUserService.getUserSafely.mockResolvedValue(null);
//     dummyUserService.createUserWithAuth0.mockResolvedValue(dummyUser);

//     const context = await createContext({ req } as any);

//     expect(context.user).toEqual(dummyUser);
//     expect(context.invoiceService).toBe(dummyInvoiceService);
//     expect(context.userService).toBe(dummyUserService);
//     expect(context.pubsub).toBe(dummyPubSub);
//     // Also verify that container.createChild was used.
//     expect(container.createChild).toHaveBeenCalled();
//     // Verify that the user service methods were called.
//     expect(dummyUserService.getUserSafely).toHaveBeenCalledWith(dummyUser.id);
//     expect(dummyUserService.createUserWithAuth0).toHaveBeenCalledWith({
//       id: dummyUser.id,
//       name: dummyUser.name,
//       username: dummyUser.username,
//       role: dummyUser.role,
//     });
//   });

//   it("should return a context with null user if no auth header is provided", async () => {
//     const req = { headers: {} };
//     const context = await createContext({ req } as any);
//     expect(context).toEqual({ user: null, container });
//   });

//   it("should return a context with null user if token verification fails", async () => {
//     const token = "invalidToken";
//     const req = { headers: { authorization: `Bearer ${token}` } };

//     // Force jwt.decode to return invalid value.
//     (jwt.decode as any).mockReturnValue(null);

//     const context = await createContext({ req } as any);
//     expect(context).toEqual({ user: null, container });
//   });
// });
