import { inject, injectable } from "inversify";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import {
  CreateUserArgsHashedPassword,
  CreateUserArgsUnhashedPassword,
} from "../constants/types";
import bcrypt from "bcrypt";
import { IUserRepo } from "../repositories/userRepo";
import { validateReturnedUser, validateUserCreate } from "../utils";
import { GraphQLError } from "graphql";
import { SECRET } from "../config/server.config";
import jwt from "jsonwebtoken";

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
    const user = await this.userRepo.loginUser(username, password);

    if (!SECRET) {
      console.log("Server env secret not set");
      return;
    }

    console.log("before match");

    // todo - adjust code and types so that returned user has passwordhash, but it doesn't get sent outside of service

    if (user) {
      const match = await bcrypt.compare(password, user.passwordHash);

      // todo - does this go in middleware, or is that for receiving the webtoken?
      // todo - what should be returned? webtoken? Currently doesn't make sense
      console.log("match:", match);
      if (match) {
        // let jwt;
        return {
          value: jwt.sign(JSON.stringify(user), SECRET),
        };
      } else {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    }
    const validatedLoggedInUser = validateReturnedUser(user);

    return validatedLoggedInUser;
  };

  getUser = async (id: number) => {
    const result = await this.userRepo.findUserById(id);
    const validatedUser = validateReturnedUser(result);
    return validatedUser;
  };
}
