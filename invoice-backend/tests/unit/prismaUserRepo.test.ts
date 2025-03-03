import "reflect-metadata";
import { beforeEach, describe, expect, test, vi } from "vitest";
import prisma from "../../libs/__mocks__/prisma";
import { DatabaseConnectionMock } from "./database.connection.mock";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaUserRepository } from "@/repositories/implementations/prismaUserRepo";
import { UserEntity, User, UserIdAndRole } from "@/constants/types";
import { DatabaseConnection } from "@/database/prisma.database.connection";

vi.mock("../../libs/prisma");

const mockUserArgs: UserEntity = {
  name: "John Doe",
  username: "johndoe",
  passwordHash: "hashedpassword123",
};

const mockUser: UserIdAndRole = {
  id: "1",
  name: "John Doe",
  username: "johndoe",
  role: "USER",
  passwordHash: "hashedpassword123",
};

beforeEach(() => {
  vi.clearAllMocks(); // Clear mocks before each test
});

const userRepo = new PrismaUserRepository(
  new DatabaseConnectionMock() as DatabaseConnection,
);

// Test suite for the PrismaUserRepo class
// describe("PrismaUserRepo", () => {
describe("findAllUsers", () => {
  test("should return all users", async () => {
    prisma.user.findMany.mockResolvedValue([mockUser as UserIdAndRole]);

    const users = await userRepo.getAllUsers();
    expect(users).toStrictEqual([mockUser]);
  });

  test("should return an empty array if no users are found", async () => {
    prisma.user.findMany.mockResolvedValue([]);

    const users = await userRepo.getAllUsers();

    expect(users).toStrictEqual([]);
  });

  test("should handle error when fetching all users", async () => {
    prisma.user.findMany.mockRejectedValue(new Error("Database error"));

    // const result = await ;

    expect(userRepo.getAllUsers()).rejects.toThrowError("Database error"); // Check that the error is returned as expected
  });
});

describe("findUserById", () => {
  test("should return user by ID", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser as User);

    const user = await userRepo.getUserById(1);
    expect(user).toEqual(mockUser);
  });

  test("should handle error when user not found", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("User not found", {
        code: "P2025",
        clientVersion: "5.19.0",
      }),
    );

    // @ts-expect-error - Testing for error
    await expect(userRepo.getUserById(8000)).rejects.toThrowError(
      /User not found/,
    );
  });

  test("should handle error when fetching user by ID fails", async () => {
    prisma.user.findUniqueOrThrow.mockRejectedValue(
      new Error("Failed to fetch user"),
    );

    await expect(userRepo.getUserById(1)).rejects.toThrowError(
      /Failed to fetch user/,
    ); // Check that the error is returned as expected
  });
});

describe("createUser", () => {
  test("should create a new user", async () => {
    prisma.user.create.mockResolvedValue(mockUser as UserIdAndRole);

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
      "Unique constraint failed on the fields: (`username`)",
    );
  });
});
