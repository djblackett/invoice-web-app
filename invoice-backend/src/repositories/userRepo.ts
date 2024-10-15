import { UserEntity, ReturnedUser, UserDTO } from "../constants/types";

export interface IUserRepo {
  createUser: (userArgs: UserEntity) => Promise<UserDTO>;
  findAllUsers: () => Promise<ReturnedUser[]>;
  findUserById: (id: number) => Promise<UserDTO | null>;
  findUserByUsername: (username: string) => Promise<UserEntity | null>;
  deleteAllUsers: () => Promise<boolean>;
}
