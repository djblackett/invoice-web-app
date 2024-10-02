import {
  CreateUserArgs,
  LoggedInUser,
  ReturnedUser,
  User,
} from "../constants/types";

export interface IUserRepo {
  createUser: (
    userArgs: CreateUserArgs,
    hashedPassword: string,
  ) => Promise<ReturnedUser>;
  findAllUsers: () => Promise<User[]>;
  findUserById: (id: number) => Promise<User | null>;
  loginUser: (
    username: string,
    passwordHash: string,
  ) => Promise<LoggedInUser | null>;
}
