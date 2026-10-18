import { inject, injectable } from "inversify";
import { DatabaseConnection } from "../database/prisma.database.connection";
import TYPES from "../constants/identifiers";
import type { UserIdAndRole } from "../constants/types";
import { ForbiddenException } from "../config/exception.config";
import { DEMO_ID, resetDemoWorkspace } from "../../prisma/demoWorkspace.cjs";

@injectable()
export class DemoService {
  constructor(
    @inject(DatabaseConnection) private readonly database: DatabaseConnection,
    @inject(TYPES.UserContext) private readonly user: UserIdAndRole | null,
  ) {}

  async reset(): Promise<boolean> {
    if (
      process.env["DEMO_MODE"] !== "true" ||
      this.user?.isDemo !== true ||
      this.user.id !== DEMO_ID ||
      this.user.role !== "USER"
    ) {
      throw new ForbiddenException(
        "Only the authenticated demo user can reset demo data",
      );
    }
    await resetDemoWorkspace(this.database.getDatabase());
    return true;
  }
}
