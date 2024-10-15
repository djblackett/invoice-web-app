import { inject, injectable } from "inversify";
import { PrismaUserRepo } from "../repositories/implementations/prismaUserRepo";
import {
  UserEntity,
  CreateUserDTO,
  UserDTO,
  LoginResponseDTO,
} from "../constants/types";
import bcrypt from "bcrypt";
import { IUserRepo } from "../repositories/userRepo";
import { validateUserCreate, validateUserList } from "../utils";
import { SECRET } from "../config/server.config";
import jwt from "jsonwebtoken";
import {
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../config/exception.config";

@injectable()
export class UserService {
  constructor(@inject(PrismaUserRepo) private readonly userRepo: IUserRepo) {}

  createUser = async (args: CreateUserDTO): Promise<UserDTO> => {
    const validatedArgs = validateUserCreate(args);
    const hashedPassword = await bcrypt.hash(args.password, 10);

    const userEntity: UserEntity = {
      name: validatedArgs.name,
      username: validatedArgs.username,
      passwordHash: hashedPassword,
    };

    const createdUser = await this.userRepo.createUser(userEntity);

    const userDTO: UserDTO = {
      id: createdUser.id,
      name: createdUser.name,
      username: createdUser.username,
    };

    return userDTO;
  };

  getUsers = async () => {
    try {
      const userList = await this.userRepo.findAllUsers();
      const validatedUserList: UserDTO[] = validateUserList(userList);
      return validatedUserList;
    } catch (error) {
      console.error(error);
      throw new InternalServerException("Internal server error");
    }
  };

  getUser = async (id: number) => {
    const user = await this.userRepo.findUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userDTO: UserDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
    };
    return userDTO;
  };

  login = async (
    username: string,
    password: string,
  ): Promise<LoginResponseDTO> => {
    const user = await this.userRepo.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
    };

    const userDTO: UserDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const token = jwt.sign(tokenPayload, SECRET, { expiresIn: "1h" });
    const loginResponse: LoginResponseDTO = { token: token, user: userDTO };
    return loginResponse;
  };

  deleteUsers = async (): Promise<boolean> => {
    return await this.userRepo.deleteAllUsers();
  };
}
