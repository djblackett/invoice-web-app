// test/utils/mockUserFactory.ts
import { UserIdAndRole } from "../../src/constants/types";

export const adminUser: UserIdAndRole = {
    id: "admin-user",
    username: "admin@example.com",
    role: "ADMIN",
    name: "Admin User"
};

export const normalUser: UserIdAndRole = {
    id: "user-123",
    username: "user@example.com",
    role: "USER",
    name: "Normal User"
};

export const makeMockUser = (
  overrides: Partial<UserIdAndRole> = {},
): UserIdAndRole => ({
  id: "mock-user",
  username: "mock@example.com",
  role: "USER",
  name: "Mock User",
  ...overrides,
});
