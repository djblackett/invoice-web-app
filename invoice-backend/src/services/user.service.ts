import { inject, injectable } from "inversify";
import {
  UserEntity,
  CreateUserDTO,
  UserDTO,
  UserIdAndRole,
} from "../constants/types";
import bcrypt from "bcryptjs";
import { IUserRepo } from "../repositories/userRepo";
import { validateUserCreate, validateUserList } from "../utils/utils";
import {
  InternalServerException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from "../config/exception.config";
import TYPES from "@/constants/identifiers";
import { Logger } from "@/config/logger.config";
import { DEMO_ID } from "../../prisma/demoWorkspace.cjs";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.IUserRepo) private readonly userRepo: IUserRepo,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  private requireUser(): UserIdAndRole {
    if (!this.userContext?.id || !this.userContext.role)
      throw new UnauthorizedException("User not authenticated");
    return this.userContext;
  }

  private isAdmin(user: UserIdAndRole): boolean {
    return user.role === "ADMIN" && !user.isDemo && user.id !== DEMO_ID;
  }

  private requireAdmin(): void {
    if (!this.isAdmin(this.requireUser()))
      throw new ForbiddenException("Only admin can manage users");
  }

  private authorizeProfile(id: string): void {
    const user = this.requireUser();
    // Reject before loading a foreign record, with the same missing-user error.
    if (!id || (!this.isAdmin(user) && user.id !== id))
      throw new NotFoundException("User not found");
  }

  createUser = async (args: CreateUserDTO): Promise<UserDTO> => {
    this.requireAdmin();
    try {
      const validatedArgs = validateUserCreate(args);
      const hashedPassword = await bcrypt.hash(args.password, 10);

      const userEntity: UserEntity = {
        name: validatedArgs.name ?? "",
        username: validatedArgs.username,
        passwordHash: hashedPassword,
      };

      const createdUser = await this.userRepo.createUser(userEntity);

      const userDTO: UserDTO = {
        id: createdUser.id,
        name: createdUser.name ?? "",
        username: createdUser.username ?? "",
      };

      return userDTO;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw new ValidationException("User validation failed");
    }
  };

  createUserWithAuth0 = async (args: UserIdAndRole): Promise<UserIdAndRole> => {
    const user = this.requireUser();
    if (
      args.id !== user.id ||
      (user.id === DEMO_ID && (!user.isDemo || user.role !== "USER")) ||
      (user.isDemo && user.id !== DEMO_ID)
    )
      throw new ForbiddenException(
        "Only authenticated self-provisioning is allowed",
      );
    // Identity, initial role and profile come from the verified bound context.
    const createdUser = await this.userRepo.createUserWithAuth0({
      id: user.id,
      role: user.role,
      name: user.name,
      username: user.username,
    });

    const userDTO: UserIdAndRole = {
      id: createdUser.id,
      name: createdUser.name,
      username: createdUser.username ?? "",
      role: createdUser.role,
    };

    return userDTO;
  };

  getUsers = async () => {
    this.requireAdmin();
    try {
      const userList = await this.userRepo.getAllUsers();
      const validatedUserList: UserDTO[] = validateUserList(userList);
      return validatedUserList;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw new InternalServerException("Internal server error");
    }
  };

  getUser = async (id: string) => {
    this.authorizeProfile(id);
    const user = await this.userRepo.getUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userDTO: UserDTO = {
      id: user.id ?? "",
      name: user.name,
      username: user.username,
    };
    return userDTO;
  };

  getUserByIdSafely = async (id: string) => {
    this.authorizeProfile(id);
    const user = await this.userRepo.getUserByIdSafely(id);
    return user;
  };

  deleteUsers = async (): Promise<boolean> => {
    this.requireAdmin();
    return await this.userRepo.deleteAllUsers();
  };

  deleteUsersKeepAdmin = async (): Promise<boolean> => {
    this.requireAdmin();
    return await this.userRepo.deleteAllUsersKeepAdmin();
  };
}
