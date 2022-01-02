import { AuthUser } from "./AuthUser";

export interface AuthResponse {
  token?: string;
  user?: AuthUser;
  error?: any 
}