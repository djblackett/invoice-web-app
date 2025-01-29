import {
  UserEntity,
  ReturnedUser,
  UserDTO,
  UserIdAndRole,
} from "../constants/types";

export interface IUserRepo {
  createUser: (userArgs: UserEntity) => Promise<UserDTO>;
  createUserWithAuth0: (args: UserIdAndRole) => Promise<UserIdAndRole>;
  findAllUsers: () => Promise<ReturnedUser[]>;
  findUserById: (id: string) => Promise<UserDTO | null>;
  findUserByUsername: (username: string) => Promise<UserEntity | null>;
  getUserSafely: (id: string) => Promise<UserIdAndRole | null>;
  deleteAllUsers: () => Promise<boolean>;
}
