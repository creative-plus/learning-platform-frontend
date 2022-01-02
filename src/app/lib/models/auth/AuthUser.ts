import { UserType } from "../user/UserType";

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: UserType
}