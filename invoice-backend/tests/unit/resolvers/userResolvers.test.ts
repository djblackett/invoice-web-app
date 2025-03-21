import { MockProxy, mock } from "vitest-mock-extended";
import { getUserResolvers } from "../../../src/resolvers/userResolvers";
import { UserService } from "../../../src/services/user.service";
import { GraphQLError } from "graphql";
import { InternalServerException } from "../../../src/config/exception.config";
import {
  CreateUserDTO,
  InjectedQueryContext,
  UserIdAndRole,
} from "../../../src/constants/types";
import { beforeEach, describe, it, expect } from "vitest";

let userServiceMock: MockProxy<UserService>;
let userResolvers: ReturnType<typeof getUserResolvers>;
let mockContext: MockProxy<InjectedQueryContext>;

beforeEach(() => {
  userServiceMock = mock<UserService>();

  // Create a mock user if necessary
  const mockUser: UserIdAndRole = { id: "user1", role: "ADMIN", name: "Fred" };

  // Initialize the mock context with mocked services and user
  mockContext = mock<InjectedQueryContext>({
    user: mockUser,
    userService: userServiceMock,
  });

  userResolvers = getUserResolvers();
});

describe("Query.allUsers", () => {
  it("should return a list of users", async () => {
    const mockUsers = [
      { id: "1", name: "Alice", username: "alice" },
      { id: "2", name: "Bob", username: "bob" },
    ];

    userServiceMock.getUsers.mockResolvedValue(mockUsers);

    const result = await userResolvers.Query.allUsers(
      undefined,
      undefined,
      mockContext,
    );

    expect(result).toEqual(mockUsers);
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it("should handle no users", async () => {
    userServiceMock.getUsers.mockResolvedValue([]);
    const result = await userResolvers.Query.allUsers(null, null, mockContext);
    expect(result).toEqual([]);
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it("should handle internal server errors", async () => {
    userServiceMock.getUsers.mockRejectedValue(
      new InternalServerException("Internal server error"),
    );
    try {
      await userResolvers.Query.allUsers(null, null, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.createUser", () => {
  it("should create a new user", async () => {
    const args: CreateUserDTO = {
      name: "Charlie",
      username: "charlie",
      password: "password123",
    };

    const createdUser = {
      id: "3",
      name: "Charlie",
      username: "charlie",
    };

    userServiceMock.createUser.mockResolvedValue(createdUser);

    const result = await userResolvers.Mutation.createUser(
      null,
      args,
      mockContext,
    );

    expect(result).toEqual(createdUser);
    expect(userServiceMock.createUser).toHaveBeenCalledWith(args);
  });

  it("should handle validation errors", async () => {
    const args: CreateUserDTO = {
      name: "",
      username: "charlie",
      password: "password123",
    };

    const validationError = new Error("Name is required");
    validationError.name = "ValidationError";

    userServiceMock.createUser.mockRejectedValue(validationError);

    await expect(
      userResolvers.Mutation.createUser(null, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await userResolvers.Mutation.createUser(null, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Validation error");
      expect(error.extensions.code).toBe("BAD_USER_INPUT");
      expect(error.extensions.error).toBe("Name is required");
    }
  });

  it("should handle internal server errors", async () => {
    const args: CreateUserDTO = {
      name: "Charlie",
      username: "charlie",
      password: "password123",
    };

    userServiceMock.createUser.mockRejectedValue(new Error("Database error"));

    await expect(
      userResolvers.Mutation.createUser(null, args, mockContext),
    ).rejects.toThrow(GraphQLError);

    try {
      await userResolvers.Mutation.createUser(null, args, mockContext);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});
