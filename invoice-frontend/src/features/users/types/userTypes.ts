import { User as Auth0User } from "@auth0/auth0-spa-js";

export enum Role {
  "USER",
  "ADMIN",
}

export interface User extends Auth0User {
  id: string;
  username: string;
  name?: string;
  role: Role;
}
