import { createContext, useContext } from "react";
import {
  User as Auth0User,
  GetTokenSilentlyOptions,
  LogoutOptions,
} from "@auth0/auth0-react";
import { User } from "@/features/users/types/userTypes.ts";

interface IAuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | Auth0User | null;
  getAccessTokenSilently: (options: GetTokenSilentlyOptions) => Promise<string>;
  loginWithRedirect: () => void;
  toggleAdmin: () => void;
  logout: (logoutParams: LogoutOptions) => void;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  loginWithRedirect: () => {},
  logout: () => {},
  toggleAdmin: () => {},
  getAccessTokenSilently: async () => "",
});

export const useAuth = () => useContext(AuthContext);
