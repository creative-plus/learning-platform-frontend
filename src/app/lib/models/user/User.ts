import { UserType } from "./UserType";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: UserType;
}