import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { Logger } from "@/config/logger.config";
import type { UserService } from "@/services/user.service";
import type { UserIdAndRole } from "@/constants/types";

const logger = container.get<Logger>(TYPES.Logger);

export async function getOrCreateDbUser(
  user: UserIdAndRole,
  userService: UserService,
) {
  try {
    let dbUser = await userService.getUserByIdSafely(user.id);

    if (!dbUser) {
      logger.info("User not found, creating user");
      dbUser = await userService.createUserWithAuth0({
        id: user.id,
        name: user.name,
        username: user.username ?? "",
        role: user.role,
      });
    }

    return dbUser;
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(`Error creating user: ${e.message}`);
    } else {
      logger.error(`Error creating user: ${String(e)}`);
    }
    throw e;
  }
}
