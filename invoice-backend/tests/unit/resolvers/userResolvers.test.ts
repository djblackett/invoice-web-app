import { MockProxy, mock } from "vitest-mock-extended";
import { getUserResolvers } from "../../../src/resolvers/userResolvers";
import { UserService } from "../../../src/services/user.service";
import { GraphQLError } from "graphql";
import {
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../../../src/config/exception.config";
import {
  CreateUserDTO,
  LoginArgs,
  UserDTO,
} from "../../../src/constants/types";

let userServiceMock: MockProxy<UserService>;
let userResolvers: {
  Query: { allUsers: () => Promise<UserDTO[]> };
  Mutation: any;
};

beforeEach(() => {
  userServiceMock = mock<UserService>();
  userResolvers = getUserResolvers(userServiceMock);
});

describe("Query.allUsers", () => {
  it("should return a list of users", async () => {
    const mockUsers = [
      { id: 1, name: "Alice", username: "alice" },
      { id: 2, name: "Bob", username: "bob" },
    ];

    userServiceMock.getUsers.mockResolvedValue(mockUsers);

    const result = await userResolvers.Query.allUsers();

    expect(result).toEqual(mockUsers);
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it("should handle no users", async () => {
    userServiceMock.getUsers.mockResolvedValue([]);
    const result = await userResolvers.Query.allUsers();
    expect(result).toEqual([]);
    expect(userServiceMock.getUsers).toHaveBeenCalled();
  });

  it("should handle internal server errors", async () => {
    userServiceMock.getUsers.mockRejectedValue(
      new InternalServerException("Internal server error"),
    );
    try {
      await userResolvers.Query.allUsers();
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
      id: 3,
      name: "Charlie",
      username: "charlie",
    };

    userServiceMock.createUser.mockResolvedValue(createdUser);

    const result = await userResolvers.Mutation.createUser(null, args);

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

    await expect(userResolvers.Mutation.createUser(null, args)).rejects.toThrow(
      GraphQLError,
    );

    try {
      await userResolvers.Mutation.createUser(null, args);
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

    await expect(userResolvers.Mutation.createUser(null, args)).rejects.toThrow(
      GraphQLError,
    );

    try {
      await userResolvers.Mutation.createUser(null, args);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});

describe("Mutation.login", () => {
  it("should log in a user and return a token", async () => {
    const args: LoginArgs = {
      username: "alice",
      password: "password123",
    };

    const loginResponse = {
      token: "fake-jwt-token",
      user: {
        id: 1,
        name: "Alice",
        username: "alice",
      },
    };

    userServiceMock.login.mockResolvedValue(loginResponse);

    const result = await userResolvers.Mutation.login(null, args);

    expect(result).toEqual(loginResponse);
    expect(userServiceMock.login).toHaveBeenCalledWith(
      args.username,
      args.password,
    );
  });

  it("should handle NotFoundException", async () => {
    const args: LoginArgs = {
      username: "nonexistent",
      password: "password123",
    };

    userServiceMock.login.mockRejectedValue(
      new NotFoundException("User not found"),
    );

    await expect(userResolvers.Mutation.login(null, args)).rejects.toThrow(
      GraphQLError,
    );

    try {
      await userResolvers.Mutation.login(null, args);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("User not found");
      expect(error.extensions.code).toBe("BAD_USER_INPUT");
    }
  });

  it("should handle UnauthorizedException", async () => {
    const args: LoginArgs = {
      username: "alice",
      password: "wrongpassword",
    };

    userServiceMock.login.mockRejectedValue(
      new UnauthorizedException("Invalid username or password"),
    );

    await expect(userResolvers.Mutation.login(null, args)).rejects.toThrow(
      GraphQLError,
    );

    try {
      await userResolvers.Mutation.login(null, args);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Invalid username or password");
      expect(error.extensions.code).toBe("UNAUTHENTICATED");
    }
  });

  it("should handle internal server errors", async () => {
    const args: LoginArgs = {
      username: "alice",
      password: "password123",
    };

    userServiceMock.login.mockRejectedValue(new Error("Database error"));

    await expect(userResolvers.Mutation.login(null, args)).rejects.toThrow(
      GraphQLError,
    );

    try {
      await userResolvers.Mutation.login(null, args);
    } catch (error: any) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect(error.message).toBe("Internal server error");
      expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
    }
  });
});
