import { ReactNode, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import { Role } from "@/types/types";

const demoUser = {
  id: "demoId",
  name: "Demo User",
  email: "demo@example.com",
  role: Role.USER,
};

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<typeof demoUser | null>(null);

  const loginWithRedirect = () => {
    console.log("Demo login");
    setIsAuthenticated(true);
    setUser(demoUser);
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
    getAccessTokenSilently: () => Promise.resolve("demo-token"),
  };

  return (
    <AuthContext.Provider value={demoAuth}>{children}</AuthContext.Provider>
  );
};
