import { ReactNode, useState } from "react";
import { AuthContext } from "../hooks/useAuth.ts";

import { Role } from "@/features/users/types/userTypes.ts";

const demoUser = {
  id: "demoId",
  name: "Demo User",
  email: "demo-user@example.com",
  role: Role.USER,
};

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<typeof demoUser | null>(demoUser);

  const loginWithRedirect = () => {
    setIsAuthenticated(true);
    setUser(demoUser);
  };

  // Retired no-op retained for the existing AuthContext contract/4A probe.
  // There is no role-switching implementation or production UI caller.
  const toggleAdmin = () => {};

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const demoAuth = {
    isAuthenticated,
    isLoading: false,
    user,
    loginWithRedirect,
    logout,
    toggleAdmin,
    getAccessTokenSilently: () => Promise.resolve("demo-token"),
  };

  return (
    <AuthContext.Provider value={demoAuth}>{children}</AuthContext.Provider>
  );
};
