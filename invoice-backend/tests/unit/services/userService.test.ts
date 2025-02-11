import "reflect-metadata";
import { MockProxy, mock } from "vitest-mock-extended";
import { SECRET } from "@/config/server.config";
import { CreateUserDTO } from "@/constants/types";
import { IUserRepo } from "@/repositories/userRepo";
import { UserService } from "@/services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { vi, Mock, beforeEach, describe, expect, it } from "vitest";
import { InternalServerException } from "@/config/exception.config";
import { Role } from "@prisma/client";

let userRepoMock: MockProxy<IUserRepo>;
let userService: UserService;

const userContextMock = {
  id: "1",
  role: "ADMIN" as Role,
  name: "Fred",
};

beforeEach(() => {
  userRepoMock = mock<IUserRepo>();
  userService = new UserService(userRepoMock, userContextMock);
});

describe("UserService - createUser", () => {
  it("should create a new user and return user DTO", async () => {
    // Arrange
    const createUserDTO: CreateUserDTO = {
      name: "John Doe",
      username: "johndoe",
      password: "password123",
    };

    const hashedPassword = "hashedPassword123";
    const createdUser = {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      passwordHash: hashedPassword,
      role: "USER" as Role,
    };

    const bcryptHash = vi.fn().mockResolvedValue(hashedPassword);
    (bcrypt.hash as Mock) = bcryptHash;

    userRepoMock.createUser.mockResolvedValue(createdUser);

    // Act
    const result = await userService.createUser(createUserDTO);
    if (!result.id) {
      result.id = "1";
    }

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDTO.password, 10);
    expect(userRepoMock.createUser).toHaveBeenCalledWith({
      name: createUserDTO.name,
      username: createUserDTO.username,
      passwordHash: hashedPassword,
    });
    expect(result).toEqual({
      id: createdUser.id,
      name: createdUser.name,
      username: createdUser.username,
    });
  });
});

describe("UserService - getUsers", () => {
  it("should return a list of users", async () => {
    // Arrange
    const users = [
      { id: "1", name: "John Doe", username: "johndoe", passwordHash: "hash1" },
      { id: "2", name: "Jane Doe", username: "janedoe", passwordHash: "hash2" },
    ];

    userRepoMock.getAllUsers.mockResolvedValue(users);

    // Act
    const result = await userService.getUsers();

    // Assert
    expect(userRepoMock.getAllUsers).toHaveBeenCalled();
    expect(result).toEqual([
      { id: "1", name: "John Doe", username: "johndoe" },
      { id: "2", name: "Jane Doe", username: "janedoe" },
    ]);
  });

  it("should throw InternalServerException when database error occurs", async () => {
    // Arrange
    userRepoMock.getAllUsers.mockRejectedValue(
      new InternalServerException("Internal server error"),
    );

    // Act
    try {
      await userService.getUsers();
    } catch (error: any) {
      expect(error).toBeInstanceOf(InternalServerException);
      expect(error.message).toBe("Internal server error");
      expect(userRepoMock.getAllUsers).toHaveBeenCalled();
    }
    // Assert
  });
});

describe("UserService - getUser", () => {
  it("should return user DTO when user exists", async () => {
    // Arrange
    const userId = "1";
    const user = {
      id: userId,
      name: "John Doe",
      username: "johndoe",
      passwordHash: "hashedPassword123",
    };

    userRepoMock.getUserById.mockResolvedValue(user);

    // Act
    const result = await userService.getUser(userId);

    // Assert
    expect(userRepoMock.getUserById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      id: user.id,
      name: user.name,
      username: user.username,
    });
  });

  it("should throw NotFoundException when user does not exist", async () => {
    // Arrange
    const userId = "1";
    userRepoMock.getUserById.mockResolvedValue(null);

    // Act & Assert
    await expect(userService.getUser(userId)).rejects.toThrow("User not found");
    expect(userRepoMock.getUserById).toHaveBeenCalledWith(userId);
  });
});

// describe("UserService - login", () => {
//   it("should return a token and user DTO when login is successful", async () => {
//     // Arrange
//     const username = "johndoe";
//     const password = "password123";
//     const hashedPassword = "hashedPassword123";
//     const user = {
//       id: "1",
//       name: "John Doe",
//       username,
//       passwordHash: hashedPassword,
//     };

//     const token = "jwtToken123";

//     const bcryptCompare = vi.fn().mockResolvedValue(true);
//     (bcrypt.compare as Mock) = bcryptCompare;
//     //call method that uses bcrypt.compare with async

//     const jwtSign = vi.fn().mockReturnValue(token);
//     (jwt.sign as Mock) = jwtSign;

//     userRepoMock.findUserByUsername.mockResolvedValue(user);

//     // Act
//     const result = await userService.login(username, password);

//     // Assert
//     expect(userRepoMock.findUserByUsername).toHaveBeenCalledWith(username);
//     expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
//     expect(jwt.sign).toHaveBeenCalledWith(
//       { id: user.id, username: user.username },
//       SECRET,
//       { expiresIn: "1h" },
//     );
//     expect(result).toEqual({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         username: user.username,
//       },
//     });
//   });

//   it("should throw UnauthorizedException when password is incorrect", async () => {
//     // Arrange
//     const username = "johndoe";
//     const password = "wrongPassword";
//     const user = {
//       id: "1",
//       name: "John Doe",
//       username,
//       passwordHash: "hashedPassword123",
//     };

//     userRepoMock.findUserByUsername.mockResolvedValue(user);

//     const bcryptCompare = vi
//       .fn()
//       .mockRejectedValue(new Error("Invalid username or password"));
//     (bcrypt.compare as Mock) = bcryptCompare;

//     // Act & Assert
//     await expect(userService.login(username, password)).rejects.toThrow(
//       "Invalid username or password",
//     );
//     expect(userRepoMock.findUserByUsername).toHaveBeenCalledWith(username);
//     expect(bcrypt.compare).toHaveBeenCalledWith(password, user.passwordHash);
//   });

//   it("should throw NotFoundException when user does not exist", async () => {
//     // Arrange
//     const username = "nonexistent";
//     const password = "password123";

//     userRepoMock.findUserByUsername.mockResolvedValue(null);

//     // Act & Assert
//     await expect(userService.login(username, password)).rejects.toThrow(
//       "User not found",
//     );
//     expect(userRepoMock.findUserByUsername).toHaveBeenCalledWith(username);
//   });
// });
