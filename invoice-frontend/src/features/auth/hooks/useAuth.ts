import { createContext, useContext } from "react";
import {
  User as Auth0User,
  GetTokenSilentlyOptions,
  LogoutOptions,
} from "@auth0/auth0-react";
import { User } from "@/features/users/types/userTypes.ts";

interface IAuthContext {
  canLogin?: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | Auth0User | null;
  getAccessTokenSilently: (options: GetTokenSilentlyOptions) => Promise<string>;
  loginWithRedirect: () => void | Promise<void>;
  toggleAdmin: () => void;
  logout: (logoutParams: LogoutOptions) => void | Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  canLogin: false,
  isAuthenticated: false,
  user: null,
  isLoading: false,
  loginWithRedirect: () => {},
  logout: () => {},
  toggleAdmin: () => {},
  getAccessTokenSilently: () => Promise.resolve(""),
});

export const useAuth = () => useContext(AuthContext);
