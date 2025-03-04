import { ReactNode, useState } from "react";
import { AuthContext } from "../hooks/useAuth.ts";

import { Role } from "@/features/users/types/userTypes.ts";

const demoUser = {
  id: "demoId",
  name: "Demo User",
  email: "demo-user@example.com",
  role: Role.USER,
};

const demoAdmin = {
  id: "demoAdminId",
  name: "Demo Admin",
  email: "demo-admin@example.com",
  role: Role.ADMIN,
};

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<typeof demoUser | null>(null);

  const loginWithRedirect = () => {
    console.log("Demo login");
    setIsAuthenticated(true);
    setUser(demoUser);
  };

  const toggleAdmin = () => {
    setUser(user === demoUser ? demoAdmin : demoUser);
  };

  const logout = () => {
    console.log("Demo logout");
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
