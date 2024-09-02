import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import container from "../src/config/inversify.config.ts";
import { DatabaseConnection } from "../src/database/prisma.database.connection.ts";

const prismaClient = container.get(DatabaseConnection).getDatabase();
jest.mock("./prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock =
  prismaClient as unknown as DeepMockProxy<PrismaClient>;
