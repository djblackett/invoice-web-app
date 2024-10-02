import {
  CreateUserArgsHashedPassword,
  LoggedInUser,
  ReturnedUser,
  User,
} from "../constants/types";

export interface IUserRepo {
  createUser: (userArgs: CreateUserArgsHashedPassword) => Promise<ReturnedUser>;
  findAllUsers: () => Promise<ReturnedUser[]>;
  findUserById: (id: number) => Promise<User | null>;
  loginUser: (
    username: string,
    passwordHash: string,
  ) => Promise<LoggedInUser | null>;
}
