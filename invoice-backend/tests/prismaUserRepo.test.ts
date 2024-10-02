import "reflect-metadata";
import { describe, expect, test, vi } from "vitest";
import prisma from "../libs/__mocks__/prisma";
import { DatabaseConnectionMock } from "./database.connection.mock";
import { IDatabaseConnection } from "../src/database/database.connection";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaUserRepo } from "../src/repositories/implementations/prismaUserRepo";
import {
  CreateUserArgsHashedPassword,
  LoggedInUser,
  ReturnedUser,
  User,
} from "../src/constants/types";

vi.mock("../libs/prisma");

const mockUserArgs: CreateUserArgsHashedPassword = {
  name: "John Doe",
  username: "johndoe",
  hashedPassword: "hashedpassword123",
};

const mockUser: ReturnedUser = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
};

const mockLoggedInUser: LoggedInUser = {
  id: 1,
  username: "johndoe",
};

beforeEach(() => {
  vi.clearAllMocks(); // Clear mocks before each test
});

const userRepo = new PrismaUserRepo(
  new DatabaseConnectionMock() as IDatabaseConnection,
);

// Test suite for the PrismaUserRepo class
// describe("PrismaUserRepo", () => {
describe("findAllUsers", () => {
  test("should return all users", async () => {
    prisma.user.findMany.mockResolvedValue([mockUser as User]);

    const users = await userRepo.findAllUsers();
    expect(users).toStrictEqual([mockUser]);
  });

  test("should return an empty array if no users are found", async () => {
    prisma.user.findMany.mockResolvedValue([]);

    const users = await userRepo.findAllUsers();

    expect(users).toStrictEqual([]);
  });

  test("should handle error when fetching all users", async () => {
    prisma.user.findMany.mockRejectedValue(new Error("Failed to fetch users"));

    // const result = await ;

    expect(userRepo.findAllUsers()).rejects.toThrowError(
      "Failed to fetch users",
    ); // Check that the error is returned as expected
  });
});

describe("findUserById", () => {
  test("should return user by ID", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser as User);

    const user = await userRepo.findUserById(1);
    expect(user).toEqual(mockUser);
  });

  test("should handle error when user not found", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("User not found", {
        code: "P2025",
        clientVersion: "5.19.0",
      }),
    );

    await expect(userRepo.findUserById(8000)).rejects.toThrowError(
      /User not found/,
    );
  });

  test("should handle error when fetching user by ID fails", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new Error("Failed to fetch user"),
    );

    await expect(userRepo.findUserById(1)).rejects.toThrowError(
      /Failed to fetch user/,
    ); // Check that the error is returned as expected
  });
});

describe("createUser", () => {
  test("should create a new user", async () => {
    prisma.user.create.mockResolvedValue(mockUser as User);

    const createdUser = await userRepo.createUser(mockUserArgs);
    expect(createdUser).toEqual(mockUser);
  });

  test("should handle error when creating user fails", async () => {
    prisma.user.create.mockRejectedValue(
      new PrismaClientKnownRequestError("Username already exists", {
        code: "P2002",
        clientVersion: "5.19.0",
      }),
    );

    await expect(userRepo.createUser(mockUserArgs)).rejects.toThrowError(
      /Username already exists/,
    );
  });
});

describe("loginUser", () => {
  test("should return user by username", async () => {
    // todo - why is this type conversion necessary?
    prisma.user.findUniqueOrThrow.mockResolvedValue(mockLoggedInUser as User);

    const user = await userRepo.loginUser("johndoe", "password123");
    expect(user).toEqual(mockLoggedInUser);
  });

  test("should handle error when user not found by username", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("Incorrect username or password", {
        code: "P2025",
        clientVersion: "5.19.0",
      }),
    );

    await expect(
      userRepo.loginUser("johndoe", "password123"),
    ).rejects.toThrowError(/Incorrect username or password/);
  });

  test("should handle error when login fails", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      userRepo.loginUser("johndoe", "password123"),
    ).rejects.toThrowError(/Database error/);
  });
});
// });
