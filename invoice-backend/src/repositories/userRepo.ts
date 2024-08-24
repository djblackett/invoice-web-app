import { CreateUserArgs, User } from "../constants/types";


export interface IUserRepo {
  createUser: (userArgs: CreateUserArgs, hashedPassword: string) => Promise<User>;
  findAllUsers: () => Promise<User[]>;
  findUserById: (id: number) => Promise<User>
}
