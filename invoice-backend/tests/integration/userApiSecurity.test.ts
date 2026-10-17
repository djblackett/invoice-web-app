import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { PrismaClient, Role } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync, randomUUID, type KeyObject } from "node:crypto";
import { createServer, type Server } from "node:http";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { createRequest } from "node-mocks-http";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type {
  InjectedQueryContext,
  UserIdAndRole,
} from "../../src/constants/types";

const userA = {
  id: "auth0|user-security-a",
  role: Role.USER,
  username: "a@example.test",
  name: "User A",
};
const userB = {
  id: "auth0|user-security-b",
  role: Role.USER,
  username: "b@example.test",
  name: "User B",
};
const admin = {
  id: "auth0|user-security-admin",
  role: Role.ADMIN,
  username: "admin@example.test",
  name: "Admin",
};
const demo = {
  id: "demoId",
  role: Role.USER,
  username: "demo-user@example.com",
  name: "demo-user",
};
const list = "{ allUsers { id username } }";
const profile = "query($id: String!) { getUserById(id: $id) { id username } }";
const create =
  'mutation { createUser(name: "Unrelated", username: "unrelated@example.test", password: "password123") { id username } }';

// Exercise real JWT verification, context/DI, GraphQL, services and repositories.
// Every database operation targets a generated schema on an explicitly supplied DB.
describe("legacy User API security", () => {
  const schemaName = `user_security_${randomUUID().replaceAll("-", "")}`;
  let db: PrismaClient;
  let jwks: Server | undefined;
  let privateKey: KeyObject;
  let issuer: string;
  let server: ApolloServer<InjectedQueryContext>;
  let createContext: typeof import("../../src/GraphQL/createContext").createContext;

  beforeAll(async () => {
    const suppliedUrl = process.env["DATABASE_URL"];
    if (!suppliedUrl)
      throw new Error(
        "User security tests require an explicit disposable PostgreSQL DATABASE_URL",
      );
    const url = new URL(suppliedUrl);
    if (!["postgres:", "postgresql:"].includes(url.protocol))
      throw new Error("PostgreSQL required");
    url.searchParams.set("schema", schemaName);
    const schemaUrl = url.toString();
    db = new PrismaClient({ datasourceUrl: schemaUrl });
    execFileSync("npx", ["--no-install", "prisma", "migrate", "deploy"], {
      env: { ...process.env, DATABASE_URL: schemaUrl },
      stdio: "pipe",
    });
    const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
    privateKey = keys.privateKey;
    const publicJwk = keys.publicKey.export({ format: "jwk" });
    jwks = createServer((_req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          keys: [
            {
              ...publicJwk,
              kid: "user-security-key",
              alg: "RS256",
              use: "sig",
            },
          ],
        }),
      );
    });
    await new Promise<void>((resolve) => jwks!.listen(0, "127.0.0.1", resolve));
    const address = jwks.address();
    if (!address || typeof address === "string")
      throw new Error("JWKS listener unavailable");
    issuer = `http://127.0.0.1:${address.port}/`;
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production"); // Never use the legacy test ADMIN shortcut.
    vi.stubEnv("DEMO_MODE", "true");
    vi.stubEnv("DATABASE_URL", schemaUrl);
    vi.stubEnv("DOMAIN", issuer);
    vi.stubEnv("AUDIENCE", "urn:user-security");
    ({ createContext } = await vi.importActual<
      typeof import("../../src/GraphQL/createContext")
    >("../../src/GraphQL/createContext"));
    const { default: container } = await vi.importActual<
      typeof import("../../src/config/inversify.config")
    >("../../src/config/inversify.config");
    const { default: TYPES } = await vi.importActual<
      typeof import("../../src/constants/identifiers")
    >("../../src/constants/identifiers");
    container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(db);
    const { default: typeDefs } = await vi.importActual<
      typeof import("../../src/GraphQL/typeDefs")
    >("../../src/GraphQL/typeDefs");
    const { getResolvers } = await vi.importActual<
      typeof import("../../src/resolvers")
    >("../../src/resolvers");
    server = new ApolloServer<InjectedQueryContext>({
      typeDefs,
      resolvers: getResolvers(),
    });
    await server.start();
  });

  beforeEach(async () => {
    await db.invoice.deleteMany();
    await db.user.deleteMany();
    await db.user.createMany({ data: [userA, userB, admin, demo] });
    // A denied user deletion must also preserve invoices and their cascade history.
    await db.invoice.create({
      data: {
        id: "US1001",
        createdById: userB.id,
        clientName: "Private B",
        createdAt: "2026-10-01",
        paymentDue: "2026-10-15",
        description: "Private fixture",
        paymentTerms: 14,
        clientEmail: userB.username,
        status: "pending",
        total: 100,
        revisions: {
          create: {
            id: "user-security-revision",
            revisionNumber: 1,
            createdById: userB.id,
            changeType: "create",
            snapshot: { clientName: "Private B" },
          },
        },
      },
    });
  });

  afterAll(async () => {
    try {
      await server?.stop();
      if (db) {
        try {
          await db.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
          );
        } finally {
          await db.$disconnect();
        }
      }
    } finally {
      if (jwks)
        await new Promise<void>((resolve, reject) =>
          jwks!.close((error) => (error ? reject(error) : resolve())),
        );
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  function token(user: UserIdAndRole) {
    return jwt.sign(
      {
        sub: user.id,
        name: user.name,
        "invoice-web-app/email": user.username,
        "invoice-web-app/roles": user.role === "ADMIN" ? ["Admin"] : [],
      },
      privateKey,
      {
        algorithm: "RS256",
        keyid: "user-security-key",
        issuer,
        audience: "urn:user-security",
        expiresIn: "5m",
      },
    );
  }
  function context(user: UserIdAndRole | "demo" | null) {
    return createContext({
      req: createRequest<Request>({
        headers: {
          authorization:
            user === "demo"
              ? "Bearer demo-token"
              : user
                ? `Bearer ${token(user)}`
                : "",
        },
      }),
    });
  }
  async function execute(
    user: UserIdAndRole | "demo" | null,
    query: string,
    variables: Record<string, unknown> = {},
  ) {
    const response = await server.executeOperation(
      { query, variables },
      { contextValue: await context(user) },
    );
    if (response.body.kind !== "single")
      throw new Error("Expected single GraphQL response");
    return response.body.singleResult;
  }
  async function state() {
    return {
      users: await db.user.findMany({ orderBy: { id: "asc" } }),
      invoices: await db.invoice.findMany({ orderBy: { id: "asc" } }),
      revisions: await db.invoiceRevision.findMany({ orderBy: { id: "asc" } }),
    };
  }
  function codes(result: Awaited<ReturnType<typeof execute>>) {
    return result.errors?.map((error) => error.extensions?.["code"]);
  }

  for (const actor of [userA, "demo"] as const) {
    const label = actor === "demo" ? "Demo" : "USER A";
    it(`${label} cannot enumerate unrelated users`, async () => {
      const before = await state();
      const result = await execute(actor, list);
      expect(result.data?.["allUsers"]).toBeNull();
      expect(codes(result)).toEqual(["FORBIDDEN"]);
      expect(await state()).toEqual(before);
    });
    it(`${label} cannot distinguish foreign and missing profiles`, async () => {
      const before = await state();
      const foreign = await execute(actor, profile, { id: userB.id });
      const missing = await execute(actor, profile, { id: "auth0|missing" });
      for (const result of [foreign, missing]) {
        expect(result.data?.["getUserById"]).toBeNull();
        expect(codes(result)).toEqual(["NOT_FOUND"]);
        expect(result.errors?.[0]?.message).toBe("User not found");
      }
      expect(await state()).toEqual(before);
    });
    it(`${label} can read their own permitted metadata`, async () => {
      const own = actor === "demo" ? demo : actor;
      const result = await execute(actor, profile, { id: own.id });
      expect(result.errors).toBeUndefined();
      expect(result.data?.["getUserById"]).toEqual({
        id: own.id,
        username: own.username,
      });
    });
    it(`${label} cannot create an unrelated user`, async () => {
      const before = await state();
      const result = await execute(actor, create);
      expect(result.data?.["createUser"]).toBeNull();
      expect(codes(result)).toEqual(["FORBIDDEN"]);
      expect(await state()).toEqual(before);
    });
    for (const operation of ["deleteUsers", "deleteUsersKeepAdmins"]) {
      it(`${label} cannot invoke ${operation} or its direct service path`, async () => {
        const before = await state();
        expect(
          codes(
            await execute(actor, `mutation { ${operation} { acknowledged } }`),
          ),
        ).toEqual(["FORBIDDEN"]);
        const svc = (await context(actor)).userService!;
        await expect(
          operation === "deleteUsers"
            ? svc.deleteUsers()
            : svc.deleteUsersKeepAdmin(),
        ).rejects.toMatchObject({ name: "ForbiddenException" });
        expect(await state()).toEqual(before);
      });
    }
    it(`${label} cannot bypass query/creation checks through UserService`, async () => {
      const before = await state();
      const svc = (await context(actor)).userService!;
      await expect(svc.getUsers()).rejects.toMatchObject({
        name: "ForbiddenException",
      });
      await expect(svc.getUser(userB.id)).rejects.toMatchObject({
        name: "NotFoundException",
      });
      await expect(svc.getUserByIdSafely(userB.id)).rejects.toMatchObject({
        name: "NotFoundException",
      });
      await expect(
        svc.createUser({
          name: "Attack",
          username: "attack@example.test",
          password: "password123",
        }),
      ).rejects.toMatchObject({ name: "ForbiddenException" });
      expect(await state()).toEqual(before);
    });
  }

  for (const query of [
    list,
    profile,
    create,
    "mutation { deleteUsers { acknowledged } }",
    "mutation { deleteUsersKeepAdmins { acknowledged } }",
  ]) {
    it(`rejects unauthenticated ${query.split(" ")[0]} ${query.includes("allUsers") ? "directory" : query}`, async () => {
      const before = await state();
      expect(codes(await execute(null, query, { id: userB.id }))).toEqual([
        "UNAUTHORIZED",
      ]);
      expect(await state()).toEqual(before);
    });
  }

  it("ADMIN retains directory and profile oversight", async () => {
    const result = await execute(admin, list);
    expect(result.errors).toBeUndefined();
    expect(result.data?.["allUsers"]).toHaveLength(4);
    expect(
      (await execute(admin, profile, { id: userB.id })).data?.["getUserById"],
    ).toEqual({ id: userB.id, username: userB.username });
  });
  it("ADMIN retains creation of ordinary USER accounts", async () => {
    const result = await execute(admin, create);
    expect(result.errors).toBeUndefined();
    expect(
      await db.user.findUnique({
        where: { username: "unrelated@example.test" },
      }),
    ).toMatchObject({ role: "USER" });
  });
  it("HTTP user operations retain the stored ADMIN role for an existing Auth0 subject", async () => {
    await db.user.update({
      where: { id: userA.id },
      data: { role: Role.ADMIN },
    });
    expect((await context(userA)).user).toMatchObject({ role: Role.ADMIN });
    expect((await execute(userA, list)).errors).toBeUndefined();
    expect((await execute(userA, create)).errors).toBeUndefined();
    expect(
      (
        await execute(
          userA,
          "mutation { deleteUsersKeepAdmins { acknowledged } }",
        )
      ).errors,
    ).toBeUndefined();
    expect(await db.user.count()).toBe(2);
  });
  for (const operation of ["deleteUsers", "deleteUsersKeepAdmins"]) {
    it(`ADMIN retains ${operation}`, async () => {
      const result = await execute(
        admin,
        `mutation { ${operation} { acknowledged } }`,
      );
      expect(result.errors).toBeUndefined();
      expect(result.data?.[operation]).toEqual({ acknowledged: true });
      expect(await db.user.count()).toBe(operation === "deleteUsers" ? 0 : 1);
      if (operation === "deleteUsersKeepAdmins")
        expect(
          await db.user.findUnique({ where: { id: admin.id } }),
        ).not.toBeNull();
    });
  }
  for (const extra of ['role: "ADMIN"', `id: "${userB.id}"`]) {
    it(`GraphQL rejects caller-supplied ${extra.split(":")[0]} before creating or overwriting users`, async () => {
      const before = await state();
      const result = await execute(
        userA,
        create.replace('name: "Unrelated"', `name: "Unrelated", ${extra}`),
      );
      expect(codes(result)).toEqual(["GRAPHQL_VALIDATION_FAILED"]);
      expect(await state()).toEqual(before);
    });
  }
  it("direct legacy creation ignores injected IDs and roles even for ADMIN", async () => {
    const before = await db.user.findUnique({ where: { id: userB.id } });
    const svc = (await context(admin)).userService!;
    const input = {
      name: "Allowed ordinary account",
      username: "allowed@example.test",
      password: "password123",
      id: userB.id,
      role: "ADMIN",
    };
    const created = await svc.createUser(input);
    expect(created.id).not.toBe(userB.id);
    expect(
      await db.user.findUnique({ where: { id: created.id! } }),
    ).toMatchObject({ role: "USER" });
    expect(await db.user.findUnique({ where: { id: userB.id } })).toEqual(
      before,
    );
  });

  for (const role of [Role.USER, Role.ADMIN]) {
    it(`first Auth0 ${role} login provisions the verified subject without createUser`, async () => {
      const first = {
        id: `auth0|first-${role}`,
        role,
        username: `first-${role}@example.test`,
        name: "First login",
      };
      const ctx = await context(first);
      expect(ctx.user).toMatchObject(first);
      expect(
        await db.user.findUnique({ where: { id: first.id } }),
      ).toMatchObject(first);
      expect(
        (await execute(first, profile, { id: first.id })).errors,
      ).toBeUndefined();
      expect(await db.user.count()).toBe(5);
    });
  }
  it("repeat and concurrent Auth0 provisioning preserve existing metadata and stored roles", async () => {
    const first = {
      id: "auth0|concurrent-first",
      role: Role.USER,
      username: "concurrent@example.test",
      name: "Original",
    };
    const contexts = await Promise.all(
      Array.from({ length: 5 }, () => context(first)),
    );
    for (const ctx of contexts) expect(ctx.user).toMatchObject(first);
    await db.user.update({
      where: { id: first.id },
      data: { role: "ADMIN", name: "Stored name" },
    });
    const before = await state();
    const repeated = await context({
      ...first,
      name: "Changed claim",
      username: "changed@example.test",
    });
    expect(repeated.user).toMatchObject({
      id: first.id,
      role: "ADMIN",
      name: "Stored name",
      username: first.username,
    });
    expect(await state()).toEqual(before);
    expect(await db.user.count({ where: { id: first.id } })).toBe(1);
  });
  it("Auth0 provisioning refuses another subject and derives role/profile from bound identity", async () => {
    const before = await state();
    const svc = (await context(userA)).userService!;
    await expect(
      svc.createUserWithAuth0({ ...userB, role: "ADMIN" }),
    ).rejects.toMatchObject({ name: "ForbiddenException" });
    expect(
      await svc.createUserWithAuth0({
        ...userA,
        role: "ADMIN",
        name: "Injected",
        username: userB.username,
      }),
    ).toMatchObject(userA);
    expect(await state()).toEqual(before);
  });
  it("Demo cannot provision real users through the Auth0 service path", async () => {
    const before = await state();
    await expect(
      (await context("demo")).userService!.createUserWithAuth0(userB),
    ).rejects.toMatchObject({ name: "ForbiddenException" });
    expect(await state()).toEqual(before);
  });
  it("initial self-provisioning ignores caller-supplied ADMIN role and another profile", async () => {
    const svc = (await context(userA)).userService!;
    await db.user.delete({ where: { id: userA.id } });
    const beforeB = await db.user.findUnique({ where: { id: userB.id } });
    expect(
      await svc.createUserWithAuth0({
        ...userA,
        role: "ADMIN",
        name: "Injected",
        username: userB.username,
      }),
    ).toMatchObject(userA);
    expect(await db.user.findUnique({ where: { id: userA.id } })).toMatchObject(
      userA,
    );
    expect(await db.user.findUnique({ where: { id: userB.id } })).toEqual(
      beforeB,
    );
    expect(await db.user.count()).toBe(4);
  });
  it("direct services reject unauthenticated callers and a Demo identity marked ADMIN", async () => {
    const ctx = await context("demo");
    const { UserService } = await vi.importActual<
      typeof import("../../src/services/user.service")
    >("../../src/services/user.service");
    const { default: TYPES } = await vi.importActual<
      typeof import("../../src/constants/identifiers")
    >("../../src/constants/identifiers");
    const before = await state();
    for (const identity of [
      null,
      { ...demo, role: Role.ADMIN, isDemo: true },
    ]) {
      const svc = new UserService(
        ctx.container!.get(TYPES.IUserRepo),
        identity,
        ctx.container!.get(TYPES.Logger),
      );
      const name = identity ? "ForbiddenException" : "UnauthorizedException";
      for (const action of [
        () => svc.getUsers(),
        () =>
          svc.createUser({
            name: "Attack",
            username: "attack@example.test",
            password: "password123",
          }),
        () => svc.deleteUsers(),
        () => svc.deleteUsersKeepAdmin(),
        () => svc.createUserWithAuth0(userB),
      ])
        await expect(action()).rejects.toMatchObject({ name });
      if (!identity) {
        await expect(svc.getUser(userA.id)).rejects.toMatchObject({ name });
        await expect(svc.getUserByIdSafely(userA.id)).rejects.toMatchObject({
          name,
        });
      } else {
        await expect(svc.getUserByIdSafely(userA.id)).rejects.toMatchObject({
          name: "NotFoundException",
        });
      }
    }
    expect(await state()).toEqual(before);
  });
  it("normal signed JWT cannot provision the dedicated Demo identity", async () => {
    await db.user.delete({ where: { id: demo.id } });
    const before = await state();
    expect((await context(demo)).user).toBeNull();
    expect(await state()).toEqual(before);
  });
  it("a new verified subject cannot overwrite another account via a matching email", async () => {
    const before = await state();
    expect(
      (await context({ ...userA, id: "auth0|different-subject" })).user,
    ).toBeNull();
    expect(await state()).toEqual(before);
  });
});
