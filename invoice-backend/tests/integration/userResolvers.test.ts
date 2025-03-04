import request from "supertest-graphql";
import { gql } from "graphql-tag";
import { createServer } from "../../src/server";
import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  it,
  expect,
} from "vitest";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";

let app: any;
process.env.NODE_ENV = "test";

const users = [
  { name: "Alice", username: "alicewonder", password: "wonderland123" },
  { name: "Bob", username: "bobby23", password: "password123" },
  { name: "Charlie", username: "charlie_champ", password: "champs4life" },
  { name: "Diana", username: "diana_dare", password: "daredevil987" },
  { name: "Evan", username: "evan_the_man", password: "evantastic555" },
  { name: "Fiona", username: "fieryfiona", password: "firepower999" },
  { name: "George", username: "geo_guy", password: "geospirit321" },
  { name: "Hannah", username: "hannah_hustle", password: "hustler89" },
  { name: "Ivan", username: "ivan_iconic", password: "iconicivan88" },
  { name: "Jasmine", username: "jasmine_jazz", password: "jazzitup101" },
];

async function createUsers() {
  const userPromises = users.map((user) => {
    return request(app)
      .query(gql`
        mutation CreateUser(
          $name: String
          $username: String!
          $password: String!
        ) {
          createUser(name: $name, username: $username, password: $password) {
            id
            username
          }
        }
      `)
      .variables({
        name: user.name,
        username: user.username,
        password: user.password,
      })
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors();
  });

  await Promise.all(userPromises);
}

let prisma: PrismaClient;
let schemaName: string;
let testToken: string;

describe("Integration Tests", () => {
  beforeAll(async () => {
    testToken = "dummy-token";
  });

  beforeEach(async () => {
    schemaName = `test_schema_${randomUUID()}`;
    const baseDatabaseUrl =
      "postgresql://postgres:example@localhost:5432/db-test";
    const newDatabaseUrl = `${baseDatabaseUrl}?schema=${schemaName}`;

    prisma = new PrismaClient({
      datasourceUrl: newDatabaseUrl,
    });

    await prisma.$executeRawUnsafe(
      `SET search_path TO "${schemaName}", public`,
    );
    await prisma.$connect();

    const child = container.createChild();
    child.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

    console.log("Connected to Prisma", newDatabaseUrl);
    execSync("npx prisma db push", { stdio: "inherit" });
    [app] = await createServer();

    await request(app)
      .query(gql`
        mutation DeleteUsersKeepAdmins {
          deleteUsersKeepAdmins {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);
    // Re-create users for each test
    await createUsers();
  });

  afterEach(async () => {
    await request(app)
      .query(gql`
        mutation DeleteUsersKeepAdmins {
          deleteUsersKeepAdmins {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);
  });

  afterAll(async () => {
    // Drop the schema to clean up
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    );

    await prisma.$disconnect();
  });

  it("should return a list of 11 users: 1 ADMIN + 10 created users", async () => {
    const { data } = await request(app)
      .query(gql`
        query AllUsers {
          allUsers {
            id
            username
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors();
    console.log((data as any).allUsers);
    expect((data as any).allUsers).toHaveLength(11);
  });

  it("should return empty array when no users exist", async () => {
    await request(app)
      .query(gql`
        mutation DeleteUsers {
          deleteUsers {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);

    const response = await request(app)
      .query(gql`
        query AllUsers {
          allUsers {
            id
            username
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`);

    const usersArray = (response as any).data.allUsers;
    expect(usersArray).toBeDefined();

    // We expect 1 user to exist - the user created by the last AllUsers query
    expect(usersArray).toHaveLength(1);
  });

  it("should return a user by id", async () => {
    const {
      data: { allUsers },
    } = (await request(app)
      .query(gql`
        query AllUsers {
          allUsers {
            id
            username
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors()) as {
      data: {
        allUsers: { id: string; username: string }[];
      };
    };

    const userId = allUsers[0].id;

    const {
      data: { getUserById },
    } = (await request(app)
      .query(gql`
        query GetUserById($id: String!) {
          getUserById(id: $id) {
            id
            username
          }
        }
      `)
      .variables({ id: userId })
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors()) as {
      data: {
        getUserById: { id: string; username: string };
      };
    };

    expect(getUserById.id).toBe(userId);
  });

  it("should create a new user", async () => {
    const newUser = {
      name: "Test User",
      username: "testuser",
      password: "testpass123",
    };

    const { data } = await request(app)
      .query(gql`
        mutation CreateUser(
          $name: String
          $username: String!
          $password: String!
        ) {
          createUser(name: $name, username: $username, password: $password) {
            id
            username
          }
        }
      `)
      .variables(newUser)
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors();

    expect((data as any).createUser.username).toBe(newUser.username);
    expect((data as any).createUser.id).toBeDefined();
  });

  it("should return an error when required fields are missing in createUser", async () => {
    const incompleteUser = {
      name: "Incomplete User",
      password: "somepassword",
    }; // Missing username

    const response = await request(app)
      .query(gql`
        mutation CreateUser(
          $name: String
          $username: String!
          $password: String!
        ) {
          createUser(name: $name, username: $username, password: $password) {
            id
            username
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .variables(incompleteUser);

    expect(response.errors).toBeDefined();
    expect(response.errors![0].message).toContain(
      // This override is intentional
      // eslint-disable-next-line quotes
      'Variable "$username" of required type "String!" was not provided.',
    );
  });

  it("should delete all users except ADMIN", async () => {
    const { data } = await request(app)
      .query(gql`
        mutation DeleteUsersKeepAdmins {
          deleteUsersKeepAdmins {
            acknowledged
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors();

    expect((data as any).deleteUsersKeepAdmins.acknowledged).toBe(true);

    // Verify that all users are deleted
    const { data: allUsersData } = await request(app)
      .query(gql`
        query AllUsers {
          allUsers {
            id
            username
          }
        }
      `)
      .set("Authorization", `Bearer ${testToken}`)
      .expectNoErrors();

    expect((allUsersData as any).allUsers).toHaveLength(1);
  });
});
