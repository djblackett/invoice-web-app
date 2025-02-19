import { ReactNode } from "react";
import { AuthContext } from "../hooks/useAuth";
import { Role } from "@/types/types";

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  // Simulate an authenticated user in demo mode
  const demoAuth = {
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: "demoId",
      name: "Demo User",
      username: "demo@example.com",
      role: Role.USER,
    },
    loginWithRedirect: () => console.log("Demo login"),
    logout: () => console.log("Demo logout"),
    getAccessTokenSilently: () => Promise.resolve("demo-token"),
  };

  return (
    <AuthContext.Provider value={demoAuth}>{children}</AuthContext.Provider>
  );
};
