import { inject, injectable } from "inversify";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import { CreateUserArgs } from "../constants/types";
import bcrypt from "bcrypt";
import { IUserRepo } from "../repositories/userRepo";

@injectable()
export class UserService {
  constructor(@inject(PrismaUserRepo) private readonly userRepo: IUserRepo) {}

  createUser = async (args: CreateUserArgs) => {
    const hashedPassword = await bcrypt.hash(args.password, 10);
    return await this.userRepo.createUser(args, hashedPassword);
  };

  getUsers = async () => {
    return await this.userRepo.findAllUsers();
  };

  login = async (email: string, password: string) => {
    return await this.userRepo.loginUser(email, password);
  };

  getUser = async (id: number) => {
    return await this.userRepo.findUserById(id);
  };
}
