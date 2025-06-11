import { inject, injectable } from "inversify";
import {
  UserEntity,
  CreateUserDTO,
  UserDTO,
  UserIdAndRole,
  TenantDTO,
} from "../constants/types";
import bcrypt from "bcryptjs";
import { IUserRepo } from "../repositories/userRepo";
import { validateUserCreate, validateUserList } from "../utils/utils";
import {
  InternalServerException,
  NotFoundException,
  ValidationException,
} from "../config/exception.config";
import TYPES from "@/constants/identifiers";
import { Logger } from "@/config/logger.config";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.IUserRepo) private readonly userRepo: IUserRepo,
    @inject(TYPES.UserContext)
    private readonly userContext: UserIdAndRole | null,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  createUser = async (args: CreateUserDTO): Promise<UserDTO> => {
    try {
      const validatedArgs = validateUserCreate(args);
      const hashedPassword = await bcrypt.hash(args.password, 10);

      const userEntity: UserEntity = {
        name: validatedArgs.name ?? "",
        username: validatedArgs.username,
        passwordHash: hashedPassword,
        tenantId: validatedArgs.tenantId,
      };

      const createdUser = await this.userRepo.createUser(userEntity);

    const userDTO: UserDTO = {
      id: createdUser.id,
      name: createdUser.name ?? "",
      username: createdUser.username ?? "",
      tenantId: createdUser.tenantId ?? null,
    };

      return userDTO;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw new ValidationException("User validation failed");
    }
  };

  createTenant = async (name: string): Promise<TenantDTO> => {
    try {
      return await this.userRepo.createTenant(name);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw new InternalServerException("Internal server error");
    }
  };

  createUserWithAuth0 = async (args: UserIdAndRole): Promise<UserIdAndRole> => {
    const createdUser = await this.userRepo.createUserWithAuth0(args);

    const userDTO: UserIdAndRole = {
      id: createdUser.id,
      name: createdUser.name,
      username: createdUser.username ?? "",
      role: createdUser.role,
    };

    return userDTO;
  };

  getUsers = async () => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }
    try {
      const userList = await this.userRepo.getAllUsers(this.userContext?.tenantId ?? undefined);
      const validatedUserList: UserDTO[] = validateUserList(userList);
      return validatedUserList;
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error));
      throw new InternalServerException("Internal server error");
    }
  };

  getUser = async (id: string) => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    if (!id) {
      throw new ValidationException("Unauthorized");
    }
    const user = await this.userRepo.getUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userDTO: UserDTO = {
      id: user.id ?? "",
      name: user.name,
      username: user.username,
      tenantId: user.tenantId ?? null,
    };
    return userDTO;
  };

  getUserByIdSafely = async (id: string) => {
    const user = await this.userRepo.getUserByIdSafely(id);
    return user;
  };

  deleteUsers = async (): Promise<boolean> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }
    return await this.userRepo.deleteAllUsers();
  };

  deleteUsersKeepAdmin = async (): Promise<boolean> => {
    if (!this.userContext) {
      throw new ValidationException("Unauthorized");
    }

    const { role, id } = this.userContext;

    if (!id) {
      throw new ValidationException("Unauthorized");
    }

    if (role !== "ADMIN") {
      throw new ValidationException("Unauthorized - must be ADMIN");
    }
    return await this.userRepo.deleteAllUsersKeepAdmin();
  };
}
