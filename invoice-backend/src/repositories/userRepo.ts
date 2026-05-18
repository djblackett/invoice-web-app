import type {
  UserEntity,
  ReturnedUser,
  UserDTO,
  UserIdAndRole,
  UserWithPasswordHash,
} from "@/constants/types";

export interface IUserRepo {
  createUser: (userArgs: UserEntity) => Promise<UserIdAndRole>;
  createUserWithAuth0: (args: UserIdAndRole) => Promise<UserIdAndRole>;
  getAllUsers: () => Promise<ReturnedUser[]>;
  getUserById: (id: string) => Promise<UserDTO | null>;
  getUserByIdSafely: (id: string) => Promise<UserIdAndRole | null>;
  getUserByUsername: (username: string) => Promise<UserIdAndRole | null>;
  getUserForAuthentication: (email: string) => Promise<UserWithPasswordHash | null>;
  deleteAllUsers: () => Promise<boolean>;
  deleteAllUsersKeepAdmin: () => Promise<boolean>;
}
