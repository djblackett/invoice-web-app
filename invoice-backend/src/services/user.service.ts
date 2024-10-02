import { inject, injectable } from "inversify";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import {
  CreateUserArgsHashedPassword,
  CreateUserArgsUnhashedPassword,
} from "../constants/types";
import bcrypt from "bcrypt";
import { IUserRepo } from "../repositories/userRepo";
import { validateReturnedUser, validateUserCreate } from "../utils";

@injectable()
export class UserService {
  constructor(@inject(PrismaUserRepo) private readonly userRepo: IUserRepo) {}

  createUser = async (args: CreateUserArgsUnhashedPassword) => {
    const validatedArgs = validateUserCreate(args);
    const hashedPassword = await bcrypt.hash(args.password, 10);

    const userArgs: CreateUserArgsHashedPassword = {
      name: validatedArgs.name,
      username: validatedArgs.username,
      hashedPassword: hashedPassword,
    };

    const result = await this.userRepo.createUser(userArgs);
    return result;
  };

  getUsers = async () => {
    const userList = await this.userRepo.findAllUsers();
    const validatedUserList = validateReturnedUser(userList);
    return validatedUserList;
  };

  login = async (username: string, password: string) => {
    const loggedInUser = await this.userRepo.loginUser(username, password);
    const validatedLoggedInUser = validateReturnedUser(loggedInUser);
    return validatedLoggedInUser;
  };

  getUser = async (id: number) => {
    const result = await this.userRepo.findUserById(id);
    const validatedUser = validateReturnedUser(result);
    return validatedUser;
  };
}
