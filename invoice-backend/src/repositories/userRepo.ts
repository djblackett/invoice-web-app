import {
  UserEntity,
  ReturnedUser,
  UserDTO,
  UserIdAndRole,
} from "@/constants/types";

export interface IUserRepo {
  createUser: (userArgs: UserEntity) => Promise<UserIdAndRole>;
  createUserWithAuth0: (args: UserIdAndRole) => Promise<UserIdAndRole>;
  getAllUsers: () => Promise<ReturnedUser[]>;
  getUserById: (id: string) => Promise<UserDTO | null>;
  getUserByIdSafely: (id: string) => Promise<UserIdAndRole | null>;
  deleteAllUsers: () => Promise<boolean>;
  deleteAllUsersKeepAdmin: () => Promise<boolean>;
}
